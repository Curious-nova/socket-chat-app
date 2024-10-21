import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/AuthRoutes.js"
import contactsRoutes from "./routes/ContactRoutes.js"
import setupSocket from "./socket.js"
import  messagesRoutes from "./routes/MessagesRoutes.js"
dotenv.config();


const app = express();
app.use(cors(
    {
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }
))
app.use(cookieParser())
app.use(express.json())
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI

app.use("/api/auth", authRoutes);
app.use("/api/contacts",contactsRoutes);
app.use("/api/messages",messagesRoutes);


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

setupSocket(server);

mongoose.connect(MONGO_URI)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => {
        console.error("Database connection error:", err.message);
    });