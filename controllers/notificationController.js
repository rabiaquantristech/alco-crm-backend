const Notification = require("../models/notificationModel.js");

// ── GET /api/notifications — user ki sari notifications ──────
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // auth middleware se
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ user_id: userId })
      .populate("triggered_by", "name role")
      .populate("lead_id", "first_name last_name")
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const unreadCount = await Notification.countDocuments({
      user_id: userId,
      is_read: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// ── PATCH /api/notifications/:id/read — single mark as read ──
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { is_read: true });
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// ── PATCH /api/notifications/read-all — sab mark as read ─────
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ user_id: userId, is_read: false }, { is_read: true });
    res.json({ success: true, message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// ── DELETE /api/notifications/:id — single delete ────────────
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};