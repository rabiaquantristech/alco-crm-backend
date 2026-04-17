const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  targetId: String,
  module: String,
  before: Object,
  after: Object,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", auditSchema);