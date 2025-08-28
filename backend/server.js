import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // for login/register APIs
import { verifyToken } from "./middleware/auth.js"; // import middleware
import assignmentRoutes from "./routes/assignmentRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://anandconnect.onrender.com"], // allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Error:", err.message));

// Public routes (login/register)
app.use("/auth", authRoutes);

// Protected routes
app.use("/students", verifyToken, studentRoutes);

app.use("/assignments", assignmentRoutes);
app.use("/uploads", express.static("uploads")); // serve images

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
