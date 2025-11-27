"use client";

import { MapPin, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import SpinnerLoading from "@/components/custom/spinner-loading";
interface Image {
    id: string;
    url: string;
}
type Location = {
    city: string;
    state: string;
    postcode: string
}
type ProductResponse = {
    id: string;
    name: string;
    description: string;
    price: number;
    status: string;
    category: string;
    condition: string
    userId: string;
    locationCoords: string;
    location: Location
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        image: string;
    },
    images: Image[]
};

export default function ProductPage() {
    const params = useParams();
    const productId = params.id;
    const session = useSession();
    const userId = session.data?.user.id;
    const [product, setProduct] = useState<ProductResponse>();

    useEffect(() => {
        axios.get("/api/product/" + productId).then((res) => {
            setProduct(res.data.product);
        })
    }, [productId])

    // const product = {
    //     id: "123",
    //     name: "Apple iPhone 14 Pro (Space Black)",
    //     price: "₹72,000",
    //     condition: "Like New",
    //     category: "Electronics",
    //     location: {
    //         city: "Dehradun",
    //         state: "Uttarakhand",
    //     },
    //     seller: {
    //         name: "Yash Garg",
    //         phone: "9876543210",
    //         avatar:
    //             "https://placehold.co/150",
    //     },
    //     images: [
    //         "https://placehold.co/1200x800",
    //         "https://placehold.co/1200x800",
    //         "https://placehold.co/1200x800",
    //     ],
    //     description:
    //         "Selling my iPhone 14 Pro (Space Black). 128GB storage, no scratches, 100% working condition. Battery health at 92%. Comes with original box and cable. Purchased in 2023.",
    // };
    if (!product) {
        return <div className="mx-auto max-w-6xl px-4 py-10">
            <SpinnerLoading/>
        </div>
    }
    return (

        <div className="mx-auto max-w-6xl px-4 py-10">

            {/* Breadcrumb */}
            <div className="mb-6 text-sm md:text-base text-gray-400">
                <Link href={"/dashboard"}>
                    <span className="hover:text-white cursor-pointer hover:underline flex gap-1 items-center">
                        <ArrowLeft size={20} />Go Back to Dashboard
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Left Side - Image Gallery */}
                {product.images && <div>
                    <div className="overflow-hidden rounded-2xl border border-gray-800">
                        <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={800}
                            height={600}
                            unoptimized
                            className="w-full rounded-2xl object-cover"
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {product.images.splice(1).map((img) => (
                            <Image
                                key={img.id}
                                src={img.url}
                                alt="product image"
                                width={200}
                                height={200}
                                unoptimized
                                className="h-24 w-full rounded-xl object-cover border border-gray-800 hover:border-emerald-500 cursor-pointer"
                            />
                        ))}
                    </div>
                </div>}

                {/* Right Side - Content */}
                <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-emerald-400 text-xl font-bold">
                            {product.price} INR
                        </span>

                        <span className="text-xs rounded-lg border border-emerald-500/30 text-emerald-300 px-3 py-1 bg-emerald-500/10">
                            {product.condition}
                        </span>
                        <span className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                            {product.category}
                        </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-400 mb-6">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                        {product.location.city}, {product.location.state}, {product.location.postcode}
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Description</h2>
                        <p className="text-gray-300 leading-relaxed">{product.description}</p>
                    </div>


                    {/* Seller Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800 mb-6">
                        <Image
                            src={product.user.image}
                            alt={product.user.name}
                            width={60}
                            height={60}
                            unoptimized
                            className="rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-white">{product.user.name}</p>
                            <p className="text-gray-400 text-sm">Verified Seller</p>
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    <Link
                        href={product.userId == userId ? "#" : `/chat?product=${product.id}`}
                        className={`
                  relative overflow-hidden rounded-lg px-4 py-2 text-lg text-center font-semibold transition-all duration-300
                  ${product.userId == userId
                                ? "bg-gray-800 text-gray-400 cursor-default"
                                : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
                            }
                `}
                    >
                        {product.userId == userId ? "Your Listing" : "Contact Seller"}
                    </Link>


                </div>
            </div>
            <hr className="mt-8 border-gray-800" />
            {/* Extra Separator */}
            {/* <div className="mt-16 border-t border-gray-800 pt-10">
                    <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
                    <p className="text-gray-500 text-sm">Coming soon…</p>
                </div> */}
        </div>
    );
}
