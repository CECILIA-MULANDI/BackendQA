import mongoose from "mongoose";
import { config } from "dotenv";
export default async function connect() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    });
    console.log("db connected");
}