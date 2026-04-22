// models/assignmentModel.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    program_id: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    course_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Course"  },
    lesson_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Lesson"  },

    title:        { type: String, required: true },
    description:  { type: String },
    instructions: { type: String },

    submission_type: {
      type: String,
      enum: ["file", "text", "url", "any"],
      default: "any",
    },

    due_date:    { type: Date },
    max_points:  { type: Number, default: 100 },

    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);