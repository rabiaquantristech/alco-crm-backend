const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
        },
        short_description: {
            type: String,
        },
        level: {
            type: String,
            enum: ["level 1", "level 2", "level 3", "level 4", "level 5", "level 6"],
            required: true,
        },
        thumbnail: {
            type: String, // S3 URL
        },
        price: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
        duration_weeks: {
            type: Number,
        },
        category: {
            type: String,
            enum: ["nlp", "icf", "hypnotherapy", "trainer"],
        },
        status: {
            type: String,
            enum: ["active", "inactive", "draft"],
            default: "draft",
        },
        is_featured: {
            type: Boolean,
            default: false,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // Stats
        total_students: {
            type: Number,
            default: 0,
        },
        total_courses: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Auto slug generate from name
programSchema.pre("save", function (next) {
    if (this.isModified("name") && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    next();
});

module.exports = mongoose.model("Program", programSchema);