import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const page = parseInt(searchParams.get('page')) || 1;
        const sort = searchParams.get('sort') || 'relevance';
        const priceRange = searchParams.get('price') || 'all';
        const limit = 10;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return NextResponse.json({ success: true, products: [], total: 0 });
        }

        await connectDB();

        // Build search query
        const searchRegex = new RegExp(query, 'i');
        let searchQuery = {
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ]
        };

        // Add price range filter
        if (priceRange !== 'all') {
            const priceFilter = {};
            switch (priceRange) {
                case '0-10':
                    priceFilter.$lte = 10;
                    break;
                case '10-25':
                    priceFilter.$gte = 10;
                    priceFilter.$lte = 25;
                    break;
                case '25-50':
                    priceFilter.$gte = 25;
                    priceFilter.$lte = 50;
                    break;
                case '50-100':
                    priceFilter.$gte = 50;
                    priceFilter.$lte = 100;
                    break;
                case '100+':
                    priceFilter.$gte = 100;
                    break;
            }
            if (Object.keys(priceFilter).length > 0) {
                searchQuery.offerPrice = priceFilter;
            }
        }

        // Build sort object
        let sortObject = {};
        switch (sort) {
            case 'price-low':
                sortObject.offerPrice = 1;
                break;
            case 'price-high':
                sortObject.offerPrice = -1;
                break;
            case 'name':
                sortObject.name = 1;
                break;
            case 'name-desc':
                sortObject.name = -1;
                break;
            default:
                // For relevance, we'll use text score if available, otherwise by name
                sortObject.name = 1;
        }

        // Get total count for pagination
        const total = await Product.countDocuments(searchQuery);

        // Get products with pagination and sorting
        const products = await Product.find(searchQuery)
            .sort(sortObject)
            .skip(skip)
            .limit(limit);

        return NextResponse.json({ 
            success: true, 
            products,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
