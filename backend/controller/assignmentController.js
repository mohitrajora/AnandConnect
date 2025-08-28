import Assignment from "../models/Assignment.js";

// Create assignment (Faculty only)
export const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        let imageUrl = "";

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const assignment = new Assignment({
            title,
            description,
            dueDate,
            imageUrl,
            createdBy: req.user.id
        });

        await assignment.save();
        res.status(201).json({ message: "Assignment created", assignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments (Students & Faculty)
export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate("createdBy", "name email role");
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete assignment (Faculty only)
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: "Not found" });

        if (assignment.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        await assignment.deleteOne();
        res.json({ message: "Assignment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
