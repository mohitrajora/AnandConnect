import express from "express";
import {
    createStudent,
    getStudents,
    getStudentByCollegeId,
    updateStudentByCollegeId,
    deleteStudentByCollegeId
} from "../controller/studentController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-student", verifyToken, isAdmin, createStudent);
router.get("/", verifyToken, (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "faculty") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied" });
    }
}, getStudents);
router.get("/:collegeId", verifyToken, (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "faculty") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied" });
    }
}, getStudentByCollegeId);
router.put("/update-student/:collegeId", verifyToken, isAdmin, updateStudentByCollegeId);
router.delete("/delete-student/:collegeId", verifyToken, isAdmin, deleteStudentByCollegeId);

export default router;
