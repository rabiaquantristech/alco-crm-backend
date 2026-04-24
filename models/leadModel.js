const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: String,

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    // phone: String,

    // phone: {
    //   type: String,
    //   unique: true,
    //   sparse: true,  
    //   default: null,
    // },

    phone: {
      type: String,
      default: null,
    },

    // ✅ NEW FIELDS
    nationality: {
      type: String,
    },

    profession: {
      type: String,
    },

    program_name: {
      type: String,
    },

    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      default: null,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    goals: [String],
    message: String,
    query: String,

    opportunity_value: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },

    quality: {
      type: String,
      enum: ["hot", "warm", "cold"],
      default: "cold",
    },

    source: {
      type: String,
      enum: ["utm", "referral", "social", "organic", "enroll", "contact", "other"],
      default: "enroll"
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    activities: [
      {
        activity_type: {
          type: String,
          enum: ["call", "email", "meeting", "note"],
        },
        title: String,
        description: String,
        call_duration_minutes: Number,
        call_outcome: String,
        created_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Sahi — activities array ke andar hona chahiye
    activities: [
      {
        activity_type: String,
        title: String,
        description: String,
        call_duration_minutes: Number,
        call_outcome: String,
        // ↓ Yeh naye fields yahan add karo
        email_subject: String,
        meeting_link: String,
        meeting_datetime: Date,
        meeting_location: String,
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    lost_reason: String,
    lost_notes: String,
    notes: String,

    // 🔥 Marketing tracking
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,

    lead_score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);