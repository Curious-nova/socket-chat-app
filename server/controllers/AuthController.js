import { compare, hash } from 'bcrypt';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const maxAge = 3 * 24 * 60 * 60; // in seconds
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password are required.");
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).send("User with this email already exists.");
        }

        // Hash the password before saving it to the database
        const hashedPassword = await hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });


        // Create a JWT token and set it in a cookie
        const token = createToken(email, user.id);
        response.cookie("jwt", token, {
            maxAge: maxAge * 1000, // maxAge is in milliseconds for cookies
            httpOnly: true, // helps mitigate the risk of client side script accessing the token
            secure: false, // Keep as false for local development
            sameSite: "None",
        });

        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        });
    } catch (error) {
        console.error("Error during signup:", error);
        return response.status(500).send("Internal Server Error");
    }
};

export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password are required.");
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return response.status(404).send("User with given email not found.");
        }

        const auth = await compare(password, user.password);
        if (!auth) {
            return response.status(400).send("Password is incorrect.");
        }

        response.cookie("jwt", createToken(email, user.id), {
            maxAge: maxAge * 1000,  // 3 days in milliseconds
            secure: false, // Keep as false for local development
            sameSite: "None",
        });

        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });
    } catch (error) {
        console.error("Error during login:", error); // Log the error details
        return response.status(500).send("Internal Server Error");
    }
};


export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("User with given ID not found.");
        }

        // console.log(request.userId);
        return response.status(200).json({
            id: userData.id,
            cemail: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.error("Error during login:", error); // Log the error details
        return response.status(500).send("Internal Server Error");
    }
};


