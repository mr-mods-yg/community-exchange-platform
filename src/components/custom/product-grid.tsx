
import { MapPin, User as UserImage } from "lucide-react";
import Link from "next/link";
import { LocationInfo } from '@/types/locationInfo';
import { User } from '@/generated/prisma';
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

const ProductGrid = ({ products, viewMode, userId }: {
  products: Product[], viewMode: "grid" | "list", userId?: string
}) => {
  return (
    <div
      className={`grid gap-6 ${viewMode === "grid"
        ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "grid-cols-1"
        }`}
    >
      {products?.map((product) => (
        <div
          key={product.id}
          className={`
            group relative overflow-hidden rounded-2xl border border-gray-800/60 
            bg-gray-900/40 backdrop-blur-md transition-all duration-300
            hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1
            ${viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"}
          `}
        >
          {/* Image Section */}
          <div
            className={`
            relative overflow-hidden bg-gray-800
            ${viewMode === "list"
                ? "w-full sm:w-64 sm:shrink-0 aspect-video sm:aspect-auto"
                : "aspect-[4/3]"
              }
          `}
          >
            <Link href={"/product/" + product.id}>
              <img
                src={product.images[0].url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </Link>

            {/* Condition Badge (Overlay) */}
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center rounded-md border border-emerald-500/30 bg-black/60 px-2.5 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md">
                {product.condition}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col p-5">
            {/* Title & Price */}
            <Link href={"/product/" + product.id}>
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="line-clamp-2 text-xs md:text-base hover:underline font-bold text-white transition-colors group-hover:text-emerald-400">
                  {product.name}
                </h3>
                <span className="shrink-0 text-xs md:text-base font-bold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
                  {product.price}
                </span>
              </div>
            </Link>

            {/* Metadata (Location & Seller) */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center text-xs md:text-sm text-gray-400">
                <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                <span className="truncate">
                  {product.location.city}, {product.location.state}
                </span>
              </div>
              <div className="flex items-center text-xs md:text-sm text-gray-400">
                <UserImage className="mr-2 h-4 w-4 text-purple-400" />
                <span className="truncate">Listed by {product.user.name}</span>
              </div>
            </div>

            {/* Footer: Category & Action Button */}
            <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-800/50">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300 ring-1 ring-inset ring-purple-500/20">
                  {product.category}
                </span>
              </div>

              <Link
                href={product.userId == userId ? "#" : `/chat?product=${product.id}`}
                className={`
                  relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300
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
        </div>
      ))}
    </div>
  );
};

export default ProductGrid