import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product"; 
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const {userId} = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({success: false, message: "User not authenticated"})
        }

        await connectDB()

        const orders = await Order.find({userId})
            .populate({
                path: 'address',
                model: 'address',
                select: 'fullName phoneNumber pinCode area city state'
            })
            .populate({
                path: 'items.product',
                model: 'product',
                select: 'name price offerPrice image'
            })
            .lean();

        return NextResponse.json({success:true, orders})
    } catch (error) {
        console.error("Order list error:", error)
        return NextResponse.json({success:false, message: error.message})
    }
}