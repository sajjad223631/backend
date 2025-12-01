
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import machineRoutes from "./routes/machineRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api", messageRoutes);

import User from "./models/User.js";
import bcrypt from "bcryptjs";
mongoose
  .connect(process.env.MONGODB_URI, {
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Seed Default Admin
    // const adminExists = await User.findOne({ role: "admin" });
    // if (!adminExists) {
    //     const hashedPassword = await bcrypt.hash("admin123", 12);
    //     const admin = new User({
    //         name: "Admin",
    //         email: "admin@gmail.com",
    //         password: hashedPassword,
    //         role: "admin",
    //     });
    //     await admin.save();
    //     console.log("Default Admin created: admin@gmail.com / admin123");
    // }

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });
