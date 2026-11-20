const express = require("express");
const crypto = require("crypto");
const StockInventory = require("../models/StockInventory");
const StockNotification = require("../models/StockNotification");
const stockNotificationRoutes = require("./stockNotifications");

const router = express.Router();

function safeEqual(leftValue, rightValue) {
  if (!leftValue || !rightValue) return false;
  const left = Buffer.from(String(leftValue));
  const right = Buffer.from(String(rightValue));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function requireInventorySecret(req, res, next) {
  const configuredSecret = process.env.STOCK_NOTIFICATION_SECRET;
  const suppliedSecret = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!configuredSecret || configuredSecret.length < 32 ||
      !safeEqual(suppliedSecret, configuredSecret)) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  return next();
}

// Public stock lookup. A missing record means inventory has not been configured.
router.get("/:productId/stock", async (req, res) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "A valid product ID is required." });
  }
  try {
    const inventory = await StockInventory.findOne({ productId }).lean();
    return res.json({
      productId,
      stock: inventory ? inventory.stock : null,
      productName: inventory ? inventory.productName : null,
    });
  } catch (error) {
    console.error("Stock lookup failed:", error.message);
    return res.status(500).json({ message: "Unable to load stock right now." });
  }
});

// Trusted inventory update. A 0 -> positive transition automatically sends
// back-in-stock emails; successful subscribers are removed, failures stay queued.
router.put("/:productId/stock", requireInventorySecret, async (req, res) => {
  const productId = Number(req.params.productId);
  const productName = typeof req.body?.productName === "string" ? req.body.productName.trim() : "";
  const stock = Number(req.body?.stock);

  if (!Number.isInteger(productId) || productId < 1 ||
      !productName || productName.length > 160 ||
      !Number.isSafeInteger(stock) || stock < 0) {
    return res.status(400).json({ message: "A valid product ID, name, and non-negative stock quantity are required." });
  }

  try {
    let inventory = await StockInventory.findOne({ productId });
    if (!inventory) {
      try {
        inventory = await StockInventory.create({ productId, productName, stock: 0 });
      } catch (error) {
        if (error.code !== 11000) throw error;
        inventory = await StockInventory.findOne({ productId });
      }
    }

    const previousStock = inventory.stock;
    inventory.productName = productName;
    inventory.stock = stock;
    await inventory.save();

    let notification = { subscribers: 0, sent: 0, failed: 0 };
    if (previousStock <= 0 && stock > 0) {
      const subscribers = await StockNotification.find({ productId }).lean();
      notification.subscribers = subscribers.length;

      for (const subscriber of subscribers) {
        try {
          await stockNotificationRoutes.sendBackInStockEmail(subscriber.email, productName);
          await StockNotification.deleteOne({ _id: subscriber._id });
          notification.sent += 1;
        } catch (error) {
          console.error("Back-in-stock email failed:", error.message);
          notification.failed += 1;
        }
      }
    }

    return res.json({
      message: previousStock <= 0 && stock > 0
        ? "Stock updated and back-in-stock notifications processed."
        : "Stock updated. No restock notification was required.",
      productId,
      previousStock,
      stock,
      notification,
    });
  } catch (error) {
    console.error("Inventory update failed:", error.message);
    return res.status(500).json({ message: "Unable to update inventory right now." });
  }
});

module.exports = router;
