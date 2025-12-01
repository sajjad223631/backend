import Payment from "../models/Payment.js";

export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("projectId", "name status")
            .populate("createdBy", "name role")
            .sort({ date: -1 }); // Sort by most recent first
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPayment = async (req, res) => {
    const { projectId, amount, category, date, receivedBy, description } = req.body;
    console.log('Creating payment with data:', { projectId, amount, category, date, receivedBy, description });
    console.log('Created by user:', req.userData.userId);
    try {
        const newPayment = new Payment({
            projectId,
            amount,
            category,
            date: date || Date.now(),
            receivedBy,
            description,
            createdBy: req.userData.userId,
        });
        await newPayment.save();
        console.log('Payment saved successfully:', newPayment);

        // Update project totalAssigned
        const Project = (await import('../models/Project.js')).default;
        await Project.findByIdAndUpdate(
            projectId,
            { $inc: { totalAssigned: amount } },
            { new: true }
        );
        console.log('Project totalAssigned updated');

        res.status(201).json(newPayment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(400).json({ message: error.message });
    }
};
