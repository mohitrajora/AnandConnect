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
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        enrollment: {
            type: String,
            required: true,
            unique: true, // ensure unique enrollment no.
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
        },
        course: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

// Add an index for enrollment for faster lookup
studentSchema.index({ enrollment: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
