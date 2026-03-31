const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");
const authController = require("../controllers/authController.js");
const passport = require("../config/passport.js");
const generateToken = require("../utils/generateToken.js");

const router = express.Router();

// ================= NORMAL AUTH =================
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify-email/:token", authController.verifyEmail);

router.post("/logout", protect, authController.logout);

// ================= GOOGLE AUTH =================
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);

      const frontend = process.env.LOCAL_FRONTEND_URL;

      if (!frontend) {
        throw new Error("FRONTEND_URL is missing");
      }

      const userData = encodeURIComponent(
        JSON.stringify({
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        })
      );

      return res.redirect(
        `${frontend}/auth/callback?token=${token}&user=${userData}`
      );
    } catch (error) {
      console.error("🔥 Google Callback Error:", error);
      return res.status(500).json({
        message: "OAuth failed",
        error: error.message,
      });
    }
  }
);

// ================= LINKEDIN AUTH =================
// LinkedIn initiate
router.get(
  "/linkedin",
  passport.authenticate("linkedin-oidc")
);

// LinkedIn callback
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin-oidc", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontend = process.env.CRM_FRONTEND_URL;
    res.redirect(
      `${frontend}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(req.user)
      )}`
    );
  }
);

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