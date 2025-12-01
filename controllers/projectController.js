import Project from "../models/Project.js";
import MachineExpense from "../models/MachineExpense.js";

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("supervisor", "name email");
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    const { name, description, budget, supervisor } = req.body;
    try {
        const newProject = new Project({
            name,
            description,
            budget,
            supervisor,
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
