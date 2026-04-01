const express = require("express");
const axios = require("axios");
const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");
const authController = require("../controllers/authController.js");
const passport = require("../config/passport.js");
const generateToken = require("../utils/generateToken.js");
const User = require("../models/userModel.js");

const router = express.Router();

const FRONTEND =
  process.env.NODE_ENV === "production"
    ? process.env.CRM_FRONTEND_URL
    : process.env.LOCAL_FRONTEND_URL;

// const FRONTEND = process.env.CRM_FRONTEND_URL;

// ================= NORMAL AUTH =================
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/logout", protect, authController.logout);

// ================= GOOGLE AUTH =================
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      const userData = encodeURIComponent(
        JSON.stringify({
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        })
      );
      res.redirect(`${FRONTEND}/auth/callback?token=${token}&user=${userData}`);
    } catch (error) {
      console.error("Google Callback Error:", error);
      res.redirect(`${FRONTEND}/login?error=google_failed`);
    }
  }
);

// ================= LINKEDIN AUTH =================
router.get("/linkedin", (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: `${process.env.BACKEND_BASE_URL}/api/auth/linkedin/callback`,
    scope: "openid profile email",
  });
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
});

router.get("/linkedin/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${FRONTEND}/login?error=linkedin_failed`);
  }

  try {
    // Token lo
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.BACKEND_BASE_URL}/api/auth/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

    // Profile lo
    const profileRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { name, email } = profileRes.data;

    // User find ya create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        isVerified: true,
        password: "oauth_linkedin",
      });
    }

    const token = generateToken(user);
    const userData = encodeURIComponent(
      JSON.stringify({ _id: user._id, name: user.name, email: user.email })
    );
    res.redirect(`${FRONTEND}/auth/callback?token=${token}&user=${userData}`);
  } catch (err) {
    console.error("LinkedIn OAuth error:", err.response?.data || err.message);
    res.redirect(`${FRONTEND}/login?error=linkedin_failed`);
  }
});

// ================= DASHBOARD ROUTES =================
router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get(
  "/manager-dashboard",
  protect,
  authorize("admin", "relationship-manager"),
  (req, res) => {
    res.json({ message: "Welcome Manager" });
  }
);

module.exports = router;


// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware.js");
// const { authorize } = require("../middlewares/roleMiddleware.js");
// const authController = require("../controllers/authController.js");
// const passport = require("../config/passport.js");
// const generateToken = require("../utils/generateToken.js");

// const router = express.Router();

// // ================= NORMAL AUTH =================
// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.get("/me", protect, authController.getMe);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);
// router.get("/verify-email/:token", authController.verifyEmail);

// router.post("/logout", protect, authController.logout);

// // ================= GOOGLE AUTH =================
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     try {
//       const token = generateToken(req.user);

//       const frontend = process.env.LOCAL_FRONTEND_URL;

//       if (!frontend) {
//         throw new Error("FRONTEND_URL is missing");
//       }

//       const userData = encodeURIComponent(
//         JSON.stringify({
//           _id: req.user._id,
//           name: req.user.name,
//           email: req.user.email,
//         })
//       );

//       return res.redirect(
//         `${frontend}/auth/callback?token=${token}&user=${userData}`
//       );
//     } catch (error) {
//       console.error("🔥 Google Callback Error:", error);
//       return res.status(500).json({
//         message: "OAuth failed",
//         error: error.message,
//       });
//     }
//   }
// );

// // ================= LINKEDIN AUTH =================
// router.get("/linkedin", passport.authenticate("linkedin"));

// router.get(
//   "/linkedin/callback",
//   passport.authenticate("linkedin", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     const token = generateToken(req.user);
//     const frontend = process.env.LOCAL_FRONTEND_URL; // FRONTEND URL
//     res.redirect(
//       `${frontend}/auth/callback?token=${token}&user=${encodeURIComponent(
//         JSON.stringify(req.user)
//       )}`
//     );
//   }
// );

// // ================= DASHBOARD ROUTES =================
// router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

// router.get(
//   "/manager-dashboard",
//   protect,
//   authorize("admin", "relationship-manager"),
//   (req, res) => {
//     res.json({ message: "Welcome Manager" });
//   }
// );

// module.exports = router;


// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware.js");
// const { authorize } = require("../middlewares/roleMiddleware.js");
// const authController = require("../controllers/authController.js");
// const passport = require("../config/passport.js");

// const router = express.Router();

// // ================= NORMAL AUTH =================
// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.get("/me", protect, authController.getMe);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);
// router.get("/verify-email/:token", authController.verifyEmail);

// router.post("/logout", protect, authController.logout);

// // ================= GOOGLE AUTH =================
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     const token = generateToken(req.user);
//     const frontend = process.env.BACKEND_BASE_URL;
//     res.redirect(
//       `${frontend}/auth/callback?token=${token}&user=${encodeURIComponent(
//         JSON.stringify(req.user)
//       )}`
//     );
//   }
// );

// // ================= LINKEDIN AUTH =================
// router.get(
//   "/linkedin",
//   passport.authenticate("linkedin")
// );

// router.get(
//   "/linkedin/callback",
//   passport.authenticate("linkedin", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     const token = generateToken(req.user);
//     const frontend = process.env.BACKEND_BASE_URL;
//     res.redirect(
//       `${frontend}/auth/callback?token=${token}&user=${encodeURIComponent(
//         JSON.stringify(req.user)
//       )}`
//     );
//   }
// );

// // ================= DASHBOARD ROUTES =================
// router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

// router.get(
//   "/manager-dashboard",
//   protect,
//   authorize("admin", "relationship-manager"),
//   (req, res) => {
//     res.json({ message: "Welcome Manager" });
//   }
// );

// module.exports = router;


// const express = require("express");
// const { protect } = require("../middlewares/authMiddleware.js");
// const { authorize } = require("../middlewares/roleMiddleware.js");
// const authController = require("../controllers/authController.js");
// const passport = require("../config/passport.js");

// const router = express.Router();

// // ================= NORMAL AUTH =================
// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.get("/me", protect, authController.getMe);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);
// router.get("/verify-email/:token", authController.verifyEmail);

// router.post("/logout", protect, authController.logout);

// // ================= GOOGLE AUTH =================
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     const token = generateToken(req.user);
//     const frontend = process.env.BACKEND_BASE_URL;
//     res.redirect(
//       `${frontend}/auth/callback?token=${token}&user=${encodeURIComponent(
//         JSON.stringify(req.user)
//       )}`
//     );
//   }
// );

// // ================= LINKEDIN AUTH =================
// router.get(
//   "/linkedin",
//   passport.authenticate("linkedin")
// );

// router.get(
//   "/linkedin/callback",
//   passport.authenticate("linkedin", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     const token = generateToken(req.user);
//     const frontend = process.env.BACKEND_BASE_URL;
//     res.redirect(
//       `${frontend}/auth/callback?token=${token}&user=${encodeURIComponent(
//         JSON.stringify(req.user)
//       )}`
//     );
//   }
// );

// // ================= DASHBOARD ROUTES =================
// router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

// router.get(
//   "/manager-dashboard",
//   protect,
//   authorize("admin", "relationship-manager"),
//   (req, res) => {
//     res.json({ message: "Welcome Manager" });
//   }
// );

// module.exports = router;