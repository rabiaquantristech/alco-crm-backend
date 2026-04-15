const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        // _id: { type: String, required: true },
        blog_id: { type: String, unique: true },
        title: { type: String, required: true },
        // slug: { type: String, unique: true, lowercase: true },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        excerpt: { type: String },
        // content: { type:  },
        content: [
            {
                type: {
                    type: String,
                    required: true
                },
                text: { type: String },
                items: [{
                    bold: { type: String },
                    text: { type: String },
                }]
            }
        ],
        thumbnail: { type: String },
        category: {
            type: String,
            enum: ["nlp", "icf", "hypnotherapy", "coaching", "mindset", "general"],
            default: "general",
        },
        tags: [{ type: String }],
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        is_featured: { type: Boolean, default: false },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        views: { type: Number, default: 0 },
        read_time: { type: Number, default: 5 },
    },
    { timestamps: true }
);

blogSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;     // ✅ frontend ke liye
    delete ret._id;
    delete ret.__v;
  },
});

// blogSchema.pre("save", function (next) {
//   if (!this.slug && this.title) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   }
//   next();
// });

module.exports = mongoose.model("Blog", blogSchema);