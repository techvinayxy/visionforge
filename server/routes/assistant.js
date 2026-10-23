const express = require("express");

const router = express.Router();

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestBuckets = new Map();

function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const current = requestBuckets.get(key);

  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    return next();
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    res.set("Retry-After", String(Math.ceil((RATE_LIMIT_WINDOW_MS - (now - current.startedAt)) / 1000)));
    return res.status(429).json({ message: "You're sending messages too quickly. Please wait a minute and try again." });
  }

  current.count += 1;
  return next();
}

// In-memory protection for a single server process; use shared-store limiting
// before scaling to multiple instances.
router.post("/", rateLimit, async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;

  if (!apiKey || !model) {
    return res.status(503).json({
      message: "MJ AI is not configured yet. Please try again later.",
    });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return res.status(400).json({
      message: `Send between 1 and ${MAX_MESSAGES} recent messages.`,
    });
  }

  const contents = [];
  for (const message of messages) {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.text !== "string" ||
      !message.text.trim() ||
      message.text.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        message: "Each message must have a valid role and text up to 2000 characters.",
      });
    }

    contents.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.text.trim() }],
    });
  }

  if (contents[contents.length - 1].role !== "user") {
    return res.status(400).json({
      message: "The latest message must be from the user.",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: [
                "You are MJ, the helpful technology assistant for VISIONFORGE, a technology marketplace.",
                "Help users think through PC builds, gaming hardware, laptops, phones, budgets, and compatibility.",
                "Be friendly, concise, honest, and practical. Ask a clarifying question when important details are missing.",
                "Never invent catalogue inventory, prices, benchmarks, or product specifications. The current catalogue is not provided to you, so clearly say when a detail needs verification on the website.",
                "Do not claim to have checked live stock, placed orders, or changed account data.",
              ].join(" "),
            }],
          },
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 700,
          },
        }),
        signal: AbortSignal.timeout(25000),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Gemini API request failed with status:", response.status);
      if (response.status === 429) {
        return res.status(429).json({
          message: "MJ is getting too many requests right now. Please try again shortly.",
        });
      }
      return res.status(502).json({
        message: "MJ couldn't get an AI response right now. Please try again shortly.",
      });
    }

    const text = result.candidates
      ?.flatMap((candidate) => candidate.content?.parts || [])
      .map((part) => part.text || "")
      .join("")
      .trim();

    if (!text) {
      return res.status(502).json({
        message: "MJ couldn't generate a response to that message. Please try rephrasing it.",
      });
    }

    return res.json({ text });
  } catch (error) {
    const isTimeout = error.name === "TimeoutError" || error.name === "AbortError";
    if (!isTimeout) {
      console.error("MJ AI request failed:", error.message);
    }
    return res.status(isTimeout ? 504 : 502).json({
      message: isTimeout
        ? "MJ took too long to respond. Please try again."
        : "MJ is temporarily unavailable. Please try again shortly.",
    });
  }
});

module.exports = router;
