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

        // Debug: Log the order data being sent
        const orderData = {
            userId,
            address,
            items,
            amount: amount + Math.floor(amount*0.02),
            date: Date.now()
        };
        
        console.log('Order data being sent to Order.create:', JSON.stringify(orderData, null, 2));
        console.log('Order model schema fields:', Object.keys(Order.schema.paths));

        // Create the order in database
        const order = await Order.create(orderData)

        await inngest.send({
            name: 'order/created',
            data:{
                userId,
                address,
                items,
                amount: amount + Math.floor(amount*0.02),
                date: Date.now()
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
        console.log('Order creation error:', error)
        console.log('Error details:', error.message)
        return NextResponse.json({success:false, message:error.message})
    }
}
