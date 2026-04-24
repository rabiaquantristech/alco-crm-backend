const mongoose = require("mongoose"); // ✅ ADD THIS
const Lead = require("../models/leadModel.js");
const bcrypt = require("bcryptjs");
const sendEmailDynamic = require("../utils/sendEmailDynamic.js");
// const emailTemplate = require("../template/send-user-credentials.js");
const User = require("../models/userModel.js");
const generateColor = require("../utils/generateColor.js");
const { notifyStatusChanged, createNotification, notifyLeadAssigned } = require("../config/notificationService.js");
// const sendEmail = require("../utils/sendEmail.js");

// CREATE LEAD (public or admin)
// exports.createLead = async (req, res) => {
//     try {
//         // ✅ Duplicate email check
//         const existing = await Lead.findOne({ email: req.body.email });
//         if (existing) {
//             return res.status(400).json({ message: "Lead with this email already exists" });
//         }

//         const lead = await Lead.create({
//             ...req.body,
//             created_by: req.user?.id || null,
//         });

//         res.status(201).json({ success: true, data: lead });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.createLead = async (req, res) => {
//     try {
//         const existing = await Lead.findOne({ email: req.body.email });
//         if (existing) {
//             return res.status(400).json({ message: "Lead with this email already exists" });
//         }

//         // 👉 generate password (simple example)
//         const password = Math.random().toString(36).slice(-8);

//         const lead = await Lead.create({
//             ...req.body,
//             password, // agar store karna ho (hash karna better hai)
//             created_by: req.user?.id || null,
//         });

//         await sendEmailDynamic({
//             to: lead.email,
//             subject: "Your Account Credentials 🔑",
//             templateName: "send-user-credentials",
//             replacements: {
//                 UserName: lead.first_name + " " + lead.last_name,
//                 UserEmail: lead.email,
//                 UserPassword: password,
//                 SupportEmail: "alco@support.com",
//                 YourCompanyName: "Al-and-co",
//                 LoginLink: "https://alco-crm-frontend.vercel.app/login?email=" + lead.email + "&password=" + password, 
//             },
//         });

//         res.status(201).json({ success: true, data: lead });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.createLead = async (req, res) => {
//     try {
//         const { email, first_name, last_name } = req.body;

//         // 1️⃣ Check Lead duplicate
//         // const existingLead = await Lead.findOne({ email });
//         // if (existingLead) {
//         //     return res.status(400).json({ message: "Lead with this email already exists" });
//         // }
//         // 2️⃣ Check if User already exists
//         const existingUser = await User.findOne({ email });

//         let user = existingUser;

//         let plainPassword = null;

//         // 3️⃣ If user does NOT exist → create user
//         if (!existingUser) {
//             plainPassword = Math.random().toString(36).slice(-8);

//             const hashedPassword = await bcrypt.hash(plainPassword, 10);

//             const avatarColor = generateColor(email);

//             user = await User.create({
//                 name: first_name + " " + last_name,
//                 email,
//                 password: hashedPassword,
//                 role: "user",
//                 isVerified: true,   // since created via lead
//                 isActive: true,
//                 isPlayable: false,
//                 avatarColor,
//                 isTemporaryPassword: true
//             });
//         }

//         // 4️⃣ Create Lead
//         const lead = await Lead.create({
//             ...req.body,
//             created_by: req.user?.id || null,
//         });

//         // 5️⃣ Send Email (only if new user created)
//         if (!existingUser) {
//             await sendEmailDynamic({
//                 to: email,
//                 subject: "Your Account Credentials 🔑",
//                 templateName: "send-user-credentials",
//                 replacements: {
//                     UserName: first_name + " " + last_name,
//                     UserEmail: email,
//                     UserPassword: plainPassword,
//                     SupportEmail: "alco@support.com",
//                     YourCompanyName: "Al-and-co",
//                     LoginLink:
//                         "https://alco-crm-frontend.vercel.app/login?email=" +
//                         email +
//                         "&password=" +
//                         plainPassword,
//                 },
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: existingUser
//                 ? "Lead created (user already exists)"
//                 : "Lead + User created successfully",
//             data: lead,
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// exports.createLead = async (req, res) => {
//     try {
//         const email = req.body.email?.toLowerCase().trim();
//         const { first_name, last_name, program_id } = req.body;

