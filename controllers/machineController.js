import Machine from "../models/Machine.js";
import MachineRegistry from "../models/MachineRegistry.js";
import MachineExpense from "../models/MachineExpense.js";
import Project from "../models/Project.js";

// --- Legacy Methods (Keep for backward compatibility if needed) ---
export const getMachines = async (req, res) => {
    try {
        const machines = await Machine.find().populate("projectId", "name");
        res.status(200).json(machines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createMachine = async (req, res) => {
    const { projectId, machineName, hoursUsed, ratePerHour } = req.body;
    try {
        const totalCost = hoursUsed * ratePerHour;
        const newMachine = new Machine({
            projectId,
            machineName,
            hoursUsed,
            ratePerHour,
            totalCost,
        });
        await newMachine.save();
        res.status(201).json(newMachine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- New Methods for Machine Registry & Expenses ---

export const registerMachine = async (req, res) => {
    const { projectId, machineName, machineNumber, type, ratePerHour } = req.body;
    try {
        const newMachine = new MachineRegistry({
            projectId,
            machineName,
            machineNumber,
            type,
            ratePerHour: ratePerHour || 0,
        });
        await newMachine.save();

        // Add machine ID to project's machines array
        await Project.findByIdAndUpdate(
            projectId,
            { $push: { machines: newMachine._id } }
        );

        res.status(201).json(newMachine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMachinesByProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const machines = await MachineRegistry.find({ projectId });
        res.status(200).json(machines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createMachineExpense = async (req, res) => {
    const { projectId, machineId, type, dieselCost, hoursUsed, totalCost } = req.body;
    try {
        const newExpense = new MachineExpense({
            projectId,
            machineId,
            type,
            dieselCost: dieselCost || 0,
            hoursUsed: hoursUsed || 0,
            totalCost,
        });
        await newExpense.save();

        // Update project's totalMachineExpenses and totalSpent
        await Project.findByIdAndUpdate(
            projectId,
            {
                $inc: {
                    totalMachineExpenses: totalCost,
                    totalSpent: totalCost
                }
            }
        );

        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMachineExpenses = async (req, res) => {
    try {
        const { machineId } = req.query;
        let query = {};
        if (machineId) {
            query.machineId = machineId;
        }

        const expenses = await MachineExpense.find(query)
            .populate("projectId", "name status")
            .populate("machineId", "machineName machineNumber");
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllRegisteredMachines = async (req, res) => {
    try {
        const machines = await MachineRegistry.find().populate("projectId", "name status");
        res.status(200).json(machines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
