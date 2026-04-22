// models/liveSessionModel.js
const mongoose = require("mongoose");

const liveSessionSchema = new mongoose.Schema(
  {
    program_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    batch_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Batch"   },
    course_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Course"  },

    title:       { type: String, required: true },
    description: { type: String },

    scheduled_at:       { type: Date, required: true },
    duration_minutes:   { type: Number, default: 60 },

    meeting_url:  { type: String },   // Zoom / Google Meet link
    meeting_id:   { type: String },
    meeting_pass: { type: String },

    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },

    instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recording_url: { type: String },

    // Registered students
    registered: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    max_attendees: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveSession", liveSessionSchema);