//         if (!email || !first_name || !program_id) {
//             return res.status(400).json({
//                 message: "Email, first name and program are required",
//             });
//         }

//         // 🔥 Duplicate check
//         const existingLead = await Lead.findOne({ email, program_id });

//         if (existingLead) {
//             // Silent success — no error, no new lead, no status change
//             return res.status(200).json({
//                 success: true,
//                 message: "Thank you for applying! We'll be in touch soon.",
//             });
//         }

//         // 🔥 Check user
//         const existingUser = await User.findOne({ email });

//         let user = existingUser;
//         let plainPassword = null;

//         if (!existingUser) {
//             plainPassword = Math.random().toString(36).slice(-8);
//             const hashedPassword = await bcrypt.hash(plainPassword, 10);

//             user = await User.create({
//                 name: `${first_name} ${last_name || ""}`.trim(),
//                 email,
//                 password: hashedPassword,
//                 role: "user",
//                 isVerified: true,
//                 isActive: true,
//                 isPlayable: false,
//                 avatarColor: generateColor(email),
//                 isTemporaryPassword: true,
//             });
//         }

//         // 🔥 Create lead
//         const lead = await Lead.create({
//             ...req.body,
//             email,
//             created_by: req.user?.id || null,
//         });

//         // 🔥 Send email
//         if (!existingUser) {
//             await sendEmailDynamic({
//                 to: email,
//                 subject: "Your Account Credentials 🔑",
//                 templateName: "send-user-credentials",
//                 replacements: {
//                     UserName: `${first_name} ${last_name || ""}`,
//                     UserEmail: email,
//                     UserPassword: plainPassword,
//                     SupportEmail: "alco@support.com",
//                     YourCompanyName: "Al-and-co",
//                     LoginLink:
//                         "https://alco-crm-frontend.vercel.app/login?email=" +
//                         email +
//                         "&password=" +
//                         plainPassword,
//                 },
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: existingUser
//                 ? "Lead created (user already exists)"
//                 : "Lead + User created successfully",
//             data: lead,
//         });

//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(400).json({
//                 message: "You have already applied for this program",
//             });
//         }

//         res.status(500).json({ message: error.message });
//     }
// };
// --------------------24/4/2026--------------------
// exports.createLead = async (req, res) => {
//     console.log("REQ BODY:", req.body);  // ← yeh add karo
//     console.log("PHONE:", req.body.phone);  // ← yeh add karo
//     try {
//         const email = req.body.email?.toLowerCase().trim();
//         const { first_name, last_name, program_id } = req.body;

//         if (!email || !first_name || !program_id) {
//             return res.status(400).json({
//                 message: "Email, first name and program are required",
//             });
//         }

//         // ── Step 1: User check ────────────────────────────────
//         // ── Step 1: User check ────────────────────────────────
//         const existingUser = await User.findOne({
//             email: email  // already lowercase trim ho chuka hai upar
//         });

//         if (existingUser) {
//             // Same program check
//             const existingLead = await Lead.findOne({ email, program_id });

//             if (existingLead) {
//                 return res.status(200).json({
//                     success: true,
//                     duplicate: true,
//                     message: "Thank you for your interest! We already have your application and will contact you soon. 😊",
//                 });
//             }

//             // ✅ Alag program — sirf lead banao
//             const lead = await Lead.create({
//                 ...req.body,
//                 email,
//                 created_by: req.user?.id || null,
//             });

//             return res.status(201).json({
//                 success: true,
//                 duplicate: false,
//                 message: "Thank you for applying! We'll be in touch soon. 😊",
//                 data: lead,
//             });
//         }

//         // ── Step 2: Naya user banao ───────────────────────────
//         const plainPassword = Math.random().toString(36).slice(-8);
//         const hashedPassword = await bcrypt.hash(plainPassword, 10);

//         const newUser = await User.create({
//             name: `${first_name} ${last_name || ""}`.trim(),
//             email,
//             phone: req.body.phone || null,  // ← ADD KARO
//             password: hashedPassword,
//             role: "user",
//             isVerified: true,
//             isActive: true,
//             avatarColor: generateColor(email),
//             isTemporaryPassword: true,
//         });

//         // ── Step 3: Lead banao ────────────────────────────────
//         const lead = await Lead.create({
//             ...req.body,
//             email,
//             created_by: req.user?.id || null,
//         });

