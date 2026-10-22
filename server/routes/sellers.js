const express = require("express");
const SellerApplication = require("../models/SellerApplication");

const router = express.Router();

function validEmail(value) {
  return typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

router.post("/apply", async (req, res) => {
  try {
    const body = req.body || {};
    const ownerName = typeof body.ownerName === "string" ? body.ownerName.trim() : "";
    const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const businessType = typeof body.businessType === "string" ? body.businessType : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";

    const allowedTypes = [
      "Retailer",
      "Manufacturer / Brand",
      "Distributor / Wholesaler",
      "Individual seller",
      "Other",
    ];

    if (
      !ownerName || ownerName.length > 100 ||
      !businessName || businessName.length > 120 ||
      !validEmail(email) ||
      !phone || phone.length < 7 || phone.length > 20 ||
      !allowedTypes.includes(businessType) ||
      !address || address.length > 500 ||
      website.length > 300 ||
      description.length > 1000
    ) {
      return res.status(400).json({ message: "Please provide valid details for all required seller fields." });
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
      if (existing.status === "pending") {
        return res.status(409).json({ message: "A seller application with this email is already under review." });
      }
      return res.status(409).json({ message: "A seller application already exists for this email. Please contact support if you need help." });
    }

    await SellerApplication.create({
      ownerName,
      businessName,
      email,
      phone,
      businessType,
      address,
      website,
      description,
    });

    return res.status(201).json({
      message: "Seller application submitted successfully. Seller access will be available only after approval.",
      status: "pending",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A seller application already exists for this email." });
    }
    console.error("Seller application submission failed:", error.message);
    return res.status(500).json({ message: "Unable to submit your application right now. Please try again later." });
  }
});

module.exports = router;
