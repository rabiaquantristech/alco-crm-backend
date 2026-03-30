const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");


// REGISTER 
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      isVerified: false,
    });

    const verificationUrl = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    // ✅ VERIFY EMAIL TEMPLATE use karo (registration nahi)
    await sendEmail({
      to: user.email,
      subject: "Verify your email ✅",
      templateName: "verify", // 👈 naya template banana hoga
      replacements: {
        UserName: user.name,
        VerifyLink: verificationUrl,
        YourCompanyName: "Al-and-cp"
      }
    });

    res.status(201).json({
      success: true,
      message: "Please verify your email first",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Check verification AFTER fetching user
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await sendEmail({
      to: user.email,
      subject: "New Login Alert 🔐",
      templateName: "login",
      replacements: {
        UserName: user.name,
        SecurityLink: "http://localhost:3000/security",
        YourCompanyName: "Al-and-cp"
      }
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // password hide
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP, expiry and reset attempts
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.resetPasswordAttempts = 0; // reset attempts on new OTP
  await user.save();

  // Send OTP email
  await sendEmail({
    to: user.email,
    subject: "Reset Password OTP 🔑",
    templateName: "forgot-password", // your forgotpassword.html template
    replacements: {
      UserName: user.name,
      OTP: otp,
      YourCompanyName: "Al-and-cp"
    }
  });

  res.json({
    success: true,
    message: "OTP sent to your email. It expires in 10 minutes."
  });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordExpire: { $gt: Date.now() } // OTP not expired
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Check OTP attempts
  if (user.resetPasswordAttempts >= 5) {
    return res.status(429).json({ message: "Too many wrong attempts. Request a new OTP." });
  }

  // Check OTP
  if (user.resetPasswordToken !== otp) {
    user.resetPasswordAttempts += 1;
    await user.save();
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  // ✅ OTP correct → update password
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.resetPasswordAttempts = 0; // reset counter
  await user.save();

  res.json({
    success: true,
    message: "Password reset successfully"
  });
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });

  // if (!user) {
  //   return res.status(400).json({ message: "Invalid token" });
  // }

  // ✅ Token invalid ya already used check
  if (!user) {
    return res.status(400).json({
      message: "This verification link has already been used or is invalid."
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();

  // ✅ Ab JWT do
  const token = generateToken(user);

  // ✅ Welcome email yahan bhejo (ab user verified hai)
  await sendEmail({
    to: user.email,
    subject: "Welcome 🎉",
    templateName: "registration",
    replacements: {
      UserName: user.name,
      LoginLink: "http://localhost:3000/login",
      YourCompanyName: "Al-and-cp"
    }
  });

  res.json({
    success: true,
    message: "Email verified successfully",
    token
  });
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
