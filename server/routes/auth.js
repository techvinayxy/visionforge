
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");

const router = express.Router();

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_RESENDS = 5;

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    surname: user.surname,
    email: user.email,
  };
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(email, otp) {
  if (!process.env.OTP_SECRET) {
    throw new Error("OTP_SECRET is not configured.");
  }

  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(`${email}:${otp}`)
    .digest("hex");
}

function safeCompareHex(a, b) {
  if (
    typeof a !== "string" ||
    typeof b !== "string" ||
    !/^[a-f0-9]{64}$/i.test(a) ||
    !/^[a-f0-9]{64}$/i.test(b)
  ) {
    return false;
  }

  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");

  return crypto.timingSafeEqual(left, right);
}

function isValidEmail(email) {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

async function sendOtpEmail(email, otp) {
  const html = `
      <div style="font-family:Arial,sans-serif;background:#0f1115;color:#f5f5f7;padding:28px;border-radius:12px;max-width:520px;margin:auto">
        <h2 style="color:#8f82ff;letter-spacing:1px">VISIONFORGE</h2>
        <p style="font-size:16px">Use this code to verify your email address:</p>
        <div style="background:#191b24;border:1px solid #38334f;border-radius:12px;padding:20px;text-align:center;margin:24px 0">
          <span style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#ffffff">${otp}</span>
        </div>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p style="color:#a4a8b5;font-size:13px">If you did not request this code, you can safely ignore this email.</p>
        <p style="color:#777b89;font-size:12px;margin-top:28px">Build. Power. Create.</p>
      </div>
    `;
  const text =
    `Your VISIONFORGE verification code is ${otp}.\n\n` +
    "It expires in 5 minutes. If you did not request this, ignore this email.";

  // Choose the provider. EMAIL_PROVIDER ("resend" | "brevo" | "smtp") wins if set;
  // otherwise keep the previous behaviour (Resend if its key exists), then Brevo, then Gmail SMTP.
  const provider = (
    process.env.EMAIL_PROVIDER ||
    (process.env.RESEND_API_KEY ? "resend" : process.env.BREVO_API_KEY ? "brevo" : "smtp")
  ).toLowerCase();

  // Brevo HTTPS API: works on Render's free plan (SMTP ports are blocked) and only
  // needs a single verified sender address instead of a verified domain.
  if (provider === "brevo") {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    if (!apiKey || !senderEmail) {
      throw new Error("Brevo is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.");
    }
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "VISIONFORGE", email: senderEmail },
        to: [{ email }],
        subject: "Your VISIONFORGE verification code",
        textContent: text,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage =
        typeof result.message === "string" ? result.message : "Brevo email API request failed.";
      throw new Error(`Brevo API error (${response.status}): ${providerMessage}`);
    }
    return;
  }

  // Resend HTTPS API (needs a verified domain to send to anyone but the account owner).
  if (provider === "resend") {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Resend is not configured. Set RESEND_API_KEY.");
    }
    const from = process.env.EMAIL_FROM || "VISIONFORGE <onboarding@resend.dev>";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your VISIONFORGE verification code",
        text,
        html,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage =
        typeof result.message === "string" ? result.message : "Resend email API request failed.";
      throw new Error(`Resend API error (${response.status}): ${providerMessage}`);
    }
    return;
  }

  // Backward-compatible Gmail fallback if no Resend key is configured.
  const user = process.env.SMTP_USER;
  const appPassword = process.env.SMTP_APP_PASSWORD;
  if (!user || !appPassword) {
    throw new Error("Email provider is not configured. Set RESEND_API_KEY.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass: appPassword.replace(/\\s/g, ""),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  await transporter.sendMail({
    from: { name: "VISIONFORGE", address: user },
    to: email,
    subject: "Your VISIONFORGE verification code",
    text,
    html,
  });
}

function validateRegistration(body) {
  const { firstName, surname, email, password } = body || {};

  if (
    typeof firstName !== "string" ||
    typeof surname !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Please provide all required fields." };
  }

  const cleanFirstName = firstName.trim();
  const cleanSurname = surname.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (
    !cleanFirstName ||
    cleanFirstName.length > 50 ||
    !cleanSurname ||
    cleanSurname.length > 50
  ) {
    return { error: "Please enter valid first and last names." };
  }

  if (!isValidEmail(cleanEmail)) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < 8 || password.length > 128) {
    return { error: "Password must be 8–128 characters long." };
  }

  return {
    value: {
      firstName: cleanFirstName,
      surname: cleanSurname,
      email: cleanEmail,
      password,
    },
  };
}

