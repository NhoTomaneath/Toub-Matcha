import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import Address from "@/models/Address";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const {userId} = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({success: false, message: "User not authenticated"})
        }

        const isSeller = await authSeller(userId)

        if (!isSeller){
            return NextResponse.json({success:false, message:'Not authorized as seller'})
        }

        await connectDB()

        // Get basic orders first
        const basicOrders = await Order.find({}).lean();
        console.log('Basic orders found:', basicOrders.length);
        
        if (basicOrders.length > 0) {
            console.log('Sample basic order:', JSON.stringify(basicOrders[0], null, 2));
        }

        // Clean and populate orders with error handling
        const cleanedOrders = [];
        
        for (const order of basicOrders) {
            try {
                // Clean items - remove invalid product references
                const cleanItems = [];
                if (order.items && Array.isArray(order.items)) {
                    for (const item of order.items) {
                        if (item && item.product) {
                            // Try to get product details
                            try {
                                const product = await Product.findById(item.product).lean();
                                if (product) {
                                    cleanItems.push({
                                        ...item,
                                        product: {
                                            _id: product._id,
                                            name: product.name || 'Unnamed Product',
                                            price: product.price || 0,
                                            offerPrice: product.offerPrice || 0,
                                            image: product.image || []
                                        }
                                    });
                                } else {
                                    // Product not found, add placeholder
                                    cleanItems.push({
                                        ...item,
                                        product: {
                                            _id: item.product,
                                            name: 'Product Not Found',
                                            price: 0,
                                            offerPrice: 0,
                                            image: []
                                        }
                                    });
                                }
                            } catch (productError) {
                                console.error('Product lookup error:', productError);
                                // Add placeholder for invalid product
                                cleanItems.push({
                                    ...item,
                                    product: {
                                        _id: item.product,
                                        name: 'Invalid Product',
                                        price: 0,
                                        offerPrice: 0,
                                        image: []
                                    }
                                });
                            }
                        }
                    }
                }

                // Clean address
                let cleanAddress = {
                    fullName: 'Address Not Found',
                    phoneNumber: 'N/A',
                    pinCode: 'N/A',
                    area: 'N/A',
                    city: 'N/A',
                    state: 'N/A'
                };

                if (order.address) {
                    try {
                        const address = await Address.findById(order.address).lean();
                        if (address) {
                            cleanAddress = {
                                fullName: address.fullName || 'N/A',
                                phoneNumber: address.phoneNumber || 'N/A',
                                pinCode: address.pinCode || 'N/A',
                                area: address.area || 'N/A',
                                city: address.city || 'N/A',
                                state: address.state || 'N/A'
                            };
                        }
                    } catch (addressError) {
                        console.error('Address lookup error:', addressError);
                    }
                }

                // Create clean order
                const cleanOrder = {
                    ...order,
                    items: cleanItems,
                    address: cleanAddress
                };

                cleanedOrders.push(cleanOrder);
                
            } catch (orderError) {
                console.error('Error processing order:', orderError);
                // Add a basic version of the order if processing fails
                cleanedOrders.push({
                    ...order,
                    items: [],
                    address: {
                        fullName: 'Error Loading Address',
                        phoneNumber: 'N/A',
                        pinCode: 'N/A',
                        area: 'N/A',
                        city: 'N/A',
                        state: 'N/A'
                    }
                });
            }
        }

        console.log('Final cleaned orders:', cleanedOrders.length);

        return NextResponse.json({success:true, orders: cleanedOrders})
    } catch (error) {
        console.error("Seller orders error:", error)
        return NextResponse.json({success:false, message:error.message})
    }
}