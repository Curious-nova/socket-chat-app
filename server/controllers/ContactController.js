import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import Message from '../models/MessagesModel.js'

export const searchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;
        if (searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("searchTerm is required.");
        }

        // Escape special regex characters and split the search term into words
        const sanitizedSearchTerms = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").split(/\s+/);

        // Create a regex pattern that matches the start of any word
        const regexPatterns = sanitizedSearchTerms.map(term => new RegExp(`(^|\\s)${term}`, "i"));

        const contacts = await User.find({
            $and: [
                { _id: { $ne: request.userId } },
                {
                    $or: [
                        { firstName: { $in: regexPatterns } },
                        { lastName: { $in: regexPatterns } },
                        { email: { $in: regexPatterns } }
                    ]
                }
            ]
        });

        return response.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in searchContacts:", error);
        return response.status(500).send("Internal Server Error");
    }
};

export const getContactsForDMList = async (request, response, next) => {
    try {
        let { userId } = request;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: {
                    lastMessageTime: -1
                },
            }
        ]);

        return response.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in getContactsForDMList:", error);
        return response.status(500).send("Internal Server Error");
    }
};

export const getAllContacts = async (request, response, next) => {
    try {
        const users = await User.find({ _id: { $ne: request.userId } }, "firstName lastName _id email")

        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }));
        return response.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in getAllContacts:", error);
        return response.status(500).send("Internal Server Error");
    }
};

// Test the searchContacts function
const mockRequest = {
    body: { searchTerm: "jo" },
    userId: "someUserId"
};
const mockResponse = {
    status: (code) => ({
        json: (data) => console.log("Response:", code, JSON.stringify(data, null, 2)),
        send: (message) => console.log("Response:", code, message)
    })
};
await searchContacts(mockRequest, mockResponse);