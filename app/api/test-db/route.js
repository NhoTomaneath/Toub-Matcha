import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Testing database connection...")
        
        // Test connection
        await connectDB()
        console.log("Database connected successfully!")
        
        // Test user creation
        const testUser = await User.create({
            _id: "test-user-" + Date.now(),
            name: "Test User",
            email: "test@example.com",
            imageURL: "",
            cartItems: {}
        })
        
        console.log("Test user created:", testUser)
        
        // Count all users
        const userCount = await User.countDocuments()
        console.log("Total users in database:", userCount)
        
        return NextResponse.json({
            success: true,
            message: "Database connection successful",
            testUser: testUser,
            totalUsers: userCount
        })
        
    } catch (error) {
        console.error("Database test error:", error)
        return NextResponse.json({
            success: false,
            message: error.message,
            stack: error.stack
        })
    }
}
