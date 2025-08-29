import connectDB from "@/config/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Address from "@/models/Address";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        
        // Test if models are registered
        const models = {
            user: mongoose.models.user,
            order: mongoose.models.order,
            product: mongoose.models.product,
            address: mongoose.models.address
        };
        
        // Test basic queries
        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();
        const productCount = await Product.countDocuments();
        const addressCount = await Address.countDocuments();
        
        return NextResponse.json({
            success: true,
            message: "Database connection successful",
            models: {
                user: !!models.user,
                order: !!models.order,
                product: !!models.product,
                address: !!models.address
            },
            counts: {
                users: userCount,
                orders: orderCount,
                products: productCount,
                addresses: addressCount
            }
        });
    } catch (error) {
        console.error("Test DB error:", error);
        return NextResponse.json({
            success: false,
            message: error.message,
            error: error.toString()
        });
    }
}
