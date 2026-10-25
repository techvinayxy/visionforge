const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SellerApplication = require("../models/SellerApplication");

const router = express.Router();

function validEmail(value) {
  return typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requireSellerReviewer(req, res, next) {
  const configuredSecret = process.env.SELLER_REVIEW_SECRET;

  // Fail closed until the reviewer secret has been configured in the deployment.
  if (!configuredSecret || configuredSecret.length < 32) {
    return res.status(503).json({
      message: "Seller review is not configured. Please contact the site operator.",
    });
  }

  const match = (req.headers.authorization || "").match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ message: "Reviewer authorization is required." });
  }

  const supplied = Buffer.from(match[1], "utf8");
  const expected = Buffer.from(configuredSecret, "utf8");
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return res.status(403).json({ message: "Reviewer authorization failed." });
  }

  return next();
}

function createSellerToken(seller) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign(
    { sub: seller._id.toString(), role: "seller" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

router.post("/apply", async (req, res) => {
  try {
    const body = req.body || {};
    const ownerName = typeof body.ownerName === "string" ? body.ownerName.trim() : "";
    const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const businessType = typeof body.businessType === "string" ? body.businessType : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const allowedTypes = ["Retailer", "Manufacturer / Brand", "Distributor / Wholesaler", "Individual seller", "Other"];

    if (
      !ownerName || ownerName.length > 100 ||
      !businessName || businessName.length > 120 ||
      !validEmail(email) ||
      password.length < 8 || password.length > 128 ||
      !phone || phone.length < 7 || phone.length > 20 ||
      !allowedTypes.includes(businessType) ||
      !address || address.length > 500 ||
      website.length > 300 || description.length > 1000
    ) {
      return res.status(400).json({ message: "Please provide valid details. Password must be at least 8 characters." });
    }

    if (website) {
      try {
        const parsedWebsite = new URL(website);
        if (!["http:", "https:"].includes(parsedWebsite.protocol)) throw new Error("Invalid protocol");
      } catch {
        return res.status(400).json({ message: "Please enter a valid website URL beginning with https:// or http://." });
      }
    }

    const existing = await SellerApplication.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "A seller application already exists for this email. Please contact support if you need help." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await SellerApplication.create({
      ownerName, businessName, email, passwordHash, phone, businessType, address, website, description,
    });

    return res.status(201).json({
      message: "Seller application submitted successfully. You can log in after your application is approved.",
      status: "pending",
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "A seller application already exists for this email." });
    console.error("Seller application submission failed:", error.message);
    return res.status(500).json({ message: "Unable to submit your application right now. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!validEmail(email) || !password || password.length > 128) {
      return res.status(400).json({ message: "Enter a valid business email and password." });
    }

    const seller = await SellerApplication.findOne({ email }).select("+passwordHash");
    if (!seller || !seller.passwordHash || !(await bcrypt.compare(password, seller.passwordHash))) {
      return res.status(401).json({ message: "Invalid business email or password." });
    }
    if (seller.status === "pending") {
      return res.status(403).json({ message: "Your seller application is still under review. You can log in after approval." });
    }
    if (seller.status !== "approved") {
      return res.status(403).json({ message: "This seller application has not been approved. Please contact support." });
    }

    const token = createSellerToken(seller);
    return res.json({
      token,
      seller: {
        id: seller._id.toString(),
        ownerName: seller.ownerName,
        businessName: seller.businessName,
        email: seller.email,
        status: seller.status,
        role: "seller",
      },
    });
  } catch (error) {
    console.error("Seller login failed:", error.message);
    return res.status(500).json({ message: "Unable to sign in right now. Please try again later." });
  }
});


router.get("/me", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ message: "Please sign in as a seller." });
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");

    let payload;
    try {
      payload = jwt.verify(match[1], process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Your seller session has expired. Please sign in again." });
    }
    if (payload.role !== "seller" || !payload.sub) {
      return res.status(403).json({ message: "Seller access is required." });
    }

    const seller = await SellerApplication.findById(payload.sub);
    if (!seller || seller.status !== "approved") {
      return res.status(403).json({ message: "This seller account is not approved for access." });
    }

    return res.json({
      seller: {
        id: seller._id.toString(),
        ownerName: seller.ownerName,
        businessName: seller.businessName,
        email: seller.email,
        status: seller.status,
        role: "seller",
      },
    });
  } catch (error) {
    console.error("Seller session verification failed:", error.message);
    return res.status(500).json({ message: "Unable to verify your seller session right now." });
  }
});


/**
 * Private seller-review operations. These routes are intended for a trusted
 * operator's server-side/API client, not for calls from the public frontend.
 * Protect them with a long random SELLER_REVIEW_SECRET stored as a deployment
 * environment variable. No admin panel is exposed by these endpoints.
 */
router.get("/review/pending", requireSellerReviewer, async (_req, res) => {
  try {
    const applications = await SellerApplication.find({ status: "pending" })
      .select("ownerName businessName email phone businessType address website description status createdAt")
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ applications, total: applications.length });
  } catch (error) {
    console.error("Listing pending seller applications failed:", error.message);
    return res.status(500).json({ message: "Unable to load seller applications right now." });
  }
});

router.patch("/review/:id", requireSellerReviewer, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ message: "A valid seller application ID is required." });
    }
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be either approved or rejected." });
    }

    // Only pending applications can be reviewed. This prevents a later request
    // from silently reversing a decision already recorded for the application.
    const application = await SellerApplication.findOneAndUpdate(
      { _id: id, status: "pending" },
      { $set: { status, reviewedAt: new Date() } },
      { new: true, runValidators: true }
    )
      .select("ownerName businessName email phone businessType address website description status createdAt reviewedAt")
      .lean();

    if (!application) {
      const existing = await SellerApplication.findById(id).select("status").lean();
      if (!existing) {
        return res.status(404).json({ message: "Seller application not found." });
      }
      return res.status(409).json({
        message: "This application has already been reviewed and cannot be changed by this endpoint.",
        status: existing.status,
      });
    }

    return res.json({
      message: status === "approved"
        ? "Seller application approved. The seller can now sign in."
        : "Seller application rejected.",
      application,
    });
  } catch (error) {
    console.error("Reviewing seller application failed:", error.message);
    return res.status(500).json({ message: "Unable to review this seller application right now." });
  }
});

module.exports = router;
