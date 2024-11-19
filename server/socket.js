import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        try {
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);
            const createdMessage = await Message.create(message);

            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipient", "id email firstName lastName image color")
                .exec();

            // Emit to the sender
            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData);
            }

            // Emit to the recipient if they are online
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const sendChannelMessage = async (message) => {
        try {
            const { channelId, sender, content, messageType, fileUrl } = message;

            const createdMessage = await Message.create({
                sender,
                recipient: null,
                content,
                messageType,
                Timestamp: new Date(),
                fileUrl,
            });

            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .exec();

            // Update the channel with the new message
            await Channel.findByIdAndUpdate(channelId, {
                $push: { messages: createdMessage._id },
                lastMessage: content,
                lastMessageTime: createdMessage.Timestamp
            });

            const channel = await Channel.findById(channelId).populate("members");

            const finalData = { ...messageData._doc, channelId: channel._id };
            if (channel && channel.members) {
                channel.members.forEach((member) => {
                    const memberSocketId = userSocketMap.get(member._id.toString());
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("receive-channel-message", finalData);
                    }
                });
            }
        } catch (error) {
            console.error("Error sending channel message:", error);
        }
    };

    const handleTyping = (data) => {
        const { chatId, userId } = data;
        io.emit("user-typing", { chatId, userId });
    };

    const handleStopTyping = (data) => {
        const { chatId, userId } = data;
        io.emit("user-stop-typing", { chatId, userId });
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.warn("User ID not provided during connection.");
        }

        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", sendChannelMessage);
        socket.on("typing", handleTyping);
        socket.on("stop-typing", handleStopTyping);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;