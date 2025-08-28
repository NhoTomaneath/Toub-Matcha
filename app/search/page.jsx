'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/public/assets/assets';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { currency } = useAppContext();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('relevance');
    const [priceRange, setPriceRange] = useState('all');

    useEffect(() => {
        if (query) {
            performSearch();
        } else {
            setLoading(false);
        }
    }, [query, currentPage, sortBy, priceRange]);

    const performSearch = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                q: query,
                page: currentPage,
                sort: sortBy,
                price: priceRange
            });

            const { data } = await axios.get(`/api/product/search?${params}`);
            
            if (data.success) {
                setProducts(data.products);
                setTotalResults(data.total || data.products.length);
            } else {
                toast.error(data.message || 'Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (newRange) => {
        setPriceRange(newRange);
        setCurrentPage(1);
    };

    if (!query) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Image
                            src={assets.search_icon}
                            alt="search"
                            className="w-16 h-16 mx-auto mb-4 opacity-50"
                        />
                        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Search Products</h1>
                        <p className="text-gray-500">Enter a search term to find products</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Search Results for "{query}"
                        </h1>
                        <p className="text-gray-600">
                            {totalResults} {totalResults === 1 ? 'product' : 'products'} found
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                                
                                {/* Sort By */}
                                <div className="mb-6">
                                    <h4 className="font-medium mb-2">Sort By</h4>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name">Name: A to Z</option>
                                        <option value="name-desc">Name: Z to A</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="font-medium mb-2">Price Range</h4>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => handlePriceRangeChange(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Prices</option>
                                        <option value="0-10">Under $10</option>
                                        <option value="10-25">$10 - $25</option>
                                        <option value="25-50">$25 - $50</option>
                                        <option value="50-100">$50 - $100</option>
                                        <option value="100+">Over $100</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loading />
                                </div>
                            ) : products.length === 0 ? (
                                <div className="bg-white rounded-lg shadow p-12 text-center">
                                    <Image
                                        src={assets.search_icon}
                                        alt="search"
                                        className="w-16 h-16 mx-auto mb-4 opacity-50"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        We couldn't find any products matching "{query}"
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Try adjusting your search terms or filters
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Products Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalResults > 10 && (
                                        <div className="mt-8 flex justify-center">
                                            <nav className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <span className="px-3 py-2 text-sm text-gray-700">
                                                    Page {currentPage} of {Math.ceil(totalResults / 10)}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage >= Math.ceil(totalResults / 10)}
                                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SearchPage;
