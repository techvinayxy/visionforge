const mongoose = require("mongoose");

const stockInventorySchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, min: 1, unique: true },
    productName: { type: String, required: true, trim: true, maxlength: 160 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockInventory", stockInventorySchema);
