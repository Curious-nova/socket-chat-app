import {Router} from "express";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import {verifyToken}  from "../middlewares/AuthMiddleware.js";
import multer from "multer";
const messagesRoutes = Router();
messagesRoutes.post("/get-messages",verifyToken,getMessages)
const upload = multer({dest:"uploads/files"});
messagesRoutes.post("/upload-file",verifyToken,upload.single("file"),uploadFile);
export default messagesRoutes;