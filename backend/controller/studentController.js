import Student from "../models/studentModel.js";

// CREATE a new student
export const createStudent = async (req, res) => {
    try {
        const { name, email, password, enrollment, phone, course } = req.body;

        // Check if enrollment already exists
        const existingStudent = await Student.findOne({ enrollment });
        if (existingStudent) {
            return res.status(400).json({ message: "Enrollment already exists!" });
        }

        const student = new Student({ name, email, password, enrollment, phone, course });
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

// GET single student by enrollment instead of collegeId
export const getStudentByEnrollment = async (req, res) => {
    try {
        const student = await Student.findOne({ enrollment: req.params.enrollment });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
};

// UPDATE student by enrollment
export const updateStudentByEnrollment = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            { enrollment: req.params.enrollment },
            req.body,
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Student updated successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error updating student", error: error.message });
    }
};

// DELETE student by enrollment
export const deleteStudentByEnrollment = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({ enrollment: req.params.enrollment });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error: error.message });
    }
};
