// controllers/lmsAdminController.js
// Admin/Super_admin — LMS content manage karo
const Assignment  = require("../models/assignmentModel");
const Submission  = require("../models/submissionModel");
const LiveSession = require("../models/liveSessionModel");
const Resource    = require("../models/resourceModel");

// ─── ASSIGNMENTS ──────────────────────────────────────────────

exports.adminGetAssignments = async (req, res) => {
  try {
    const { program_id, course_id, status } = req.query;
    const filter = {};
    if (program_id) filter.program_id = program_id;
    if (course_id)  filter.course_id  = course_id;
    if (status)     filter.status     = status;

    const assignments = await Assignment.find(filter)
      .populate("program_id", "name")
      .populate("course_id", "title")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminCreateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminUpdateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminDeleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LIVE SESSIONS ────────────────────────────────────────────

exports.adminGetLiveSessions = async (req, res) => {
  try {
    const { program_id, status } = req.query;
    const filter = {};
    if (program_id) filter.program_id = program_id;
    if (status)     filter.status     = status;

    const sessions = await LiveSession.find(filter)
      .populate("program_id", "name")
      .populate("instructor_id", "name email")
      .sort({ scheduled_at: -1 });

    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminCreateLiveSession = async (req, res) => {
  try {
    const session = await LiveSession.create(req.body);
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminUpdateLiveSession = async (req, res) => {
  try {
    const session = await LiveSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminDeleteLiveSession = async (req, res) => {
  try {
    await LiveSession.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── RESOURCES ────────────────────────────────────────────────

exports.adminGetResources = async (req, res) => {
  try {
    const { program_id, course_id } = req.query;
    const filter = {};
    if (program_id) filter.program_id = program_id;
    if (course_id)  filter.course_id  = course_id;

    const resources = await Resource.find(filter)
      .populate("program_id", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminCreateResource = async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, uploaded_by: req.user.id });
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminUpdateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminDeleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};