const Notification = require("../models/notificationModel.js");

// ── GET /api/v1/notifications ────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
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

    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

// ── PATCH /api/v1/notifications/:id/read ────────────────────
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// ── PATCH /api/v1/notifications/read-all ────────────────────
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, is_read: false },
      { is_read: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// ── DELETE /api/v1/notifications/:id ────────────────────────
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };