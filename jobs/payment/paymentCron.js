// const cron = require("node-cron");
// const { runPaymentCheck } = require("./paymentJob.js");

// // ⏰ Every day at 12:00 AM
// cron.schedule("0 0 * * *", async () => {
//   try {
//     console.log("🔄 Running Payment Cron Job...");

//     await runPaymentCheck();

//     console.log("✅ Payment Cron Completed");
//   } catch (error) {
//     console.error("❌ Payment Cron Error:", error.message);
//   }
// });

// jobs/payment/paymentCron.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const Enrollment = require("../../models/enrollmentModel.js");
const Invoice = require("../../models/invoiceModel.js");
const User = require("../../models/userModel.js");
const AuditLog = require("../../models/auditLogModel.js");

// ─── Helper: Audit log (no req object needed) ─────────────────
async function logCronAudit({ action, module, targetId, before, after }) {
  try {
    await AuditLog.create({
      user: null, // cron — koi user nahi
      action,
      module,
      targetId: targetId?.toString(),
      before,
      after,
      ip: "cron",
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Cron audit log failed:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN CRON FUNCTION
// Har raat 12:00 AM chalega
// ─────────────────────────────────────────────────────────────
async function runPaymentCron() {
  console.log(`\n🕐 Payment Cron Started: ${new Date().toLocaleString()}`);

  const now = new Date();
  let stats = {
    restricted: 0,
    extended: 0,
    reactivated: 0,
    overdueInvoices: 0,
    errors: 0,
  };

  try {
    // ── Step 1: Invoices jo overdue hain mark karo ─────────────
    const overdueInvoices = await Invoice.find({
      status: { $in: ["PENDING", "PARTIAL"] },
      dueDate: { $lt: now },
    });

    for (const invoice of overdueInvoices) {
      try {
        await Invoice.findByIdAndUpdate(invoice._id, { status: "OVERDUE" });
        stats.overdueInvoices++;
        console.log(`📋 Invoice OVERDUE: ${invoice._id}`);
      } catch (err) {
        console.error(`❌ Invoice overdue update failed: ${invoice._id}`, err.message);
        stats.errors++;
      }
    }

    // ── Step 2: Active enrollments check karo ─────────────────
    const enrollments = await Enrollment.find({
      status: "active",
    }).populate("user", "name email");

    for (const enrollment of enrollments) {
      try {
        const before = enrollment.toObject();

        // ── Priority 1: Admin override active hai? ─────────────
        if (enrollment.accessOverride?.endDate) {
          const overrideActive = new Date(enrollment.accessOverride.endDate) > now;

          if (overrideActive) {
            // Admin ne grant kiya hua hai — ACTIVE rakho
            if (enrollment.accessStatus !== "ACTIVE") {
              await Enrollment.findByIdAndUpdate(enrollment._id, {
                accessStatus: "ACTIVE",
              });
              stats.reactivated++;
              console.log(`✅ Override active — ACTIVE rakha: ${enrollment.user?.name}`);

              await logCronAudit({
                action: "ACCESS_REACTIVATED_BY_OVERRIDE",
                module: "enrollment",
                targetId: enrollment._id,
                before,
                after: { accessStatus: "ACTIVE" },
              });
            }
            continue; // agla enrollment pe jao
          }
        }

        // ── Priority 2: Finance extension active hai? ──────────
        if (enrollment.financeExtension?.newDueDate) {
          const extensionActive = new Date(enrollment.financeExtension.newDueDate) > now;

          if (extensionActive) {
            // Finance extension chal rahi hai — EXTENDED rakho
            if (enrollment.accessStatus !== "EXTENDED") {
              await Enrollment.findByIdAndUpdate(enrollment._id, {
                accessStatus: "EXTENDED",
              });
              stats.extended++;
              console.log(`⏳ Finance extension active — EXTENDED: ${enrollment.user?.name}`);

              await logCronAudit({
                action: "ACCESS_EXTENDED_BY_FINANCE",
                module: "enrollment",
                targetId: enrollment._id,
                before,
                after: { accessStatus: "EXTENDED" },
              });
            }
            continue;
          }
        }

        // ── Priority 3: Invoice check karo ────────────────────
        // Us enrollment ki invoice dhundho
        const invoice = await Invoice.findOne({
          enrollment: enrollment._id,
          status: { $in: ["OVERDUE", "PENDING", "PARTIAL"] },
        });

        if (invoice) {
          // Invoice overdue ya pending hai
          const dueDate = new Date(invoice.dueDate);
          const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));

          // 7 din grace period dete hain
          if (daysOverdue > 7) {
            if (enrollment.accessStatus !== "RESTRICTED") {
              await Enrollment.findByIdAndUpdate(enrollment._id, {
                accessStatus: "RESTRICTED",
              });
              stats.restricted++;
              console.log(`🔒 RESTRICTED (${daysOverdue} days overdue): ${enrollment.user?.name}`);

              await logCronAudit({
                action: "ACCESS_RESTRICTED_OVERDUE",
                module: "enrollment",
                targetId: enrollment._id,
                before,
                after: { accessStatus: "RESTRICTED", daysOverdue },
              });
            }
          } else if (daysOverdue > 0) {
            // Grace period mein — GRACE status
            if (enrollment.accessStatus !== "GRACE") {
              await Enrollment.findByIdAndUpdate(enrollment._id, {
                accessStatus: "GRACE",
              });
              console.log(`⚠️  GRACE period (${daysOverdue} days): ${enrollment.user?.name}`);

              await logCronAudit({
                action: "ACCESS_IN_GRACE_PERIOD",
                module: "enrollment",
                targetId: enrollment._id,
                before,
                after: { accessStatus: "GRACE", daysOverdue },
              });
            }
          }
        } else {
          // Koi pending/overdue invoice nahi — ACTIVE rakho
          const paidInvoice = await Invoice.findOne({
            enrollment: enrollment._id,
            status: "PAID",
          });

          if (paidInvoice && enrollment.accessStatus !== "ACTIVE") {
            await Enrollment.findByIdAndUpdate(enrollment._id, {
              accessStatus: "ACTIVE",
            });
            stats.reactivated++;
            console.log(`✅ Invoice PAID — ACTIVE: ${enrollment.user?.name}`);

            await logCronAudit({
              action: "ACCESS_REACTIVATED_PAID",
              module: "enrollment",
              targetId: enrollment._id,
              before,
              after: { accessStatus: "ACTIVE" },
            });
          }
        }
      } catch (err) {
        console.error(`❌ Enrollment cron error: ${enrollment._id}`, err.message);
        stats.errors++;
      }
    }

    // ── Step 3: Report ────────────────────────────────────────
    console.log("\n─────────────────────────────────");
    console.log(`✅ Cron Complete: ${new Date().toLocaleString()}`);
    console.log(`📋 Invoices marked OVERDUE : ${stats.overdueInvoices}`);
    console.log(`🔒 Access RESTRICTED       : ${stats.restricted}`);
    console.log(`⏳ Access EXTENDED         : ${stats.extended}`);
    console.log(`✅ Access REACTIVATED      : ${stats.reactivated}`);
    console.log(`❌ Errors                  : ${stats.errors}`);
    console.log("─────────────────────────────────\n");

  } catch (err) {
    console.error("🔥 Cron Fatal Error:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// SCHEDULE
// Har raat 12:00 AM — "0 0 * * *"
// Test ke liye har minute — "* * * * *"
// ─────────────────────────────────────────────────────────────
cron.schedule("0 0 * * *", async () => {
  await runPaymentCron();
}, {
  timezone: "Asia/Karachi",
});

console.log("✅ Payment Cron Scheduled — Runs daily at 12:00 AM (PKT)");

// ── Manual trigger (testing ke liye) ─────────────────────────
// Agar manually run karna ho:
// node -e "require('./jobs/payment/paymentCron.js')"
module.exports = { runPaymentCron };