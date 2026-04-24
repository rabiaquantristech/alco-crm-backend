const express = require("express");
const router = express.Router();
const { getNotifications, 
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../controllers/notificationController.js");
const { protect } = require("../middlewares/authMiddleware.js");


router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead);
router.patch("/read-all", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;