import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    machineName: {
        type: String,
        required: true,
    },
    hoursUsed: {
        type: Number,
        required: true,
    },
    ratePerHour: {
        type: Number,
        required: true,
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

const Machine = mongoose.model("Machine", machineSchema);
export default Machine;
