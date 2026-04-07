const Lead = require("../models/leadModel.js");

// CREATE LEAD (public or admin)
exports.createLead = async (req, res) => {
    try {
        // ✅ Duplicate email check
        const existing = await Lead.findOne({ email: req.body.email });
        if (existing) {
            return res.status(400).json({ message: "Lead with this email already exists" });
        }

        const lead = await Lead.create({
            ...req.body,
            created_by: req.user?.id || null,
        });

        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET LEADS 
exports.getLeads = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            source,
            search,
            assigned_to,
            quality,        
        } = req.query;

        const query = {};

        if (status) query.status = status;
        if (source) query.source = source;
        if (assigned_to) query.assigned_to = assigned_to;
        if (quality) query.quality = quality;  

        if (search) {
            query.$or = [
                { first_name: { $regex: search, $options: "i" } },
                { last_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const leads = await Lead.find(query)
            .populate("assigned_to", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Lead.countDocuments(query);

        res.status(200).json({
            success: true,
            data: leads,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE LEAD
exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate(
            "assigned_to",
            "name email"
        );

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE LEAD
exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE LEAD
exports.deleteLead = async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Lead deleted",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ASSIGN LEAD TO 
exports.assignLead = async (req, res) => {
    try {
        const { assigned_to } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { assigned_to },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONVERT LEAD STATUS
exports.convertLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status: "converted" },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOST LEAD STATUS
exports.setLeadToLost = async (req, res) => {
  try {
    const { lost_reason, lost_notes } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { 
        status: "lost",
        lost_reason,    // ✅ save karo
        lost_notes,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ACTIVITIES
exports.getActivities = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .select("activities")
            .populate("activities.created_by", "name email");

        if (!lead) return res.status(404).json({ message: "Lead not found" });

        res.status(200).json({ success: true, data: lead.activities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD ACTIVITY
exports.addActivity = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        lead.activities.push({
            ...req.body,
            created_by: req.user.id,
        });

        await lead.save();

        res.status(201).json({ success: true, data: lead.activities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET LEADS STATS
exports.getLeadsStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ["$status", "qualified"] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ["$status", "lost"] }, 1, 0] } },
          hot: { $sum: { $cond: [{ $eq: ["$quality", "hot"] }, 1, 0] } },
          warm: { $sum: { $cond: [{ $eq: ["$quality", "warm"] }, 1, 0] } },
          cold: { $sum: { $cond: [{ $eq: ["$quality", "cold"] }, 1, 0] } },
          assigned: { $sum: { $cond: [{ $ne: ["$assigned_to", null] }, 1, 0] } },
        }
      }
    ]);

    const data = stats[0] || {
      total: 0, new: 0, contacted: 0, qualified: 0,
      converted: 0, lost: 0, hot: 0, warm: 0, cold: 0, assigned: 0
    };

    const conversionRate = data.total > 0
      ? ((data.converted / data.total) * 100).toFixed(1)
      : "0";

    res.status(200).json({
      success: true,
      data: { ...data, conversionRate }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