//         // ── Step 4: Credentials email bhejo ──────────────────
//         await sendEmailDynamic({
//             to: email,
//             subject: "Your Account Credentials 🔑",
//             templateName: "send-user-credentials",
//             replacements: {
//                 UserName: `${first_name} ${last_name || ""}`,
//                 UserEmail: email,
//                 UserPassword: plainPassword,
//                 SupportEmail: "alco@support.com",
//                 YourCompanyName: "Al-and-co",
//                 LoginLink: `https://alco-crm-frontend.vercel.app/login?email=${email}&password=${plainPassword}`,
//             },
//         });

//         return res.status(201).json({
//             success: true,
//             duplicate: false,
//             message: "Thank you for applying! Check your email for login details. 😊",
//             data: lead,
//         });

//     } catch (error) {
//         console.log("FULL ERROR:", error); // ← yeh add karo temporarily
//         if (error.code === 11000) {
//             console.log("DUPLICATE KEY:", error.keyValue); // ← yeh bhi
//             return res.status(200).json({
//                 success: true,
//                 duplicate: true,
//                 message: "Thank you! We already have your details. 😊",
//             });
//         }
//         res.status(500).json({ message: error.message });
//     }
// };

// ─── Contact Form → Lead (website se aata hai) ────────────────
// exports.createLeadContact = async (req, res) => {
//     try {
//         const { first_name, last_name, email, phone, query } = req.body;

//         if (!first_name || !email) {
//             return res.status(400).json({
//                 success: false,
//                 message: "First name and email are required",
//             });
//         }

//         const cleanEmail = email.toLowerCase().trim();

//         // 🔍 Check existing lead
//         const existingLead = await Lead.findOne({ email: cleanEmail });

//         // 🔍 Check existing user
//         const existingUser = await User.findOne({ email: cleanEmail });

//         const plainPassword = Math.random().toString(36).slice(-8);
//         const hashedPass = await bcrypt.hash(plainPassword, 10);

//         // ✅ USER CREATE (always check)
//         if (!existingUser) {
//             await User.create({
//                 name: `${first_name} ${last_name || ""}`.trim(),
//                 email: cleanEmail,
//                 phone: phone || null,
//                 password: hashedPass,
//                 role: "user",
//                 isVerified: true,
//                 isActive: true,
//                 avatarColor: generateColor(cleanEmail),
//                 isTemporaryPassword: true,
//             });
//         }

//         // ❌ Lead already exist → sirf response do (but user ban chuka hoga)
//         if (existingLead) {
//             return res.status(200).json({
//                 success: true,
//                 duplicate: true,
//                 message: "Thank you! We already have your details 😊",
//             });
//         }

//         // ✅ New Lead create
//         const lead = await Lead.create({
//             first_name: first_name.trim(),
//             last_name: (last_name || "").trim(),
//             email: cleanEmail,
//             phone: phone || null,
//             query: query || null,
//             source: "contact",
//             status: "new",
//             quality: "cold",
//         });

//         await sendEmailDynamic({
//             to: email,
//             subject: "Your Account Credentials 🔑",
//             templateName: "send-user-credentials",
//             replacements: {
//                 UserName: `${first_name} ${last_name || ""}`,
//                 UserEmail: email,
//                 UserPassword: plainPassword,
//                 SupportEmail: "alco@support.com",
//                 YourCompanyName: "Al-and-co",
//                 LoginLink: `https://alco-crm-frontend.vercel.app/login?email=${email}&password=${plainPassword}`,
//             },
//         });

//         return res.status(201).json({
//             success: true,
//             duplicate: false,
//             message: "Thank you! We will contact you soon 😊",
//             data: { lead_id: lead._id },
//         });

//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };
// --------------------24/4/2026--------------------

