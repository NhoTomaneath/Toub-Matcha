import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request){
    try {
        const {userId} = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({success: false, message: "User not authenticated"})
        }
        
        const { address, items} = await request.json();

        if(!address || items.length === 0){
            return NextResponse.json({success: false, message:'Invalid data'});
        }
        
        await connectDB()
        
        // calculate amount using items 
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

        // Create the order in database
        const order = await Order.create({
            userId,
            address,
            items,
            amount: amount + Math.floor(amount*0.02),
            data: Date.now()
        })

        await  inngest.send({
            name: 'order/created',
            data:{
                userId,
                address,
                items,
                amount: amount + Math.floor(amount*0.02),
                data: Date.now()
            }
        })

        // clear user cart
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({success: false, message: "User not found"})
        }
        user.cartItems = {}
        await user.save()

        return NextResponse.json({success:true, message:'Order Placed'})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false, message:error.message})

        
    }
}
