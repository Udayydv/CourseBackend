// ------------------- IMPORTS -------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

// ------------------- CONFIG -------------------
dotenv.config();
const app = express();

// ------------------- CORS CONFIG -------------------
// ✅ Allow only your frontend (Vercel) + localhost (for testing)
const allowedOrigins = [
  "https://lms-frontend-six-wheat.vercel.app/", // production frontend (no trailing slash!)
  "http://localhost:5173",                     // local Vite dev
];

// 🔍 Log origin for debugging
app.use((req, res, next) => {
  console.log("🔹 Request from origin:", req.headers.origin);
  next();
});

// ✅ Must be before any routes
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow tools like Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ allow cookies / credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------- STATIC FILES -------------------
app.use("/uploads", express.static("uploads"));

// ------------------- ROUTES -------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/creator", require("./routes/creator"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/enroll", require("./routes/enrollment"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/certificates", require("./routes/certificates"));

// ------------------- DATABASE -------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------- HEALTH CHECK -------------------
app.get("/api/health", (req, res) => {
  res.json({ message: "API is working!", status: "OK" });
});

// ------------------- ERROR HANDLER -------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  if (err.message.includes("CORS")) {
    return res.status(403).json({ success: false, message: "CORS blocked this origin" });
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ------------------- SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
