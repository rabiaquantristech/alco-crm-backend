const mongoose = require("mongoose");

const lessonCommentSchema = new mongoose.Schema(
  {
    lesson_id:     { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    enrollment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    user_id:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment:       { type: String, required: true },
    timestamp_seconds: { type: Number, default: 0 }, // audio mein kis waqt comment kiya
  },
  { timestamps: true }
);

module.exports = mongoose.model("LessonComment", lessonCommentSchema);