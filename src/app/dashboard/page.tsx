"use client";
import React, { useEffect, useState } from 'react';
import { MapPin, Search, Package, Grid3x3 as Grid3X3, List, SlidersHorizontal, Plus, LogIn, UserRoundPlus, LogOut, UserRound } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { LocationInfo } from '@/types/locationInfo';
import { User } from '@/generated/prisma';
import { signOut, useSession } from 'next-auth/react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
  const session = useSession();
  const userId = session.data?.user.id;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [locationFilter, setLocationFilter] = useState<'city' | 'state_district' | 'state'>('city');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo>();
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (location) {
      axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json`)
        .then((res) => {
          setLocationInfo(res.data.address);
        })
    }
  }, [location]);

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
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                TradeHub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className='hidden md:block'>
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  {locationInfo ? <span>{locationInfo?.city}, {locationInfo?.state}</span> : <span>Fetching Location</span>}
                </div>
              </div>

              <Link
                href={"/product/upload"}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>List Product</span>
              </Link>

              <Menubar asChild>
                <MenubarMenu>
                  <MenubarTrigger className='p-0 m-0 bg-transparent border-0 shadow-none 
        hover:bg-transparent 
        focus:bg-transparent 
        focus-visible:bg-transparent 
        active:bg-transparent 
        data-[state=open]:bg-transparent'>

                    {session.data?.user?.image ? (
                      <img
                        src={session.data.user.image}
                        className="size-10 rounded-full border border-neutral-300 object-cover hover:border-2 hover:border-white active:border-2"
                        alt="User Avatar"
                      />
                    ) : (
                      <div className="size-10 rounded-full border border-neutral-300 bg-neutral-200 flex items-center justify-center text-sm font-bold">
                        {session.data?.user?.name?.[0]}
                      </div>
                    )}

                  </MenubarTrigger>

                  <MenubarContent className='bg-transparent/50 text-white backdrop-blur-2xl '>
                    {session && session.status === "authenticated" ? (
                      <>
                        {/* <MenubarItem asChild>
                          <Link className={"size-full"} href={"/profile"}>
                            <UserRound />
                            My Profile
                          </Link>
                        </MenubarItem>
                        <MenubarSeparator /> */}
                        <MenubarItem
                          variant={"destructive"}
                          onClick={() => signOut()}
                        >
                          <LogOut /> Logout
                        </MenubarItem>
                      </>
                    ) : (
                      <>
                        <MenubarItem asChild>
                          <Link className={"size-full"} href={"/login"}>
                            <LogIn />
                            Login
                          </Link>
                        </MenubarItem>

                      </>
                    )}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
        </div>
      </header>

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

                  {/* <span className="text-sm text-gray-300">{product.location}</span>
                  <span className="text-xs text-gray-500">• {product.distance}</span> */}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">by {product.user.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-2 py-1 rounded-full text-purple-300">
                    {product.category}
                  </span>
                  <Link href={product.userId == userId ? "#" : `/chat?product=${product.id}`} className={product.userId == userId ? "bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium" : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"}>
                    {product.userId == userId ? "Listed by you" : "Contact Seller"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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
