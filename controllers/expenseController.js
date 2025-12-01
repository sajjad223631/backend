import Expense from "../models/Expense.js";
import Project from "../models/Project.js";

export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate("projectId", "name status")
            .populate("createdBy", "name role")
            .sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createExpense = async (req, res) => {
    const { projectId, description, amount, category, date, receiptUrl } = req.body;
    console.log('Creating expense with data:', { projectId, amount, category, date, description });
    console.log('Created by user:', req.userData.userId);
    try {
        const newExpense = new Expense({
            projectId,
            description,
            amount,
            category,
            date: date || Date.now(),
            receiptUrl,
            createdBy: req.userData.userId,
        });
        await newExpense.save();
        console.log('Expense saved successfully:', newExpense);

        // Update project totalSpent
        const Project = (await import('../models/Project.js')).default;
        await Project.findByIdAndUpdate(
            projectId,
            { $inc: { totalSpent: amount } },
            { new: true }
        );
        console.log('Project totalSpent updated');

        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(400).json({ message: error.message });
    }
};

export const updateExpenseStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