// ─── createLead (program form se) ────────────────────────────
exports.createLead = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim();
        const { first_name, last_name, program_id } = req.body;

        if (!email || !first_name || !program_id) {
            return res.status(400).json({
                message: "Email, first name and program are required",
            });
        }

        // ── Step 1: User check ──────────────────────────────────
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Same program pe duplicate check
            const existingLead = await Lead.findOne({ email, program_id });

            if (existingLead) {
                return res.status(200).json({
                    success: true,
                    duplicate: true,
                    message: "Thank you for your interest! We already have your application and will contact you soon. 😊",
                });
            }

            // ✅ Alag program — lead banao + existingUser ka _id lagao
            const lead = await Lead.create({
                ...req.body,
                email,
                user_id: existingUser._id, // ← existing user ka id
                created_by: req.user?.id || null,
            });

            return res.status(201).json({
                success: true,
                duplicate: false,
                message: "Thank you for applying! We'll be in touch soon. 😊",
                data: lead,
            });
        }

        // ── Step 2: Naya user banao ─────────────────────────────
        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const newUser = await User.create({
            name: `${first_name} ${last_name || ""}`.trim(),
            email,
            phone: req.body.phone || null,
            password: hashedPassword,
            role: "user",
            isVerified: true,
            isActive: true,
            avatarColor: generateColor(email),
            isTemporaryPassword: true,
        });

        // ── Step 3: Lead banao + newUser ka _id lagao ───────────
        const lead = await Lead.create({
            ...req.body,
            email,
            user_id: newUser._id, // ← naya bana user ka id
            created_by: req.user?.id || null,
        });

        // ── Step 4: Credentials email bhejo ────────────────────
        await sendEmailDynamic({
            to: email,
            subject: "Your Account Credentials 🔑",
            templateName: "send-user-credentials",
            replacements: {
                UserName: `${first_name} ${last_name || ""}`,
                UserEmail: email,
                UserPassword: plainPassword,
                SupportEmail: "alco@support.com",
                YourCompanyName: "Al-and-co",
                LoginLink: `https://alco-crm-frontend.vercel.app/login?email=${email}&password=${plainPassword}`,
            },
        });

        return res.status(201).json({
            success: true,
            duplicate: false,
            message: "Thank you for applying! Check your email for login details. 😊",
            data: lead,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                duplicate: true,
                message: "Thank you! We already have your details. 😊",
            });
        }
        res.status(500).json({ message: error.message });
    }
};


