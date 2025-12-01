import Message from "../models/Message.js";
import User from "../models/User.js";

// Helper function to generate conversation ID
const getConversationId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
    try {
        const userId = req.userData.userId;

        // Get all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
            .populate("senderId", "name role")
            .populate("receiverId", "name role")
            .sort({ timestamp: -1 });

        // Group by conversation and get latest message for each
        const conversationsMap = new Map();

        messages.forEach((msg) => {
            const conversationId = msg.conversationId;
            if (!conversationsMap.has(conversationId)) {
                // Determine the other user in conversation
                const otherUser =
                    msg.senderId._id.toString() === userId
                        ? msg.receiverId
                        : msg.senderId;

                // Count unread messages in this conversation
                const unreadCount = messages.filter(
                    (m) =>
                        m.conversationId === conversationId &&
                        m.receiverId._id.toString() === userId &&
                        !m.read
                ).length;

                conversationsMap.set(conversationId, {
                    conversationId,
                    otherUser: {
                        _id: otherUser._id,
                        name: otherUser.name,
                        role: otherUser.role,
                    },
                    lastMessage: msg.message,
                    lastMessageTime: msg.timestamp,
                    unreadCount,
                });
            }
        });

        const conversations = Array.from(conversationsMap.values());
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all messages in a conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userData.userId;

        const messages = await Message.find({ conversationId })
            .populate("senderId", "name role")
            .populate("receiverId", "name role")
            .sort({ timestamp: 1 });

        // Mark messages as read if current user is receiver
        await Message.updateMany(
            {
                conversationId,
                receiverId: userId,
                read: false,
            },
            { read: true }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: error.message });
    }
};

// Send a new message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.userData.userId;

        // Generate conversation ID
        const conversationId = getConversationId(senderId, receiverId);

        const newMessage = new Message({
            conversationId,
            senderId,
            receiverId,
            message,
        });

        await newMessage.save();

        // Populate sender and receiver info
        await newMessage.populate("senderId", "name role");
        await newMessage.populate("receiverId", "name role");

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(400).json({ message: error.message });
    }
};

// Mark message as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );

        res.status(200).json(message);
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(400).json({ message: error.message });
    }
};

// Get all users (for chat user selection)
export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.userData.userId;

        // Get all users except current user
        const users = await User.find(
            { _id: { $ne: currentUserId } },
            "name email role"
        ).sort({ name: 1 });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: error.message });
    }
};