// Step 1: Start registration and send an OTP.
router.post("/register", async (req, res) => {
  try {
    if (!process.env.OTP_SECRET) {
      return res.status(503).json({
        message: "Email verification is not configured yet.",
      });
    }

    const validation = validateRegistration(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { firstName, surname, email, password } = validation.value;

    if (await User.exists({ email })) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const existingPending = await PendingRegistration.findOne({ email });

    if (existingPending && existingPending.expiresAt.getTime() > Date.now()) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil(
          (existingPending.resendAvailableAt.getTime() - Date.now()) / 1000
        )
      );

      return res.status(429).json({
        message: "A verification code was already sent. Please verify it or wait before requesting another.",
        retryAfterSeconds,
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const now = Date.now();

    // Save the pending registration before sending the email.
    // This allows a resend request if the email provider temporarily fails.
    await PendingRegistration.findOneAndUpdate(
      { email },
      {
        $set: {
          firstName,
          surname,
          email,
          passwordHash,
          otpHash: hashOtp(email, otp),
          expiresAt: new Date(now + OTP_EXPIRY_MS),
          resendAvailableAt: new Date(now + RESEND_COOLDOWN_MS),
          attempts: 0,
          resendCount: 0,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      // Remove only the pending record created with this OTP so retries work.
      await PendingRegistration.deleteOne({
        email,
        otpHash: hashOtp(email, otp),
      });
      throw emailError;
    }

    return res.status(200).json({
      message: "Verification code sent. Please check your email.",
      email,
      expiresInSeconds: OTP_EXPIRY_MS / 1000,
      resendAfterSeconds: RESEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account or registration already exists for this email.",
      });
    }

    console.error("Registration start failed:", error.message);

    return res.status(503).json({
      message: "Unable to start registration or send the verification email. Please try again later.",
    });
  }
});

// Step 2: Verify OTP and create the account.
router.post("/verify-otp", async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const otp =
      typeof req.body?.otp === "string"
        ? req.body.otp.trim()
        : "";

    if (!isValidEmail(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Enter a valid email and 6-digit verification code.",
      });
    }

    const pending = await PendingRegistration.findOne({ email }).select(
      "+otpHash +passwordHash"
    );

    if (!pending) {
      return res.status(400).json({
        message: "Registration not found or the code has expired. Please register again.",
      });
    }

    if (pending.expiresAt.getTime() <= Date.now()) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(400).json({
        message: "Verification code expired. Please register again.",
      });
    }

    if (pending.attempts >= MAX_ATTEMPTS) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(429).json({
        message: "Too many incorrect attempts. Please register again.",
      });
    }

    const candidateHash = hashOtp(email, otp);

    if (!safeCompareHex(pending.otpHash, candidateHash)) {
      pending.attempts += 1;

      if (pending.attempts >= MAX_ATTEMPTS) {
        await PendingRegistration.deleteOne({ _id: pending._id });

        return res.status(429).json({
          message: "Too many incorrect attempts. Please register again.",
        });
      }

      await pending.save();

      return res.status(400).json({
        message: "Incorrect verification code.",
        attemptsRemaining: MAX_ATTEMPTS - pending.attempts,
      });
    }

    if (await User.exists({ email })) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      firstName: pending.firstName,
      surname: pending.surname,
      email: pending.email,
      passwordHash: pending.passwordHash,
      isEmailVerified: true,
    });

    await PendingRegistration.deleteOne({ _id: pending._id });

    return res.status(201).json({
      message: "Email verified and account created successfully.",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("OTP verification failed:", error.message);

    return res.status(500).json({
      message: "Unable to verify the code right now. Please try again.",
    });
  }
});

// Step 3: Resend OTP with cooldown and resend limits.
router.post("/resend-otp", async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const pending = await PendingRegistration.findOne({ email }).select(
      "+otpHash +passwordHash"
    );

    if (!pending) {
      return res.status(404).json({
        message: "Pending registration not found. Please register again.",
      });
    }

    if (pending.expiresAt.getTime() <= Date.now()) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(400).json({
        message: "Verification code expired. Please register again.",
      });
    }

    const waitMs = pending.resendAvailableAt.getTime() - Date.now();

    if (waitMs > 0) {
      return res.status(429).json({
        message: "Please wait before requesting another code.",
        retryAfterSeconds: Math.ceil(waitMs / 1000),
      });
    }

    if (pending.resendCount >= MAX_RESENDS) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(429).json({
        message: "Resend limit reached. Please register again.",
      });
    }

    const otp = generateOtp();
    const now = Date.now();

    // Send first. Keep the existing code valid if sending fails.
    await sendOtpEmail(email, otp);

    pending.otpHash = hashOtp(email, otp);
    pending.expiresAt = new Date(now + OTP_EXPIRY_MS);
    pending.resendAvailableAt = new Date(now + RESEND_COOLDOWN_MS);
    pending.attempts = 0;
    pending.resendCount += 1;

    await pending.save();

    return res.json({
      message: "A new verification code has been sent.",
      expiresInSeconds: OTP_EXPIRY_MS / 1000,
      resendAfterSeconds: RESEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    console.error("OTP resend failed:", error.message);

    return res.status(503).json({
      message: "Unable to resend the code right now. Please try again later.",
    });
  }
});

// Step 4: Login only after email verification.
router.post("/login", async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const { password } = req.body || {};

    if (!email || !isValidEmail(email) || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "A valid email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Legacy accounts without this field must verify too.
    if (user.isEmailVerified !== true) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    return res.json({
      message: "Login successful.",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      message: "Unable to log in right now. Please try again.",
    });
  }
});

module.exports = router;
