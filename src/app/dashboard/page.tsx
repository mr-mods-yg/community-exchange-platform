"use client";
import React, { useEffect, useState } from 'react';
import { MapPin, Search, Grid3x3 as Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { LocationInfo } from '@/types/locationInfo';
import { useSession } from 'next-auth/react';
import { User } from '@/generated/prisma';
import ProductGrid from '@/components/custom/product-grid';
import useLocation from '@/store/location-store';
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
  const { location, locationInfo, setLocation, setLocationInfo } = useLocation();
  const session = useSession();
  const userId = session.data?.user.id;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [locationFilter, setLocationFilter] = useState<'city' | 'state_district' | 'state'>('city');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (location) {
      return;
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          alert("⚠️ Please allow location access to see products near you.");
          console.error("Error getting location:", err);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, [location, locationInfo, setLocation]);

  useEffect(() => {
    if(locationInfo){
      return;
    }
    if (location) {
      axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json`)
        .then((res) => {
          setLocationInfo(res.data.address);
        })
    }
  }, [location,locationInfo, setLocationInfo]);

  useEffect(() => {
    if (!locationInfo) return;
    setLoadingProducts(true);
    console.log("loading start");
    if (locationFilter == "city") {
      axios.get("/api/products/filter?city=" + locationInfo.city).then((res) => setProducts(res.data))
    }
    else if (locationFilter == "state_district") {
      axios.get("/api/products/filter?state_district=" + locationInfo.state_district).then((res) => setProducts(res.data))
    }
    if (locationFilter == "state") {
      axios.get("/api/products/filter?state=" + locationInfo.state).then((res) => setProducts(res.data))
    }

    setLoadingProducts(false);

  }, [locationInfo, locationFilter])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Navbar/>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="md:hidden flex items-center space-x-2 text-gray-300 mb-2">
            <MapPin className="h-5 w-5 text-emerald-400" />
            {locationInfo ? <span>{locationInfo?.city}, {locationInfo?.state}</span> : <span>Fetching Location</span>}
          </div>
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

          {/* Location Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-gray-300">Filter by:</span>
            </div>

            <div className="flex bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-1 w-fit">
              <button
                onClick={() => setLocationFilter('city')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${locationFilter === 'city'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                City
              </button>
              <button
                onClick={() => setLocationFilter('state_district')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${locationFilter === 'state_district'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                State-District
              </button>
              <button
                onClick={() => setLocationFilter('state')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${locationFilter === 'state'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                State
              </button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm border ${locationFilter === 'city'
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 text-emerald-300'
              : locationFilter === 'state_district'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-300'
                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300'
              }`}>
              Filtering by: {locationFilter === 'state_district' ? 'State-District' : locationFilter.charAt(0).toUpperCase() + locationFilter.slice(1)}
            </span>
          </div>
        </div>

        <div className='px-2'>{loadingProducts ? "Loading Products..." : products.length === 0 ? "No Products found!" : ""}</div>

        {/* Products Grid */}
        <ProductGrid products={products} viewMode={viewMode} userId={userId} />

        {/*
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-gray-700 hover:border-emerald-500/50 px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105">
            Load More Products
          </button>
        </div> */}
      </div>
    </div>
  );
};


export default Dashboard;
