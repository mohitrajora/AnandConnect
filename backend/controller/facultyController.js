import Faculty from "../models/Faculty.js";
import bcrypt from "bcryptjs";

// ✅ Create Faculty
export const createFaculty = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        // check missing fields
        if (!name || !email || !password || !department) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if email exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ message: "Faculty already exists with this email" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const faculty = new Faculty({
            name,
            email,
            password: hashedPassword,
            department
        });

        await faculty.save();

        res.status(201).json({ message: "Faculty created successfully", faculty });
    } catch (err) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};

// ✅ Get All Faculties
export const getFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find().sort({ createdAt: -1 });
        res.json(faculties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
