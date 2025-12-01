import mongoose from "mongoose";

const machineRegistrySchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    machineName: {
        type: String,
        required: true,
    },
    machineNumber: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Company Owned', 'Hired Machine'],
        required: true,
    },
    ratePerHour: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const MachineRegistry = mongoose.model("MachineRegistry", machineRegistrySchema);
export default MachineRegistry;
