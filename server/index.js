import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config();


const app = express();
app.use(cors(
    {
        origin:[process.env.ORIGIN],
        methods:["GET","POST","PUT","PATCH","DELETE"],
        credentials:true
    }
))
app.use(cookieParser())
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI


const server = app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})

mongoose.connect(MONGO_URI).then(() => console.log("Database connected successfully")).catch((err) => console.log(err.message))