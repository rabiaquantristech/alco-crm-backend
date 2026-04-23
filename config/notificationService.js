const Notification = require("../models/notificationModel.js");
const { sendNotificationToUser } = require("../socket/socket");

// ── Notification create karo + socket emit karo ──────────────
exports.createNotification = async (params) => {
  const notification = await Notification.create(params);

  // Populate triggered_by for frontend display
  const populated = await notification.populate("triggered_by", "name role");

  // Real-time socket emit
  sendNotificationToUser(params.user_id, {
    _id: populated._id,
    type: populated.type,
    title: populated.title,
    message: populated.message,
    lead_id: populated.lead_id,
    activity_id: populated.activity_id,
    triggered_by: populated.triggered_by,
    is_read: false,
    createdAt: populated.createdAt,
  });

  return populated;
};

// ── Lead assign hone pe ──────────────────────────────────────
exports.notifyLeadAssigned = async ({
  userId,
  leadName,
  leadId,
  assignedBy,
}) => {
  return createNotification({
    user_id: userId,
    type: "lead_assigned",
    title: "Lead Assigned to You",
    message: `Lead "${leadName}" has been assigned to you.`,
    lead_id: leadId,
    triggered_by: assignedBy,
  });
};

// ── Activity add hone pe ─────────────────────────────────────
exports.notifyActivityAdded = async ({
  userId,
  leadName,
  leadId,
  activityId,
  activityType,
  addedBy,
}) => {
  return createNotification({
    user_id: userId,
    type: "activity_added",
    title: "New Activity on Your Lead",
    message: `A ${activityType} has been logged for lead "${leadName}".`,
    lead_id: leadId,
    activity_id: activityId,
    triggered_by: addedBy,
  });
};

// ── Status change hone pe ────────────────────────────────────
exports.notifyStatusChanged = async ({
  userId,
  leadName,
  leadId,
  newStatus,
  changedBy,
}) => {
  return createNotification({
    user_id: userId,
    type: "status_changed",
    title: "Lead Status Updated",
    message: `Your lead "${leadName}" status changed to "${newStatus}".`,
    lead_id: leadId,
    triggered_by: changedBy,
  });
};