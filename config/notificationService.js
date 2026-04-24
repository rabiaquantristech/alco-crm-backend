const Notification = require("../models/notificationModel.js");
const { sendNotificationToUser } = require("./socket");


// ── Core: notification create karo + socket emit karo ────────
const createNotification = async ({
  user_id,
  type,
  title,
  message,
  lead_id,
  activity_id,
  triggered_by,
}) => {
  const notification = await Notification.create({
    user_id,
    type,
    title,
    message,
    lead_id,
    activity_id,
    triggered_by,
  });

  const populated = await notification.populate("triggered_by", "name role");

  // Real-time socket emit
  sendNotificationToUser(user_id.toString(), {
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
const notifyLeadAssigned = ({ userId, leadName, leadId, assignedBy }) => {
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
const notifyActivityAdded = ({ userId, leadName, leadId, activityId, activityType, addedBy }) => {
  return createNotification({
    user_id: userId,
    type: "activity_added",
    title: "New Activity on Your Request",
    message: `A ${activityType} was logged for your request "${leadName}".`,
    lead_id: leadId,
    activity_id: activityId,
    triggered_by: addedBy,
  });
};

// ── Status change hone pe ────────────────────────────────────
const notifyStatusChanged = ({ userId, leadName, leadId, newStatus, changedBy }) => {
  return createNotification({
    user_id: userId,
    type: "status_changed",
    title: "Request Status Updated",
    message: `Your request "${leadName}" status changed to "${newStatus}".`,
    lead_id: leadId,
    triggered_by: changedBy,
  });
};

module.exports = {
  createNotification,
  notifyLeadAssigned,
  notifyActivityAdded,
  notifyStatusChanged,
};