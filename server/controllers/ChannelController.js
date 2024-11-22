import User from "../models/UserModel.js"
import Channel from "../models/ChannelModel.js"
import mongoose from "mongoose";
export const createChannel = async (request, response, next) => {
    try {
        const { name, members } = request.body

        const userId = request.userId;

        const admin = await User.findById(userId)

        if (!admin) {
            return response.status(400).send("Admin user not found!!!")

        }

        const validMembers = await User.find({ _id: { $in: members } })
        if (validMembers.length !== members.length) {
            return response.status(400).send("Some members are not valid users")
        }

        const newChannel = new Channel({
            name, members, admin: userId
        });

        await newChannel.save();
        return response.status(201).json({ channel: newChannel });
    } catch (error) {
        console.log(error)
        return response.status(500).send("Internal Server Error")
    }
};

export const getUserChannel = async (request, response, next) => {
    try {

        const userId = new mongoose.Types.ObjectId(request.userId);

        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],

        }).sort({ updatedAt: -1 });


        const admin = await User.findById(userId)
        return response.status(201).json({ channels });
    } catch (error) {
        console.log(error)
        return response.status(500).send("Internal Server Error")
    }
};

export const getChannelMessages = async (request, response, next) => {
    try {
        const { channelId } = request.params
        const channel = await Channel.findById(channelId).populate({
            path: "messages", populate: {
                path: "sender", select: "firstName lastName email _id image color",

            }
        });
        if (!channel) {
            response.status(404).send("Channel not found")
        }
        const messages = channel.messages;
        return response.status(201).json({ messages });
    } catch (error) {
        console.log(error)
        return response.status(500).send("Internal Server Error")
    }
}

export const getChannelMember = async (request, response, next) => {
    try {
        const { channelId } = request.params;
        // Validate and convert channelId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return response.status(400).send("Invalid Channel ID");
        }

        // Find the channel and populate the members field
        const channel = await Channel.findById(channelId).populate('members');

        // Check if the channel exists
        if (!channel) {
            return response.status(404).send("Channel not found");
        }
        const adminDetails = await User.findById(channel.admin)
        // Respond with the populated members data
        return response.status(200).json({ admin: channel.admin, members: channel.members, adminDetails });
    } catch (error) {
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const deleteChannelMember = async (request, response, next) => {
    try {
        const { channelId, memberId } = request.params;
        // Validate channelId and memberId
        if (!mongoose.Types.ObjectId.isValid(channelId) || !mongoose.Types.ObjectId.isValid(memberId)) {
            return response.status(400).send("Invalid Channel or Member ID");
        }

        // Find the channel
        const channel = await Channel.findById(channelId);

        // Check if the channel exists
        if (!channel) {
            return response.status(404).send("Channel not found");
        }

        // Check if the member exists in the members list
        const memberExists = channel.members.some(member => member.toString() === memberId);
        if (!memberExists) {
            return response.status(404).send("Member not found in this channel");
        }

        // Remove the member from the members array
        channel.members.pull(memberId);
        await channel.save();

        // Optionally, re-fetch the updated channel with populated members
        const updatedChannel = await Channel.findById(channelId).populate('members');
        const adminDetails = await User.findById(updatedChannel.admin)

        // Respond with updated admin and members data
        return response.status(200).json({ admin: updatedChannel.admin, members: updatedChannel.members,adminDetails });
    } catch (error) {
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const changeChannelAdmin = async (request, response, next) => {
    try {
        const { channelId, newAdminId } = request.params;
         // Validate channelId and memberId
         if (!mongoose.Types.ObjectId.isValid(channelId) || !mongoose.Types.ObjectId.isValid(newAdminId)) {
            return response.status(400).send("Invalid Channel or new Admin ID");
        }

        // Convert string IDs to ObjectIds after validation
        const channelObjectId = new mongoose.Types.ObjectId(channelId);
        const newAdminObjectId = new mongoose.Types.ObjectId(newAdminId);

        // Find the channel
        const channel = await Channel.findById(channelObjectId);

        // Check if the channel exists
        if (!channel) {
            return response.status(404).send("Channel not found");
        }

        // Retrieve the current admin ID from the channel
        const currentAdminId = channel.admin;

        // Update the admin field to newAdminId
        channel.admin = newAdminObjectId;

        // Add currentAdminId to members array if it's not already there
        if (!channel.members.some(member => member.equals(currentAdminId))) {
            channel.members.push(currentAdminId);
        }

        // Remove newAdminId from members array if it's there (to avoid duplication)
        channel.members.pull(newAdminObjectId);

        // Save the changes
        await channel.save();

        // Optionally, re-fetch the updated channel with populated members
        const updatedChannel = await Channel.findById(channelObjectId).populate('members');
        const adminDetails = await User.findById(updatedChannel.admin)
        // Respond with updated admin and members data
        return response.status(200).json({ admin: updatedChannel.admin, members: updatedChannel.members,adminDetails });
    } catch (error) {
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const AddMembers = async (request, response, next) => {
    try {
        const { channelId } = request.params;
        const { newMemberIds } = request.body;

        // Validate channelId
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return response.status(400).send("Invalid Channel ID");
        }

        // Validate newMemberIds
        if (!Array.isArray(newMemberIds) || newMemberIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return response.status(400).send("Invalid Member IDs");
        }

        // Find the channel
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return response.status(404).send("Channel not found");
        }

        // Find valid members and filter out non-existent users
        const newMembers = await User.find({ _id: { $in: newMemberIds } });
        if (newMembers.length === 0) {
            return response.status(404).send("No valid users found to add");
        }

        const newMemberIdsSet = new Set(newMembers.map(member => member._id.toString()));

        // Filter out members already in the channel
        const existingMembersSet = new Set(channel.members.map(member => member.toString()));
        const membersToAdd = [...newMemberIdsSet].filter(id => !existingMembersSet.has(id));

        if (membersToAdd.length === 0) {
            return response.status(400).send("All specified users are already members of the channel");
        }

        // Add new members to the channel
        channel.members.push(...membersToAdd);
        await channel.save();

        // Optionally, re-fetch the updated channel with populated members
        const updatedChannel = await Channel.findById(channelId).populate('members');

        // Respond with updated members data
        return response.status(200).json({
            message: "Members added successfully",
            channel: updatedChannel,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const deleteChannel = async (request, response, next) => {
    try {
        const { channelId } = request.params;
        console.log(channelId)
        // Validate channelId
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return response.status(400).send("Invalid Channel ID");
        }

        // Find the channel
        const channel = await Channel.findById(channelId);

        // Check if the channel exists
        if (!channel) {
            return response.status(404).send("Channel not found");
        }

        // Delete the channel
        await Channel.findByIdAndDelete(channelId);

        // Respond with a success message
        return response.status(200).send("Channel deleted successfully");
    } catch (error) {
        console.error(error);
        return response.status(500).send("Internal Server Error");
    }
};

