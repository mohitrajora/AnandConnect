import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    imageUrl: { type: String }, // to store uploaded image URL
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // faculty
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Assignment", assignmentSchema);
