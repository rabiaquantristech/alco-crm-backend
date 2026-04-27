// models/enrollmentModel.js
const mongoose = require("mongoose");

const accessOverrideSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["ADMIN_GRANT", "AUTO_GRANT", "MANUAL_OVERRIDE"], // Expanded for future types
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  grantedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });


const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },

    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "suspended",
        "cancelled",
        "blocked",
      ],
      default: "active",
    },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    // 🔐 ACCESS SYSTEM (NEW)
    accessStatus: {
      type: String,
      enum: ["ACTIVE", "GRACE", "EXTENDED", "RESTRICTED", "BLOCKED"],
      default: "ACTIVE",
    },

    // accessOverride: {
    //   type: {
    //     type: String, // ADMIN_GRANT
    //     startDate: Date,
    //     endDate: Date,
    //     grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //   },
    //   default: null,
    // },
    // accessOverride: {
    //   type: {
    //     type: String,
    //     enum: ["ADMIN_GRANT", "AUTO_GRANT", "MANUAL_OVERRIDE"],
    //   },
    //   startDate: Date,
    //   endDate: Date,
    //   grantedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    //   default: undefined,
    // },
    accessOverride: {
      type: accessOverrideSchema,
    },

    financeExtension: {
      durationDays: Number,
      reason: String,
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      newDueDate: Date,
    },

    progress: {
      type: Number,
      default: 0,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: Date,

    isGraduated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔥 prevent duplicate enrollment
enrollmentSchema.index({ user: 1, program: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);