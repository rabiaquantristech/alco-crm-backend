// models/submissionModel.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    enrollment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    user_id:       { type: mongoose.Schema.Types.ObjectId, ref: "User",       required: true },
    program_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Program",    required: true },

    submission_type: {
      type: String,
      enum: ["file", "text", "url"],
      required: true,
    },

    file_url:     { type: String },
    text_content: { type: String },
    url_content:  { type: String },

    status: {
      type: String,
      enum: ["submitted", "graded", "resubmit_requested"],
      default: "submitted",
    },

    // Grading
    points_earned: { type: Number, default: null },
    feedback:      { type: String },
    graded_by:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    graded_at:     { type: Date },

    submitted_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);