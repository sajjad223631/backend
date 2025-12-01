import express from "express";
import {
    getExpenses,
    createExpense,
    updateExpenseStatus,
} from "../controllers/expenseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getExpenses);
router.post("/", protect, createExpense);
router.put("/:id/status", protect, authorize(["admin", "supervisor"]), updateExpenseStatus);

export default router;
