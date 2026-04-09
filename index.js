require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport.js");

// import routes
const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const adminRoute = require("./routes/adminRoute.js");
const leadRoutes = require("./routes/leadRoutes.js");
const programRoutes = require("./routes/programRoutes.js");
const connectDB = require("./config/db.js");

const app = express();

// Middlewares
app.use(express.json());

app.use(
  cors({
  origin: [
    "http://localhost:3000",
    "https://alco-crm-frontend.vercel.app",
    "https://alco-cms-website.vercel.app",
  ],
  credentials: true,
  })
);

// Session — passport se pehle hona chahiye
app.use(
  session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/programs", programRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ALCO CRM Backend Running Successfully 🚀",
  });
});

// mongoose
//   .connect(process.env.ATLAS_URL, {
//   serverSelectionTimeoutMS: 30000,
//   socketTimeoutMS: 45000
//   })
//   .then(() => {
//   console.log("✅ Database Connected Successfully");
//   if (process.env.NODE_ENV !== "production") {
//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
//     });
//   }
// }).catch((err) => {
//   console.error("❌ Database connection error:", err.message);
// });
connectDB()
  .then(() => {
    console.log("✅ Database Connected");

    if (process.env.NODE_ENV !== "production") {
      app.listen(process.env.PORT || 5000, () => {
        console.log(
          `🚀 Server running on http://localhost:${process.env.PORT || 5000}`
        );
      });
    }
  })
  .catch((err) => console.error("❌ DB Error:", err));

module.exports = app;