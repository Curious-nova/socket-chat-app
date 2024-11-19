import {Router} from "express"
import {verifyToken} from "../middlewares/AuthMiddleware.js"
import { createChannel, getChannelMessages, getUserChannel,getChannelMember,deleteChannelMember,changeChannelAdmin,AddMembers } from "../controllers/ChannelController.js";
const channelRoutes = Router();

channelRoutes.post("/create-channel",verifyToken,createChannel)
channelRoutes.get("/get-user-channels",verifyToken,getUserChannel)
channelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMessages)
channelRoutes.get("/get-channel-member/:channelId",verifyToken,getChannelMember)
channelRoutes.delete("/remove-channel-member/:channelId/:memberId",verifyToken,deleteChannelMember)
channelRoutes.put("/make-channel-admin/:channelId/:newAdminId",verifyToken,changeChannelAdmin)
channelRoutes.put("/add-channel-member/:channelId",AddMembers)


export default channelRoutes