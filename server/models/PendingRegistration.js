const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    surname: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    otpHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
    resendAvailableAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    resendCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// One pending registration per email.
pendingRegistrationSchema.index(
  { email: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);