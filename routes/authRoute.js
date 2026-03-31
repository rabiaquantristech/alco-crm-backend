const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");
const authController = require("../controllers/authController.js");
const passport = require("../config/passport.js");

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
    const token = generateToken(req.user);
    const frontend = process.env.FRONTEND_URL; // FRONTEND URL
    res.redirect(
      `${frontend}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(req.user)
      )}`
    );
  }
);

// ================= LINKEDIN AUTH =================
router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontend = process.env.FRONTEND_URL; // FRONTEND URL
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