import express from "express";
import {
    getMachines,
    createMachine,
    registerMachine,
    getMachinesByProject,
    createMachineExpense,
    getMachineExpenses,
    getAllRegisteredMachines
} from "../controllers/machineController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Legacy routes
router.get("/", protect, getMachines);
router.post("/", protect, createMachine);

// New routes
router.post("/register", protect, registerMachine);
router.get("/all-registered", protect, getAllRegisteredMachines);
router.get("/project/:projectId", protect, getMachinesByProject);
router.post("/expense", protect, createMachineExpense);
router.get("/expense", protect, getMachineExpenses);

export default router;
