const mongoose = require("mongoose");

const stockNotificationSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, min: 1 },
    productName: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  },
  { timestamps: true }
);

stockNotificationSchema.index({ productId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("StockNotification", stockNotificationSchema);
