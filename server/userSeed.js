import User from './models/User.js'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const userRegister = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const uri = process.env.MONGODB_URL;
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log("MongoDB connected");
        const existingUser = await User.findOne({ email: "admin@fdevsol.com" })
        if (existingUser) {
            console.log("Admin user already exists")
        } else {
            const hashPassword = await bcrypt.hash("Admin@fdevsol", 10)
            const newUser = new User({
                name: "Admin",
                email: "admin@fdevsol.com",
                password: hashPassword,
                role: "admin"
            })
            await newUser.save()
            console.log("Admin user created successfully")
        }
    } catch(error) {
        console.log("Error creating admin user:", error)
    }
    process.exit()
}

userRegister();
