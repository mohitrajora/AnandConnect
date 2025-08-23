import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser); // Register student/faculty/admin
router.post("/login", loginUser);       // Login student/faculty/admin

export default router;
