import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request){
    try{
        
        const {userId} = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({success: false, message: "User not authenticated"})
        }

        await connectDB()
        let user = await User.findById(userId)

        if(!user){
            // Create new user if not found
            user = await User.create({
                _id: userId,
                name: "New User",
                email: "user@example.com",
                imageURL: "",
                cartItems: {}
            })
        }

        return NextResponse.json({success:true, user})


    }catch (error){
        console.error("API Error:", error)
        return NextResponse.json({success: false, message: error.message})
    }

}