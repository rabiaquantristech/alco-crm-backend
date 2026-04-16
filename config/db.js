// const mongoose = require("mongoose");

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.ATLAS_URL, {
//       serverSelectionTimeoutMS: 5000,
//       // useNewUrlParser: true,
//       // useUnifiedTopology: true,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// module.exports = connectDB;
const mongoose = require("mongoose");

let cached = global.mongoose;

// Initialize the cached connection if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Return cached connection if it exists
  if (cached.conn) return cached.conn;

  // Create a new promise if it doesn't exist
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.ATLAS_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      useNewUrlParser: true,           // Use the new URL parser
      useUnifiedTopology: true,        // Use the new server discovery and monitoring engine
    })
    .then((connection) => {
      console.log("✅ Database Connected Successfully");
      return connection;
    })
    .catch((error) => {
      console.error("❌ Database connection error:", error.message);
      throw new Error("Database connection failed");
    });
  }

  // Store the connection in the cache
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
