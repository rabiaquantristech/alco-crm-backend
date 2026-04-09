const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    order: {
      type: Number,
      default: 0,
    },
    total_lessons: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);