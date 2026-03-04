import User from './models/User.js'
import bcrypt from 'bcryptjs'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    await connectToDatabase()
    try {
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