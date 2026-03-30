// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// // import routes
// const authRoute = require("./routes/authRoute");
// const userRoute = require("./routes/userRoute");
// const adminRoute = require("./routes/adminRoute");

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cors({
//   origin: [
//     process.env.BASE_URL,
//     process.env.LOCAL_BASE_URL
//   ],
//   credentials: true
// }));

//   // Basic Test Route
//   app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/admin", adminRoute);
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "ALCO CRM Backend Running Successfully 🚀",
//   });
// });

// mongoose
//   .connect(process.env.ATLAS_URL)
//   .then(() => {
//     console.log("✅ Database Connected Successfully");

//     app.listen(process.env.PORT || 5000, () => {
//       console.log(
//         `🚀 Server running on http://localhost:${process.env.PORT || 5000}`
//       );
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Database connection error:", err.message);
//   });

// module.exports = app;
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --------------------
// DB Connection
// --------------------
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.ATLAS_URL);

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};

// --------------------
// Connect DB BEFORE routes
// --------------------
connectDB();

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

// --------------------
// Test Route
// --------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});