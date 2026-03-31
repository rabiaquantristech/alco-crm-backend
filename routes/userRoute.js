const express = require("express");


const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");
const { getProfile, updateProfile, changePassword, deleteMyAccount } = require("../controllers/userController.js");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteMyAccount);

module.exports = router;