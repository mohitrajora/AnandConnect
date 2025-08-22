import express from "express";
import {
    createStudent,
    getStudents,
    getStudentByCollegeId,
    updateStudentByCollegeId,
    deleteStudentByCollegeId
} from "../controller/studentController.js";

const router = express.Router();

router.post("/create-student", createStudent);
router.get("/", getStudents);
router.get("/:collegeId", getStudentByCollegeId);
router.put("/update-student/:collegeId", updateStudentByCollegeId);
router.delete("/delete-student/:collegeId", deleteStudentByCollegeId);

export default router;
