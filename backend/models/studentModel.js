import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // ensure unique email
            lowercase: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        collegeId: {
            type: String,
            required: true,
            unique: true, // ensure unique collegeId
            trim: true,
        },
        course: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { timestamps: true }
);

// Add an index for collegeId for faster lookup
studentSchema.index({ collegeId: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
