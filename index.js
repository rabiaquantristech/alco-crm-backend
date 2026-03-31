require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// import routes
const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const adminRoute = require("./routes/adminRoute.js");

const app = express();

// Middlewares
app.use(express.json());
// app.use(cors({
//   origin: [
//     process.env.BASE_URL,
//     process.env.LOCAL_BASE_URL
//   ],
//   credentials: true
// }));
app.use(cors({
  origin: "*",  
  credentials: false 
}));

// Basic Test Route
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
  .connect(process.env.ATLAS_URL)
  .then(() => {
    console.log("✅ Database Connected Successfully");

    // app.listen(process.env.PORT || 5000, () => {
    //   console.log(
    //     `🚀 Server running on http://localhost:${process.env.PORT || 5000}`
    //   );
    // });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

module.exports = app;
