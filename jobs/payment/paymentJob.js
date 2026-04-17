// jobs/paymentJob.js
const Invoice = require("../../models/invoiceModel.js");
const Enrollment = require("../../models/enrollmentModel.js");

exports.runPaymentCheck = async () => {
  const now = new Date();

  const invoices = await Invoice.find();

  for (let inv of invoices) {
    const enrollment = await Enrollment.findById(inv.enrollment);

    if (!enrollment) continue;

    // OVERDUE
    if (inv.dueDate < now && inv.status !== "PAID") {
      inv.status = "OVERDUE";
      await inv.save();

      // 30+ days warning
      const daysLate =
        (now - inv.dueDate) / (1000 * 60 * 60 * 24);

      if (daysLate > 30) {
        inv.status = "WARNING";
      }

      // 60+ days block
      if (daysLate > 60 && !enrollment.accessOverride) {
        inv.status = "BLOCKED";
        enrollment.isBlocked = true;
        enrollment.accessStatus = "BLOCKED";

        await enrollment.save();
      }

      await inv.save();
    }
  }

  console.log("Payment check completed");
};