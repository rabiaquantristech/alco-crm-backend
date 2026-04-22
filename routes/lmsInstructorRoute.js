// routes/lmsRoute.js
const express = require("express");
const router  = express.Router();

const { protect }    = require("../middlewares/authMiddleware");
const { authorize }  = require("../middlewares/roleMiddleware");

const {
  // Instructor
  instructorGetCourses,
  instructorGetSessions,
  instructorGetAssignments,
  instructorGetSubmissions,
  instructorGradeSubmission
} = require("../controllers/lmsController");


// ═══════════════════════════════════════════════════════════════
// INSTRUCTOR ROUTES  —  /admin/v1/instructor
// ═══════════════════════════════════════════════════════════════

const isInstructor = authorize("admin", "super_admin", "instructor");

router.get("/courses",                        protect, isInstructor, instructorGetCourses);
router.get("/sessions",                       protect, isInstructor, instructorGetSessions);
router.get("/assignments",                    protect, isInstructor, instructorGetAssignments);
router.get("/assignments/:id/submissions",    protect, isInstructor, instructorGetSubmissions);
router.put("/submissions/:id/grade",          protect, isInstructor, instructorGradeSubmission);

module.exports = router;