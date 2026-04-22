// models/lessonProgressModel.js
const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema(
  {
    enrollment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    user_id:       { type: mongoose.Schema.Types.ObjectId, ref: "User",       required: true },
    lesson_id:     { type: mongoose.Schema.Types.ObjectId, ref: "Lesson",     required: true },
    course_id:     { type: mongoose.Schema.Types.ObjectId, ref: "Course",     required: true },
    program_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Program",    required: true },

    progress_percentage:   { type: Number, default: 0, min: 0, max: 100 },
    last_position_seconds: { type: Number, default: 0 },
    is_completed:          { type: Boolean, default: false },
    completed_at:          { type: Date, default: null },

    watch_time_seconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ek user ek lesson ek enrollment ke liye ek hi progress record
lessonProgressSchema.index({ enrollment_id: 1, lesson_id: 1 }, { unique: true });

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);