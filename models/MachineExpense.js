import mongoose from "mongoose";

const machineExpenseSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MachineRegistry",
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    dieselCost: {
        type: Number,
        default: 0,
    },
    hoursUsed: {
        type: Number,
        default: 0,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const MachineExpense = mongoose.model("MachineExpense", machineExpenseSchema);
export default MachineExpense;
