const express = require("express");

const { protect } = require("../middlewares/authMiddleware.js");

const { getNotifications, 
    markAsRead,
    markAllAsRead,
    deleteNotification
 } = require("../controllers/notificationController.js");

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead);
router.patch("/read-all", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;