/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, IndianRupee, MapPin, Package, Camera } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import useLocation from "@/store/location-store";
import { useParams, useRouter } from "next/navigation";

enum Condition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  USED = "USED",
  REPAIRED = "REPAIRED",
}

const conditionReverseMap: Record<Condition, string> = {
  NEW: "Brand New",
  LIKE_NEW: "Like New",
  USED: "Used",
  REPAIRED: "Repaired",
};

const conditionMapping: Record<string, Condition> = {
  "Brand New": Condition.NEW,
  "Like New": Condition.LIKE_NEW,
  "Used": Condition.USED,
  "Repaired": Condition.REPAIRED,
};

export default function EditProductPage() {
  const router = useRouter();
  const { id: productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [images, setImages] = useState<string[]>([]); // existing images only, no updates

  const { locationInfo } = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    locationCoords: "",
    location: {
      amenity: "",
      road: "",
      city: "",
      county: "",
      state_district: "",
      state: "",
      "ISO3166-2-lvl4": "",
      postcode: "",
      country: "",
      country_code: "",
    },
  });

  // 1. Load existing product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`/api/product/${productId}`);
        const product = res.data.product;

        setFormData({
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category, // already uppercase
          condition: conditionReverseMap[product.condition as Condition], // convert enum → human string
          locationCoords: product.locationCoords,
          location: product.location ?? formData.location,
        });

        setImages(product.images.map((img: { url: string }) => img.url)); // preview only
      } catch {
        toast.error("Failed to load product");
      }
      setLoading(false);
    }

    fetchProduct();
  }, [productId]);

  // keep location unchanged
  useEffect(() => {
    if (locationInfo) {
      setFormData((p) => ({ ...p, location: locationInfo }));
    }
  }, [locationInfo]);

  const categories = [
    'Electronics', 'Fashion', 'Furniture', 'Books', 'Sports', 'Music',
    'Home & Garden', 'Toys', 'Automotive', 'Art & Crafts', 'Other'
  ];

  const conditions = ["Brand New", "Like New", "Used", "Repaired"];

  const handleInputChange = (e: any) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // 2. Submit patch update
  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.patch(`/api/product/update/${productId}`, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category.toUpperCase(),
        condition: conditionMapping[formData.condition],
        location: formData.location,
      });

      toast.success("Product updated successfully");
      router.push(`/product/${productId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Update failed");
      console.error("Update error:", error);
    }

    setSubmitting(false);
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>

          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-emerald-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TradeHub
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent text-center">
          Edit Product
        </h1>

        <p className="text-center text-gray-300 mb-10">
          Update your product details below
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Existing Images - Not Editable */}
          <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Camera className="text-emerald-400" /> Existing Images
            </h2>

            {images.length === 0 ? (
              <p className="text-gray-500">No images found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, i) => (
                  <img
                    key={i}
                    alt={formData.name+" image"}
                    src={image}
                    className="w-full h-24 object-cover rounded-xl border border-gray-800"
                  />
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">
              Images cannot be changed during update.
            </p>
          </div>

          {/* Product Fields */}
          <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Package className="text-cyan-400" /> Product Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-emerald-400"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm mb-2">Price *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    required
                    min={0}
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-10 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-emerald-400"
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm mb-2">Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-emerald-400"
                >
                  {conditions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    disabled
                    value={
                      formData.location.city
                        ? `${formData.location.city}, ${formData.location.state} ${formData.location.postcode}`
                        : "Fetching location..."
                    }
                    className="w-full pl-10 py-3 bg-gray-800/50 border border-gray-800 rounded-xl text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm mb-2">Description *</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 px-12 py-4 rounded-xl font-medium hover:scale-105 transition-all"
            >
              {submitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
