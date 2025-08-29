import express from "express";
import {
    createStudent,
    getStudents,
    getStudentByEnrollment,
    updateStudentByEnrollment,
    deleteStudentByEnrollment
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
router.get("/:enrollment", verifyToken, (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "faculty") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied" });
    }
}, getStudentByEnrollment);
router.put("/update-student/:enrollment", verifyToken, isAdmin, updateStudentByEnrollment);
router.delete("/delete-student/:enrollment", verifyToken, isAdmin, deleteStudentByEnrollment);

export default router;
