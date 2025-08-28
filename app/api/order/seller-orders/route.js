import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        const {userId} = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!seller){
            return NextResponse.json({success:false, message:'not authorized'})
        }

        await connectDB()

        Address.length 

        const orders = await Order.find({}).populate('address items.product')

        return NextResponse.json({success:true, orders})




    } catch (error) {
        return NextResponse.json({success:false, message:error.message})
    }
}