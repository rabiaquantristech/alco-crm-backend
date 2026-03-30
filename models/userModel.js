const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "relationship-manager", "sales", "support", "user"],
      default: "user",
    },
    permissions: {
      type: [String],
      default: []
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null
    },
    permissions: {
      type: [String],
      default: []
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordAttempts: { type: Number, default: 0 }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);