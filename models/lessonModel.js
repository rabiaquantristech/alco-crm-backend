const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
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
    content_type: {
      type: String,
      enum: ["video", "audio", "document", "text", "quiz", "live_session"],
      default: "video",
    },
    content_url: String,   // S3 URL ya Zoom link
    duration_minutes: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    is_free_preview: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },
    resources: [
      {
        title: String,
        file_url: String,
        file_type: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);