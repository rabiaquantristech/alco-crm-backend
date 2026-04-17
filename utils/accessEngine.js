// utils/accessEngine.js

const Enrollment = require("../models/enrollmentModel.js");
const Invoice = require("../models/invoiceModel.js");

exports.checkUserAccess = async (userId, enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  const invoice = await Invoice.findOne({ enrollment: enrollmentId });

  if (!enrollment) return { access: false, reason: "No enrollment" };

  // 1. Admin Override Check
  if (
    enrollment.accessOverride &&
    new Date() < enrollment.accessOverride.endDate
  ) {
    return { access: true, reason: "Admin Grant Active" };
  }

  // 2. Blocked Check
  if (enrollment.isBlocked) {
    return { access: false, reason: "Blocked by system" };
  }

  // 3. Finance Extension
  if (
    enrollment.financeExtension &&
    new Date() < enrollment.financeExtension.newDueDate
  ) {
    return { access: true, reason: "Finance Extension Active" };
  }

  // 4. Invoice Status
  if (invoice?.status === "PAID") {
    return { access: true, reason: "Fully Paid" };
  }

  if (invoice?.status === "BLOCKED") {
    return { access: false, reason: "Payment Blocked" };
  }

  return { access: true, reason: "Default Access (Grace)" };
};