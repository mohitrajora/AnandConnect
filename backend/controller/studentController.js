import Student from "../models/studentModel.js";

// CREATE a new student
export const createStudent = async (req, res) => {
    try {
        const { name, email, collegeId, course, year } = req.body;

        // Check if collegeId already exists
        const existingStudent = await Student.findOne({ collegeId });
        if (existingStudent) {
            return res.status(400).json({ message: "College ID already exists!" });
        }

        const student = new Student({ name, email, collegeId, course, year });
        await student.save();

        res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error creating student", error: error.message });
    }
};

// GET all students
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};

// GET single student by collegeId instead of _id
export const getStudentByCollegeId = async (req, res) => {
    try {
        const student = await Student.findOne({ collegeId: req.params.collegeId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
};

// UPDATE student by collegeId instead of _id
export const updateStudentByCollegeId = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            { collegeId: req.params.collegeId },
            req.body,
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Student updated successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error updating student", error: error.message });
    }
};

// DELETE student by collegeId instead of _id
export const deleteStudentByCollegeId = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({ collegeId: req.params.collegeId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error: error.message });
    }
};
