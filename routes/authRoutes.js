import express from "express";
import { signup, login, createSupervisor, getSupervisors, updateSupervisor, deleteSupervisor } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post(
    "/create-supervisor",
    protect,
    authorize(["admin"]),
    createSupervisor
);
router.get("/supervisors", protect, authorize(["admin"]), getSupervisors);
router.put("/supervisors/:id", protect, authorize(["admin"]), updateSupervisor);
router.delete("/supervisors/:id", protect, authorize(["admin"]), deleteSupervisor);

export default router;
