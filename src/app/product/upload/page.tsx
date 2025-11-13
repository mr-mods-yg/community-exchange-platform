"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Upload, MapPin, Package, Tag, Camera, X, IndianRupee } from 'lucide-react';
import { LocationInfo } from '@/types/locationInfo';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

enum Condition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  USED = "USED",
  REPAIRED = "REPAIRED",
}

const conditionMapping: Record<string, Condition> = {
  "Brand New": Condition.NEW,
  "Like New": Condition.LIKE_NEW,
  "Used": Condition.USED,
  "Repaired": Condition.REPAIRED,
};

const UploadProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    locationCoords: '',
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
    }
  });

  const [images, setImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo>();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          setFormData((prev) => ({ ...prev, locationCoords: pos.coords.latitude + ";" + pos.coords.longitude }))
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
  }, [location])

  useEffect(() => {
    if (locationInfo) setFormData((prev) => ({ ...prev, location: locationInfo }))
  }, [locationInfo])

  const categories = [
    'Electronics', 'Fashion', 'Furniture', 'Books', 'Sports', 'Music',
    'Home & Garden', 'Toys', 'Automotive', 'Art & Crafts', 'Other'
  ];

  const conditions = [
    'Brand New', 'Like New', 'Used', 'Repaired'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInfo) {
      toast.error("Please wait for location to be fetched!");
      return;
    }
    try {
      const res = await axios.post("/api/product/upload", {
        ...formData,
        price: Number(formData.price),
        images,   // base64 images
        location: locationInfo,
        category: formData.category.toUpperCase(),
        condition: conditionMapping[formData.condition]
      });

      toast.success("Product created!");
      console.log("Created product:", res.data);

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        locationCoords: '',
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
        }
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={"/dashboard"}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                TradeHub
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              List Your Product
            </h1>
            <p className="text-xl text-gray-300">
              Share what you have with the community and start trading
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Camera className="h-6 w-6 text-emerald-400 mr-2" />
                Product Images
              </h2>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : 'border-gray-600 hover:border-gray-500'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop images here, or click to select</p>
                <p className="text-sm text-gray-500">Support for JPG, PNG files</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-6 py-2 rounded-lg font-medium cursor-pointer transition-all transform hover:scale-105"
                >
                  Choose Files
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Uploaded Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Package className="h-6 w-6 text-cyan-400 mr-2" />
                Product Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="1"
                      min="0"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 transition-all appearance-none"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 transition-all appearance-none"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      disabled
                      value={locationInfo ? locationInfo.city + ", " +locationInfo.state + ", " + locationInfo.postcode : "Fetching Location"}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all resize-none"
                  placeholder="Describe your product in detail..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-purple-600 px-12 py-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              >
                List Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;