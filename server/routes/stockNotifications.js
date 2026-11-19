const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const StockNotification = require("../models/StockNotification");

const router = express.Router();

function isValidEmail(email) {
  return typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeEqual(leftValue, rightValue) {
  if (!leftValue || !rightValue) return false;
  const left = Buffer.from(String(leftValue));
  const right = Buffer.from(String(rightValue));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

async function sendBackInStockEmail(email, productName) {
  const safeName = escapeHtml(productName);
  const subject = `${productName} is back in stock | VISIONFORGE`;
  const text = `Good news! ${productName} is back in stock at VISIONFORGE. Visit https://visionforge-lemon.vercel.app/products to check availability. Build. Power. Create.`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#0f1115;color:#f5f5f7;padding:28px;border-radius:12px;max-width:520px;margin:auto">
      <h2 style="color:#8f82ff;letter-spacing:1px">VISIONFORGE</h2>
      <h3 style="color:#fff">${safeName} is back in stock!</h3>
      <p style="color:#c9cbd4">The product you asked us to track is available again.</p>
      <p><a href="https://visionforge-lemon.vercel.app/products" style="display:inline-block;background:#6c5ce7;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">View Products</a></p>
      <p style="color:#888;font-size:12px">Build. Power. Create.</p>
    </div>`;

  const provider = (
    process.env.EMAIL_PROVIDER ||
    (process.env.BREVO_API_KEY ? "brevo" : process.env.RESEND_API_KEY ? "resend" : "smtp")
  ).toLowerCase();

  if (provider === "brevo") {
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      throw new Error("Brevo email settings are missing.");
    }
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "VISIONFORGE", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Brevo email request failed (${response.status}).`);
    return;
  }

  if (provider === "resend") {
    if (!process.env.RESEND_API_KEY) throw new Error("Resend is not configured.");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "VISIONFORGE <onboarding@resend.dev>",
        to: [email],
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Resend email request failed (${response.status}).`);
    return;
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) {
    throw new Error("Email provider is not configured.");
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD.replace(/\s/g, ""),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  await transporter.sendMail({
    from: { name: "VISIONFORGE", address: process.env.SMTP_USER },
    to: email,
    subject,
    text,
    html,
  });
}

router.post("/subscribe", async (req, res) => {
  try {
    const productId = Number(req.body?.productId);
    const productName = typeof req.body?.productName === "string"
      ? req.body.productName.trim()
      : "";
    const email = typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

    if (!Number.isInteger(productId) || productId < 1 ||
        !productName || productName.length > 160 || !isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address to receive a stock alert." });
    }

    await StockNotification.updateOne(
      { productId, email },
      { $set: { productName } },
      { upsert: true, runValidators: true }
    );

    return res.status(200).json({
      message: "You're on the list! We'll email you when this product is back in stock.",
    });
  } catch (error) {
    console.error("Stock notification signup failed:", error.message);
    return res.status(500).json({ message: "Unable to save your request right now. Please try again." });
  }
});

// Called by a trusted inventory workflow after stock has been updated above zero.
// Keep STOCK_NOTIFICATION_SECRET only in the server environment; never expose it to the browser.
router.post("/restock", async (req, res) => {
  const configuredSecret = process.env.STOCK_NOTIFICATION_SECRET;
  const suppliedSecret = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!configuredSecret || configuredSecret.length < 32 || !safeEqual(suppliedSecret, configuredSecret)) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const productId = Number(req.body?.productId);
  const productName = typeof req.body?.productName === "string" ? req.body.productName.trim() : "";
  const stock = Number(req.body?.stock);
  if (!Number.isInteger(productId) || productId < 1 || !productName || productName.length > 160 ||
      !Number.isFinite(stock) || stock <= 0) {
    return res.status(400).json({ message: "A valid product and positive stock quantity are required." });
  }

  try {
    const subscribers = await StockNotification.find({ productId }).lean();
    let sent = 0;
    const failed = [];
    for (const subscriber of subscribers) {
      try {
        await sendBackInStockEmail(subscriber.email, productName);
        await StockNotification.deleteOne({ _id: subscriber._id });
        sent += 1;
      } catch (error) {
        console.error("Back-in-stock email failed:", error.message);
        failed.push(subscriber.email);
      }
    }
    return res.json({ message: "Restock notification run completed.", subscribers: subscribers.length, sent, failed });
  } catch (error) {
    console.error("Restock notification run failed:", error.message);
    return res.status(500).json({ message: "Unable to process stock notifications." });
  }
});

module.exports = router;
