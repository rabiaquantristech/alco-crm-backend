const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["lead_assigned", "activity_added", "status_changed", "general"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    lead_id: { type: Schema.Types.ObjectId, ref: "Lead" },
    activity_id: { type: Schema.Types.ObjectId, ref: "Activity" },
    triggered_by: { type: Schema.Types.ObjectId, ref: "User" },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ user_id: 1, is_read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);