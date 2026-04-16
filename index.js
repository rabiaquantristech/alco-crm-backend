// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const passport = require("./config/passport.js");

// // import routes
// const authRoute = require("./routes/authRoute.js");
// const userRoute = require("./routes/userRoute.js");
// const adminRoute = require("./routes/adminRoute.js");
// const leadRoutes = require("./routes/leadRoutes.js");
// const programRoutes = require("./routes/programRoutes.js");
// const blogRoutes = require("./routes/blogRoute.js");
// const connectDB = require("./config/db.js");

// const app = express();

// // Middlewares
// app.use(express.json());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://alco-crm-frontend.vercel.app",
//       "https://alco-cms-website.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // 🔥 add
//     allowedHeaders: ["Content-Type", "Authorization"], // 🔥 add
//     credentials: true,
//   })
// );

// // Session — passport se pehle hona chahiye
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(async (req, res, next) => {
//   await connectDB();
//   next();
// });

// // Routes
// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/admin", adminRoute);
// app.use("/api/v1/leads", leadRoutes);
// app.use("/api/v1/programs", programRoutes);
// app.use("/api/v1/blogs", blogRoutes);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "ALCO CRM Backend Running Successfully 🚀",
//   });
// });

// // mongoose
// //   .connect(process.env.ATLAS_URL, {
// //   serverSelectionTimeoutMS: 30000,
// //   socketTimeoutMS: 45000
// //   })
// //   .then(() => {
// //   console.log("✅ Database Connected Successfully");
// //   if (process.env.NODE_ENV !== "production") {
// //     app.listen(process.env.PORT || 5000, () => {
// //       console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
// //     });
// //   }
// // }).catch((err) => {
// //   console.error("❌ Database connection error:", err.message);
// // });
// connectDB()
//   .then(() => {
//     console.log("✅ Database Connected");

//     if (process.env.NODE_ENV !== "production") {
//       app.listen(process.env.PORT || 5000, () => {
//         console.log(
//           `🚀 Server running on http://localhost:${process.env.PORT || 5000}`
//         );
//       });
//     }
//   })
//   .catch((err) => console.error("❌ DB Error:", err));

// module.exports = app;
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport.js");

const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const adminRoute = require("./routes/adminRoute.js");
const leadRoutes = require("./routes/leadRoutes.js");
const programRoutes = require("./routes/programRoutes.js");
const blogRoutes = require("./routes/blogRoute.js");
const connectDB = require("./config/db.js");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://alco-crm-frontend.vercel.app",
    "https://alco-cms-website.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Body parser
app.use(express.json());

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    return res.status(500).json({ success: false, message: "Database connection error" });
  }
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/programs", programRoutes);
app.use("/api/v1/blogs", blogRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ALCO CRM Backend Running Successfully",
  });
});

// Start the Server
const startServer = async () => {
  try {
    await connectDB(); // Initial connection for server start
    console.log("Database Connected");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB Error:", err);
  }
};

startServer();

module.exports = app;

