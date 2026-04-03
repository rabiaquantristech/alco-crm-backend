const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/userModel.js");

// ✅ GET ALL USERS (ADMIN ONLY)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE ANY USER
// exports.updateUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.updateUser = async (req, res) => {
  try {
 
    // ❌ Password is blocked here — use /change-password route
    const { password, ...updateFields } = req.body;
 
    if (password) {
      return res.status(400).json({
        success: false,
        message: "Password change not allowed here. Use /change-password route.",
      });
    }
 
    const existingUser = await User.findById(req.params.id);
 
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
 
    // ✅ Detect which fields actually changed
    const changedFields = [];
    for (const key of Object.keys(updateFields)) {
      if (String(existingUser[key]) !== String(updateFields[key])) {
        changedFields.push({
          field: key,
          oldValue: existingUser[key] ?? "N/A",
          newValue: updateFields[key],
        });
      }
    }
 
    // ✅ Save updated user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select("-password");
 
    // ✅ Send email only if something actually changed
    if (changedFields.length > 0) {
      const changedRows = changedFields
        .map(
          (c) => `
          <tr>
            <td style="padding:9px 12px; border-bottom:1px solid #e2e8f0;
              border-right:1px solid #e2e8f0; font-weight:600; color:#1a202c;
              text-transform:capitalize;">${c.field}</td>
            <td style="padding:9px 12px; border-bottom:1px solid #e2e8f0;
              border-right:1px solid #e2e8f0; color:#A32D2D;
              text-decoration:line-through;">${c.oldValue}</td>
            <td style="padding:9px 12px; border-bottom:1px solid #e2e8f0;
              color:#0F6E56; font-weight:600;">${c.newValue}</td>
          </tr>
        `
        )
        .join("");
 
      await sendEmail({
        to: existingUser.email,
        subject: "Account Details Updated ✏️",
        templateName: "user-update-admin",
        replacements: {
          UserName: existingUser.name,
          ChangedRows: changedRows,
          SupportEmail: "support@yourapp.com",
          YourCompanyName: "Al-and-cp",
        },
      });
    }
 
    res.status(200).json({
      success: true,
      user: updatedUser,
      notified: changedFields.length > 0,
      changedFields: changedFields.map((c) => c.field),
    });
 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE USER BY ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⚠️ DELETE ALL USERS (SUPER ADMIN ONLY)
exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();

    res.status(200).json({
      success: true,
      message: "All users deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CHANGE USER PASSWORD 
exports.changeUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
 
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }
 
    const user = await User.findById(req.params.id);
 
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
 
    await sendEmail({
      to: user.email,
      subject: "Password Changed 🔐",
      templateName: "user-password-update-admin",
      replacements: {
        UserName: user.name,
        ChangedBy: "Admin",
        DateTime: new Date().toLocaleString(),
        SupportEmail: "alco@support.com",
        YourCompanyName: "Al-and-co",
      },
    });
 
    res.status(200).json({
      success: true,
      message: `Password updated. Notification sent to ${user.email}`,
    });
 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};