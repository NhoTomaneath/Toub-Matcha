'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/public/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const MyOrders = () => {

    const { currency , getToken, user} = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = await getToken()
            const {data} = await axios.get('/api/order/list', {headers: {Authorization: `Bearer ${token}`}})

            if(data.success){
                setOrders(data.orders.reverse())
                setLoading(false)
            }else{
                toast.error(data.message)
                setLoading(false)
            }
        } catch (error) {
            console.error("Fetch orders error:", error)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message || "Failed to fetch orders")
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user){
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (
                        <div className="max-w-5xl border-t border-gray-300 text-sm">
                            {orders.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 text-lg">No orders found</p>
                                    <p className="text-gray-400">You haven't placed any orders yet.</p>
                                </div>
                            ) : (
                                orders.map((order, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />
                                    <p className="flex flex-col gap-3">
                                        <span className="font-medium text-base">
                                            {order.items && order.items.length > 0 
                                                ? order.items.map((item) => 
                                                    `${item.product?.name || 'Product Not Found'} x ${item.quantity || 0}`
                                                ).join(", ")
                                                : 'No items found'
                                            }
                                        </span>
                                        <span>Items : {order.items ? order.items.length : 0}</span>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-medium">{order.address?.fullName || 'Address Not Found'}</span>
                                        <br />
                                        <span>{order.address?.area || 'N/A'}</span>
                                        <br />
                                        <span>{`${order.address?.city || 'N/A'}, ${order.address?.state || 'N/A'}`}</span>
                                        <br />
                                        <span>{order.address?.phoneNumber || 'N/A'}</span>
                                    </p>
                                </div>
                                <p className="font-medium my-auto">{currency}{order.amount || 0}</p>
                                <div>
                                    <p className="flex flex-col">
                                        <span>Method : COD</span>
                                        <span>Date : {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                                        <span>Payment : Pending</span>
                                    </p>
                                </div>
                            </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;