// ─── createLeadContact (contact form se) ─────────────────────
exports.createLeadContact = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, query } = req.body;

        if (!first_name || !email) {
            return res.status(400).json({
                success: false,
                message: "First name and email are required",
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        const existingLead = await Lead.findOne({ email: cleanEmail });
        const existingUser = await User.findOne({ email: cleanEmail });

        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPass = await bcrypt.hash(plainPassword, 10);

        // ── User create ya existing use karo ───────────────────
        let userId;
        if (existingUser) {
            userId = existingUser._id; // ← existing user ka id
        } else {
            const newUser = await User.create({
                name: `${first_name} ${last_name || ""}`.trim(),
                email: cleanEmail,
                phone: phone || null,
                password: hashedPass,
                role: "user",
                isVerified: true,
                isActive: true,
                avatarColor: generateColor(cleanEmail),
                isTemporaryPassword: true,
            });
            userId = newUser._id; // ← naya user ka id

            // Sirf naye user ko credentials bhejo
            await sendEmailDynamic({
                to: email,
                subject: "Your Account Credentials 🔑",
                templateName: "send-user-credentials",
                replacements: {
                    UserName: `${first_name} ${last_name || ""}`,
                    UserEmail: email,
                    UserPassword: plainPassword,
                    SupportEmail: "alco@support.com",
                    YourCompanyName: "Al-and-co",
                    LoginLink: `https://alco-crm-frontend.vercel.app/login?email=${email}&password=${plainPassword}`,
                },
            });
        }

        // ── Duplicate lead check ────────────────────────────────
        if (existingLead) {
            return res.status(200).json({
                success: true,
                duplicate: true,
                message: "Thank you! We already have your details 😊",
            });
        }

        // ── Naya lead banao + user_id lagao ────────────────────
        const lead = await Lead.create({
            first_name: first_name.trim(),
            last_name: (last_name || "").trim(),
            email: cleanEmail,
            phone: phone || null,
            query: query || null,
            source: "contact",
            status: "new",
            quality: "cold",
            user_id: userId, // ← ab sahi se set ho raha hai
        });

        return res.status(201).json({
            success: true,
            duplicate: false,
            message: "Thank you! We will contact you soon 😊",
            data: { lead_id: lead._id },
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
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
// withpout notification update
// exports.updateLead = async (req, res) => {
//     try {
//         const lead = await Lead.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );

//         res.status(200).json({
//             success: true,
//             data: lead,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
exports.updateLead = async (req, res) => {
    try {
        const { id } = req.params;

        const oldLead = await Lead.findById(id);
        if (!oldLead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const updated = await Lead.findByIdAndUpdate(
            id,
            req.body,
            { returnDocument: "after", runValidators: true }
        );

        console.log("OLD LEAD:", oldLead);
        console.log("UPDATED LEAD:", updated);

        // ✅ Status change check
        if (
            req.body.status &&
            oldLead.status !== req.body.status &&
            updated.user_id
        ) {
            // 1. In-app notification
            await notifyStatusChanged({
                userId: updated.user_id.toString(),
                leadName: `${updated.first_name} ${updated.last_name}`,
                leadId: updated._id.toString(),
                newStatus: req.body.status,
                changedBy: req.user?._id?.toString(),
            });

            // 2. Email — user ka email fetch karo
            const user = await User.findById(updated.user_id).select("email name");
            if (user?.email) {
                await sendEmailDynamic({
                    to: user.email,
                    subject: "Your Request Has Been Updated 🔄",
                    templateName: "lead-status-update",
                    replacements: {
                        UserName: user.name || updated.first_name,
                        NewStatus: req.body.status,
                        LeadName: `${updated.first_name} ${updated.last_name}`,
                        SupportEmail: "alco@support.com",
                        YourCompanyName: "Al-and-co",
                    },
                });
            }
        }

        res.json({ success: true, data: updated });

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
// exports.assignLead = async (req, res) => {
//     try {
//         const { assigned_to } = req.body;

//         const lead = await Lead.findByIdAndUpdate(
//             req.params.id,
//             { assigned_to },
//             { new: true }
//         );

//         res.status(200).json({
//             success: true,
//             data: lead,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


exports.assignLead = async (req, res) => {
    try {
        const { assigned_to } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { assigned_to },
            { new: true }
        );

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        // ✅ 1. assigned_to (manager/rep) ko CRM notification
        if (assigned_to) {
            await notifyLeadAssigned({
                userId: assigned_to.toString(),
                leadName: `${lead.first_name} ${lead.last_name}`,
                leadId: lead._id.toString(),
                assignedBy: req.user?._id?.toString(),
            });
        }

        // ✅ 2. user_id (original user) ko request wali notification
        if (lead.user_id) {
            await createNotification({
                user_id: lead.user_id.toString(),
                type: "lead_assigned",
                title: "Your Request is Being Processed",
                message: `We have received your request and our team will contact you soon.`,
                lead_id: lead._id.toString(),
                triggered_by: req.user?._id?.toString(),
            });
        }

        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONVERT LEAD STATUS
exports.convertLead = async (req, res) => {
    try {
        const { program_id, batch_id, payment_plan_id } = req.body;

        if (!program_id) {
            return res.status(400).json({ message: "program_id is required" });
        }

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            {
                status: "converted",
                program_id,
                batch_id,
                payment_plan_id,
                converted_at: new Date(),
            },
            { new: true }
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
// exports.addActivity = async (req, res) => {
//     try {
//         const lead = await Lead.findById(req.params.id);
//         if (!lead) return res.status(404).json({ message: "Lead not found" });

//         lead.activities.push({
//             ...req.body,
//             created_by: req.user.id,
//         });

//         await lead.save();

//         res.status(201).json({ success: true, data: lead.activities });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

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

        // ── Notify + Email user (agar lead ka user_id hai) ────────
        if (lead.user_id) {
            const {
                activity_type,
                title,
                description,
                call_duration_minutes,
                call_outcome,
                email_subject,
                meeting_link,
                meeting_datetime,
                meeting_location,
            } = req.body;

            // 1. In-app notification
            await notifyActivityAdded({
                userId: lead.user_id.toString(),
                leadName: `${lead.first_name} ${lead.last_name}`,
                leadId: lead._id.toString(),
                activityId: lead.activities[lead.activities.length - 1]._id.toString(),
                activityType: activity_type,
                addedBy: req.user?._id?.toString(),
            });

            // 2. Email
            const user = await User.findById(lead.user_id).select("email name");
            if (user?.email) {

                // ── Activity type badge colors ──────────────────────
                const badgeStyles = {
                    call: { bg: "#DCFCE7", color: "#166534", icon: "📞" },
                    email: { bg: "#DBEAFE", color: "#1e40af", icon: "✉️" },
                    meeting: { bg: "#EDE9FE", color: "#5b21b6", icon: "📅" },
                    note: { bg: "#FEF9C3", color: "#854d0e", icon: "📝" },
                };
                const badge = badgeStyles[activity_type] || { bg: "#F3F4F6", color: "#374151", icon: "🔔" };

                // ── Conditional rows builder ────────────────────────
                const makeRow = (label, value) =>
                    value
                        ? `<tr style="border-bottom:1px solid #e2e8f0;">
                <td width="35%" style="padding:12px 16px; background:#f8fafc; font-size:12px; color:#718096; font-weight:600;">${label}</td>
                <td style="padding:12px 16px; font-size:14px; color:#1a202c;">${value}</td>
               </tr>`
                        : "";

                const makeLinkRow = (label, url) =>
                    url
                        ? `<tr style="border-bottom:1px solid #e2e8f0;">
                <td width="35%" style="padding:12px 16px; background:#f8fafc; font-size:12px; color:#718096; font-weight:600;">${label}</td>
                <td style="padding:12px 16px; font-size:14px;">
                  <a href="${url}" style="color:#185FA5; text-decoration:none;">${url}</a>
                </td>
               </tr>`
                        : "";

                await sendEmailDynamic({
                    to: user.email,
                    subject: `New ${activity_type} logged on your request`,
                    templateName: "activityAdded",
                    replacements: {
                        UserName: user.name || lead.first_name,
                        YourCompanyName: "Al-and-co",
                        SupportEmail: "alco@support.com",
                        ActivityType: activity_type,
                        ActivityIcon: badge.icon,
                        ActivityBadgeBg: badge.bg,
                        ActivityBadgeColor: badge.color,
                        ActivityTitle: title || "—",
                        LoggedBy: req.user?.name || "Team",

                        // Conditional rows
                        DescriptionRow: makeRow("Description", description),
                        CallDurationRow: makeRow("Call Duration", call_duration_minutes ? `${call_duration_minutes} mins` : ""),
                        CallOutcomeRow: makeRow("Call Outcome", call_outcome),
                        EmailSubjectRow: makeRow("Email Subject", email_subject),
                        MeetingLinkRow: makeLinkRow("Meeting Link", meeting_link),
                        MeetingDateRow: makeRow("Date & Time", meeting_datetime ? new Date(meeting_datetime).toLocaleString() : ""),
                        MeetingLocationRow: makeRow("Location", meeting_location),
                    },
                });
            }
        }

        res.status(201).json({ success: true, data: lead.activities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET LEADS STATS
// exports.getLeadsStats = async (req, res) => {
//   try {
//     const stats = await Lead.aggregate([
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           new: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
//           contacted: { $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] } },
//           qualified: { $sum: { $cond: [{ $eq: ["$status", "qualified"] }, 1, 0] } },
//           converted: { $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } },
//           lost: { $sum: { $cond: [{ $eq: ["$status", "lost"] }, 1, 0] } },
//           hot: { $sum: { $cond: [{ $eq: ["$quality", "hot"] }, 1, 0] } },
//           warm: { $sum: { $cond: [{ $eq: ["$quality", "warm"] }, 1, 0] } },
//           cold: { $sum: { $cond: [{ $eq: ["$quality", "cold"] }, 1, 0] } },
//           assigned: { $sum: { $cond: [{ $ne: ["$assigned_to", null] }, 1, 0] } },
//         }
//       }
//     ]);

//     const data = stats[0] || {
//       total: 0, new: 0, contacted: 0, qualified: 0,
//       converted: 0, lost: 0, hot: 0, warm: 0, cold: 0, assigned: 0
//     };

//     const conversionRate = data.total > 0
//       ? ((data.converted / data.total) * 100).toFixed(1)
//       : "0";

//     res.status(200).json({
//       success: true,
//       data: { ...data, conversionRate }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.getLeadsStats = async (req, res) => {
    try {
        const { userId } = req.query;

        const matchStage = userId
            ? { assigned_to: new mongoose.Types.ObjectId(userId) }
            : {};

        const stats = await Lead.aggregate([
            { $match: matchStage },
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

        const conversionRate =
            data.total > 0
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