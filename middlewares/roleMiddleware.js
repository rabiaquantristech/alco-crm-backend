// // middleware/roleMiddleware.js

// /**
//  * Role-based access control middleware
//  * Usage: router.get("/route", protect, authorize("admin", "finance_manager"), handler)
//  */
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied: insufficient permissions",
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
//       });
//     }

//     next();
//   };
// };

// /**
//  * Shorthand guards
//  */
// exports.isAdmin = (req, res, next) => {
//   if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
//     return res.status(403).json({ success: false, message: "Admin access required" });
//   }
//   next();
// };

// exports.isSuperAdmin = (req, res, next) => {
//   if (!req.user || req.user.role !== "super_admin") {
//     return res.status(403).json({ success: false, message: "Super Admin access required" });
//   }
//   next();
// };

// exports.isFinanceManager = (req, res, next) => {
//   if (!req.user || !["finance_manager", "admin", "super_admin"].includes(req.user.role)) {
//     return res.status(403).json({ success: false, message: "Finance Manager access required" });
//   }
//   next();
// };

// exports.isStudent = (req, res, next) => {
//   if (!req.user || req.user.role !== "student") {
//     return res.status(403).json({ success: false, message: "Student access required" });
//   }
//   next();
// };

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};