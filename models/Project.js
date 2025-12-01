import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    totalAssigned: {
        type: Number,
        default: 0,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
    totalMachineExpenses: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Completed"],
        default: "Active",
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    machines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MachineRegistry",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
