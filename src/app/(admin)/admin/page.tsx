"use client";
import React, { useEffect, useState } from 'react';
import { MapPin, Search, Package, Grid3x3 as Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { LocationInfo, User } from '@/generated/prisma';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SpinnerLoading from '@/components/custom/spinner-loading';
import Navbar from '@/components/custom/navbar';

interface Image {
    id: string;
    url: string;
}
interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    status: string;
    category: string;
    condition: string;
    userId: string;
    locationCoords: string;
    createdAt: string;
    updatedAt: string;
    images: Image[]
    user: User
    location: LocationInfo
}

const Dashboard: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [statusFilter, setStatusFilter] = useState<'unreviewed' | 'allowed' | 'blocked' | 'onhold'>('unreviewed');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasCheckedAdmin, setHasCheckedAdmin] = useState(false);
    const [products, setProducts] = useState<Product[]>();
    // 0 - doing nothing , 1 - setting allowed, 2 - setting blocked, 3 - setting onhold
    const [updatingStatus, setUpdatingStatus] = useState(0);

    useEffect(() => {
        axios.get("/api/check/admin").then((res) => {
            if (res.data.success) setIsAdmin(res.data.isAdmin);
            setHasCheckedAdmin(true);
        })
    }, [])

    useEffect(() => {
        if (!isAdmin) return;
        axios.get(`api/admin/products/fetch/${statusFilter}`).then((res) => {
            if (res.data.success) setProducts(res.data.products);
        })
    }, [isAdmin,statusFilter])


    if (hasCheckedAdmin && !isAdmin) {
        return <div className="min-h-screen bg-black text-white">You do not have the required permission</div>
    } else if (!isAdmin) {
        return <div className="min-h-screen bg-black text-white"><SpinnerLoading text='Checking your account'/></div>
    }
    const updateStatus = async (status: string, productId: string) => {
        const res = await axios.post("/api/admin/product/update/" + productId, {
            status
        });
        if (res.data.success) {
            toast.success("Product status updated!");
            setUpdatingStatus(0);
            setProducts(products => products?.filter(p => p.id !== productId));
        }
    }
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <Navbar isAdmin={true}/>

            <div className="container mx-auto px-6 py-8">
                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">

                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Grid3X3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Status Filters */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
                            <span className="text-sm font-medium text-gray-300">Filter by Status:</span>
                        </div>

                        <div className="flex flex-wrap gap-2 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-1 w-fit">
                            <button
                                onClick={() => setStatusFilter('unreviewed')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'unreviewed'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Unreviewed
                            </button>
                            <button
                                onClick={() => setStatusFilter('allowed')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'allowed'
                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Allowed
                            </button>
                            <button
                                onClick={() => setStatusFilter('blocked')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'blocked'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Blocked
                            </button>
                            <button
                                onClick={() => setStatusFilter('onhold')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'onhold'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                On Hold
                            </button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm border ${statusFilter === 'unreviewed'
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300'
                            : statusFilter === 'allowed'
                                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 text-emerald-300'
                                : statusFilter === 'blocked'
                                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30 text-red-300'
                                    : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300'
                            }`}>
                            Current View: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Products Grid */}
                <div className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}>
                    {products?.map((product) => (
                        <div
                            key={product.id}
                            className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 hover:border-emerald-500/50 transition-all duration-300 group overflow-hidden ${viewMode === 'list' ? 'flex' : ''
                                }`}
                        >
                            <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                                <img
                                    src={product.images[0].url}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* <button className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/20 transition-all">
                                    <Heart className="h-4 w-4 text-white hover:text-red-400" />
                                </button> */}
                                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                                    <span className="text-xs text-emerald-400">{product.condition}</span>
                                </div>
                            </div>

                            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-lg text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                                        {product.name}
                                    </h3>
                                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        {product.price}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 mb-3">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">{product.location.city + ", " + product.location.state}</span>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-gray-400">by {product.user.name}</span>
                                </div>

                                <div className="flex flex-col items-center justify-between">
                                    <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-2 py-1 rounded-full text-purple-300">
                                        {product.category}
                                    </span>
                                    <span className='flex gap-2 mt-1'>
                                        <button disabled={updatingStatus === 1} onClick={() => { setUpdatingStatus(1); updateStatus("allowed", product.id) }} className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">
                                            {updatingStatus === 1 ? "Updating" : "Approve"}
                                        </button>
                                        <button disabled={updatingStatus === 2} onClick={() => { setUpdatingStatus(2); updateStatus("blocked", product.id) }} className="bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">
                                            {updatingStatus === 2 ? "Updating" : "Reject"}
                                        </button>
                                        <button disabled={updatingStatus === 3} onClick={() => { setUpdatingStatus(3); updateStatus("onhold", product.id) }} className="bg-yellow-600 px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">
                                            {updatingStatus === 2 ? "Updating" : "Hold"}
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {/* <div className="text-center mt-12">
                    <button className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-gray-700 hover:border-emerald-500/50 px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105">
                        Load More Products
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;