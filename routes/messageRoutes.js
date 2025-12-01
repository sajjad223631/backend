import express from "express";
import {
    getConversations,
    getMessages,
    sendMessage,
    markAsRead,
    getAllUsers,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all conversations for current user
router.get("/conversations", getConversations);

// Get all messages in a conversation
router.get("/messages/:conversationId", getMessages);

// Send a new message
router.post("/messages", sendMessage);

// Mark message as read
router.put("/messages/:id/read", markAsRead);

// Get all users (for chat user selection)
router.get("/users", getAllUsers);

export default router;
