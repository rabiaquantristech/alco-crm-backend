const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/roleMiddleware.js");
const {
  getBlogs, getBlogBySlug,
  adminGetBlogs, adminCreateBlog,
  adminUpdateBlog, adminDeleteBlog, adminPublishBlog,
  uploadImage
} = require("../controllers/blogController.js");
const multer = require("multer");

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadImage);

// Public
router.get("/public", getBlogs);
router.get("/public/:slug", getBlogBySlug);

// Admin
router.get("/", protect, authorize("super_admin", "admin"), adminGetBlogs);
router.post("", protect, authorize("super_admin", "admin"), adminCreateBlog);
router.put("/:id", protect, authorize("super_admin", "admin"), adminUpdateBlog);
router.delete("/:id", protect, authorize("super_admin", "admin"), adminDeleteBlog);
router.post("/:id/publish", protect, authorize("super_admin", "admin"), adminPublishBlog);

module.exports = router;