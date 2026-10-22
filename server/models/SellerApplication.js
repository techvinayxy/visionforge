const mongoose = require("mongoose");

const sellerApplicationSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true, maxlength: 100 },
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    businessType: {
      type: String,
      required: true,
      enum: ["Retailer", "Manufacturer / Brand", "Distributor / Wholesaler", "Individual seller", "Other"],
    },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    website: { type: String, trim: true, maxlength: 300, default: "" },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

sellerApplicationSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("SellerApplication", sellerApplicationSchema);
