const express = require("express");


const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUserById, deleteAllUsers } = require("../controllers/adminController");

const router = express.Router();


// 🔒 Only Admin Can Access All Routes

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/users/:id", protect, authorize("admin"), getUserById);
router.patch("/users/:id", protect, authorize("admin"), updateUser);
router.delete("/users/:id", protect, authorize("admin"), deleteUserById);
router.delete("/users", protect, authorize("admin"), deleteAllUsers);

module.exports = router;