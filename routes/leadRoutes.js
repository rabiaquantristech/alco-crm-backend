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
} = require("../controllers/leadController.js");

const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");

// Public (lead capture)
router.post("/", createLead);

// Admin / CRM
router.get("/", protect, getLeads);
router.get("/:id", protect, getLeadById);

router.put("/:id", protect, updateLead);
router.delete("/:id", protect, authorize("admin"), deleteLead);

router.post("/:id/assign", protect, assignLead);
router.post("/:id/convert", protect, convertLead);
router.post("/:id/mark-lost", protect, setLeadToLost);

module.exports = router;