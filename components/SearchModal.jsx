'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/public/assets/assets';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';

const SearchModal = ({ isOpen, onClose }) => {
    const { router, currency } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchInputRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const performSearch = async (query) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/product/search?q=${encodeURIComponent(query)}`);
            
            if (data.success) {
                setSearchResults(data.products);
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

    const handleProductClick = (productId) => {
        router.push(`/product/${productId}`);
        onClose();
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleViewAllResults = () => {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        onClose();
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Search Products</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Image
                                src={assets.search_icon}
                                alt="search"
                                className="w-5 h-5 text-gray-400"
                            />
                        </div>
                        {loading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto max-h-96">
                    {searchQuery.trim() === '' ? (
                        <div className="p-8 text-center text-gray-500">
                            <Image
                                src={assets.search_icon}
                                alt="search"
                                className="w-12 h-12 mx-auto mb-4 opacity-50"
                            />
                            <p>Start typing to search for products</p>
                        </div>
                    ) : searchResults.length === 0 && !loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No products found for "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {searchResults.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => handleProductClick(product._id)}
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={product.imageURL || assets.box_icon}
                                                alt={product.name}
                                                width={60}
                                                height={60}
                                                className="w-15 h-15 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {product.description}
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">
                                                {currency}{product.offerPrice}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    {searchResults.length > 0 && (
                        <div className="flex justify-center mb-2">
                            <button
                                onClick={handleViewAllResults}
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                View All {searchResults.length} Results
                            </button>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 text-center">
                        Press ESC to close • Click on a product to view details
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
