import express from "express";
import multer from "multer";
import { verifyToken, isFaculty } from "../middleware/auth.js";
import { createAssignment, getAssignments, deleteAssignment } from "../controllers/assignmentController.js";

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post("/", verifyToken, isFaculty, upload.single("image"), createAssignment);
router.get("/", verifyToken, getAssignments);
router.delete("/:id", verifyToken, isFaculty, deleteAssignment);

export default router;
