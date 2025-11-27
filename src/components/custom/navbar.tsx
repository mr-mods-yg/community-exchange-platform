"use client"

import useLocation from '@/store/location-store';
import Link from 'next/link';
import { MapPin, Package, Plus, LogOut, LogIn, User as UserRound, MessageCircleIcon } from 'lucide-react';
import React from 'react'
import { useSession, signOut } from 'next-auth/react';
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
} from '@/components/ui/menubar'

function Navbar({isAdmin}: {isAdmin?: boolean}) {
    const { locationInfo } = useLocation();
    const session = useSession();

    return (
        <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Package className="h-8 w-8 text-emerald-400" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            TradeHub
                        </span>
                        {isAdmin && <span className="text-2xl font-bold text-red-500 bg-clip-text">
                            Admin
                        </span>}
                    </div>
                    <div className="flex items-center space-x-4">
                        {!isAdmin ? <div className='hidden md:block'>
                            <div className="flex items-center space-x-2 text-gray-300">
                                <MapPin className="h-5 w-5 text-emerald-400" />
                                {locationInfo ? <span>{locationInfo?.city}, {locationInfo?.state}</span> : <span>Fetching Location</span>}
                            </div>
                        </div> : <></>}

                        <Link
                            href={"/product/upload"}
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center sm:space-x-2"
                        >
                            <Plus size={20}/>
                            <span className='hidden sm:block'>List Product</span>
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
                                            <MenubarItem asChild>
                                                <Link className={"size-full"} href={"/profile"}>
                                                    <UserRound />
                                                    My Profile
                                                </Link>
                                            </MenubarItem>
                                            <MenubarItem asChild>
                                                <Link className={"size-full"} href={"/chat"}>
                                                    <MessageCircleIcon />
                                                    My Chats
                                                </Link>
                                            </MenubarItem>
                                            <MenubarSeparator />
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
                                                    <LogIn /> Login
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
    )
}

export default Navbar
