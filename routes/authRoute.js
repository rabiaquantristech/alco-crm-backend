const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify-email/:token", authController.verifyEmail);

router.post("/logout", protect, authController.logout);

router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get(
  "/manager-dashboard",
  protect,
  authorize("admin", "relationship-manager"),
  (req, res) => {
    res.json({ message: "Welcome Manager" });
  }
);

module.exports = router;