const Blog = require("../models/blogModel.js");


// Public
exports.getBlogs = async (req, res) => {
  try {
    // ✅ Yeh missing tha
    const { page = 1, limit = 9, category, search } = req.query;

    const query = { status: "published" };
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];

    // const blogs = await Blog.find(query)
    //   .populate("author", "name")
    //   .sort({ createdAt: -1 })
    //   .skip((Number(page) - 1) * Number(limit))
    //   .limit(Number(limit));

    const blogs = await Blog.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // const formattedBlogs = blogs.map((blog) => {
    //   const obj = blog.toObject(); // 👈 important
    //   obj.id = obj._id;
    //   delete obj._id;
    //   delete obj.__v;
    //   return obj;
    // });

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // ✅ Seedha blog object bhejo — sab fields automatically aayengi
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Naya admin endpoint add karo
exports.adminGetBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "name");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const blogObj = blog.toObject({ versionKey: false });

    console.log("blogObj._id:", blogObj._id); // ✅ dekho kya aata hai

    res.status(200).json({
      success: true,
      data: {
        ...blogObj,
        id: String(blogObj._id), // ✅ String() safe hai toString() se
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminGetBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const blogs = await Blog.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)), // ✅ Yeh add kiya
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminCreateBlog = async (req, res) => {
  try {
    const { title, slug, thumbnail } = req.body;

    // Slug generation logic
    const finalSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Duplicate slug check
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Blog with this slug already exists",
      });
    }

    // Blog creation with thumbnail
    const blog = await Blog.create({
      ...req.body,
      slug: finalSlug,
      author: req.user.id,
      thumbnail, // Add thumbnail here
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminUpdateBlog = async (req, res) => {
  try {
    // ✅ id ki jagah slug se update karo
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.id }, // req.params.id mein slug aayega
      req.body,
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminDeleteBlog = async (req, res) => {
  try {
    await Blog.findOneAndDelete({ slug: req.params.id });
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.adminPublishBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findByIdAndUpdate(
//       req.params.id,
//       { status: "published" },
//       { new: true }
//     );
//     res.status(200).json({ success: true, data: blog });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.adminPublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { $or: [{ slug: req.params.id }, { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null }] },
      { status: "published" },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};