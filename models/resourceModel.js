// models/resourceModel.js
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    program_id: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    course_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Course"  },
    lesson_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Lesson"  },

    title:     { type: String, required: true },
    file_url:  { type: String, required: true },
    file_type: {
      type: String,
      enum: ["pdf", "doc", "video", "audio", "image", "zip", "other"],
      default: "pdf",
    },
    file_size_mb: { type: Number },

    is_downloadable: { type: Boolean, default: true },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);