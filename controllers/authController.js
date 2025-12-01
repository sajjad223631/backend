import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_key"; // In production, use environment variable

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "client",
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ token, userId: newUser._id, role: newUser.role });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res
            .status(200)
            .json({ token, userId: existingUser._id, role: existingUser.role });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const createSupervisor = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newSupervisor = new User({
            name,
            email,
            password: hashedPassword,
            role: "supervisor",
        });

        await newSupervisor.save();

        res.status(201).json({ message: "Supervisor created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getSupervisors = async (req, res) => {
    try {
        const supervisors = await User.find({ role: "supervisor" }).select("-password");
        res.status(200).json(supervisors);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateSupervisor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        let updateData = { name, email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updateData.password = hashedPassword;
        }

        await User.findByIdAndUpdate(id, updateData);
        res.status(200).json({ message: "Supervisor updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const deleteSupervisor = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Supervisor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
