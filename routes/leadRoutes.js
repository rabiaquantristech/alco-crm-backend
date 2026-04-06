const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  assignLead,
  convertLead,
  setLeadToLost,
  getActivities,
  addActivity,
} = require("../controllers/leadController.js");

const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");

// Public (lead capture)
router.post("/", createLead);

// Admin / CRM
router.get("/", protect, authorize("admin", "super_admin", "sales_manager"), getLeads);
router.get("/:id", protect, authorize("admin", "super_admin", "sales_manager"), getLeadById);

router.put("/:id", protect, updateLead);
router.delete("/:id", protect, authorize("admin", "super_admin"), deleteLead);

router.post("/:id/assign", protect, authorize("admin", "super_admin", "sales_manager"), assignLead);
router.post("/:id/convert", protect, convertLead);
router.post("/:id/mark-lost", protect, setLeadToLost);
router.get("/:id/activities", protect, getActivities);
router.post("/:id/activities", protect, addActivity);

module.exports = router;