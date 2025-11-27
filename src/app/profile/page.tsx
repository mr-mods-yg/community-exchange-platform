"use client";

import Image from "next/image";
import { User, MapPin, Calendar, Package, Edit, Trash, GlobeLock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import SpinnerLoading from "@/components/custom/spinner-loading";
import Link from "next/link";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    products: Product[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    status: string;
    category: string;
    condition: string;
    userId: string;
    locationCoords: string;
    createdAt: string;
    updatedAt: string;
    images: ProductImage[];
}

export interface ProductImage {
    id: string;
    url: string;
}

const formatShortMonthYear = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
    });
};

export default function ProfilePage() {
    const [user, setUser] = useState<User>();
    const [refresh, setRefresh] = useState(0);

    const refreshProfile = () => {
        setRefresh((n) => n + 1);
    }

    useEffect(() => {
        axios.get("/api/profile").then((res) => {
            setUser(res.data.user);
        })
    }, [refresh])
    if (!user) {
        return <SpinnerLoading />
    }
    return (<div className="mx-auto max-w-5xl pt-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
            {user.image && <Image
                src={user.image}
                width={150}
                height={150}
                alt="user avatar"
                className="rounded-full border border-gray-800"
            />}

            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-400">@{user.email}</p>

                {/* Location + Join Date */}
                <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 mt-3">
                    {/* <span className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-emerald-400" /> RETARDED
                    </span> */}
                    <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-purple-400" /> Joined {formatShortMonthYear(user.createdAt)}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mt-5">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-400">{user.products.length}</p>
                        <p className="text-sm text-gray-400">Listed</p>
                    </div>
                    {/* <div className="text-center">
                                <p className="text-2xl font-bold text-cyan-400">{user.stats.sold}</p>
                                <p className="text-sm text-gray-400">Sold</p>
                            </div> */}
                </div>

                {/* Bio */}
                {/* <p className="mt-5 max-w-md text-gray-300">{user.bio}</p> */}
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-10"></div>

        {/* Products Header */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Package className="h-6 w-6 text-emerald-400" /> Products Listed
            </h2>
            <span className="text-gray-400 text-sm">{user.products.length} items</span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
            {user.products.map(product => (
                <div
                    key={product.id}
                    className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900/40 hover:border-emerald-500/50 transition-all"
                >
                    <Link href={"/product/" + product.id}>
                        <Image
                            src={product.images[0].url}
                            width={400}
                            height={300}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                        />
                    </Link>

                    <div className="p-4">
                        <Link href={"/product/" + product.id}>
                            <h3 className="font-semibold text-sm line-clamp-2 hover:underline">{product.name}</h3>
                        </Link>
                        <p className="text-emerald-400 font-bold text-sm mt-1">{product.price}</p>

                        <div className="flex items-center justify-center gap-2 mt-3">
                            <span className="text-xs px-2 py-1 rounded-md bg-purple-500/20 text-purple-300">
                                {product.category}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-300">
                                {product.status.toUpperCase()}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300">
                                {product.condition}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center px-1 gap-1">
                        <Link className="size-fit" href={"/product/edit/" + product.id}>
                            <button

                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg`}
                            >
                                <Edit />
                            </button>
                        </Link>
                        <DeleteDialog productId={product.id} refreshProfile={refreshProfile} />
                    </div>
                </div>
            ))}
        </div>

    </div>
    );
}

function DeleteDialog({ productId, refreshProfile }: { productId: string, refreshProfile: () => void }) {
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg`}
                >
                    <Trash />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        product and remove all your chats of this product from both buyer and seller.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={submitting} onClick={async () => {
                        setSubmitting(true);
                        const res = await axios.delete("/api/product/" + productId);
                        if (res.data.success) {
                            toast.success("Product removed!");
                            refreshProfile();
                            setOpen(false);
                        }
                        setSubmitting(false);
                    }}>{submitting ? "Updating" : "Continue"}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
