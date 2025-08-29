import express from "express";
import { createFaculty, getFaculties } from "../controller/facultyController.js";
import authMiddleware from "../middleware/auth.js"; // ✅ protects routes with JWT

const router = express.Router();

// POST -> Add Faculty
router.post("/create", authMiddleware, createFaculty);

// GET -> Fetch All Faculties
router.get("/", authMiddleware, getFaculties);

export default router;
