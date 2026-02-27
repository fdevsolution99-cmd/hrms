import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    await connectToDatabase()
    try {
        const existingUser = await User.findOne({ email: "samyukthak3333@gmail.com" })
        if (existingUser) {
            console.log("Admin user already exists")
        } else {
            const hashPassword = await bcrypt.hash("Samu0228", 10)
            const newUser = new User({
                name: "Admin",
                email: "samyukthak3333@gmail.com",
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