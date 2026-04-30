// routes/auditRoute.js
 
const express = require("express");
const router = express.Router();
 
const { getAllAuditLogs, getAuditLogById } = require("../controllers/auditController");

const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");
 
// Admin & Super Admin only
router.get("/", protect, authorize( "admin", "super_admin", "sales_manager", "finance_manager"), getAllAuditLogs);
router.get("/:id", protect, authorize( "admin", "super_admin", "sales_manager", "finance_manager"), getAuditLogById);
 
module.exports = router;