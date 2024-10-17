import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt"; // Import the hash function

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is Required."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required."],
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
});

// another way to do bcrypt
// Pre-save middleware to hash the password before saving the user
// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) return next(); // Only hash the password if it has been modified
//     const salt = await genSalt(10); // Specify a salt rounds value (e.g., 10)
//     this.password = await hash(this.password, salt);
//     next();
// });

const User = mongoose.model("Users", userSchema);

export default User;

// original YOUTUBE VIDEO
// import mongoose from "mongoose"
// import {genSalt} from "bcrypt";
// const userSchema=new mongoose.Schema({
// userSchema.pre("save",async function(next){
//     const salt=await genSalt();
//     this.password=await hash(this.password,salt);
//     next(); 
// });
