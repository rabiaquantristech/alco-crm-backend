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

const app = express();

// Middlewares
app.use(express.json());

// app.use(
//   cors({
//   origin: [
//     "http://localhost:3000",
//     "https://alco-crm-frontend.vercel.app",
//     "https://alco-cms-website.vercel.app",
//   ],
//   credentials: true,
//   })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://alco-crm-frontend.vercel.app",
        "https://alco-cms-website.vercel.app",
      ];
      // ✅ Postman/server-to-server ke liye origin undefined allow karo
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Vercel pe OPTIONS preflight handle karo
app.options("*", cors());

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

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ALCO CRM Backend Running Successfully 🚀",
  });
});

mongoose
  .connect(process.env.ATLAS_URL, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
  })
  .then(() => {
  console.log("✅ Database Connected Successfully");
  if (process.env.NODE_ENV !== "production") {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  }
}).catch((err) => {
  console.error("❌ Database connection error:", err.message);
});

module.exports = app;