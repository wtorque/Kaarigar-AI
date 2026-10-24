"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Product } from "@/types";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { formatINR } from "@/lib/utilities/cn";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E7DED2] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      
      {/* Product Image Container (16:11 aspect ratio for compact editorial card) */}
      <div className="relative aspect-[16/11] w-full bg-[#FAF7F1] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/80 hover:bg-white text-[#29221C] hover:text-[#70472F] shadow-2xs backdrop-blur-2xs flex items-center justify-center transition-all z-10"
        >
          <Heart
            className={`w-3 h-3 ${
              isWishlisted ? "fill-[#70472F] text-[#70472F]" : "stroke-[1.8]"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-2 flex flex-col flex-1 justify-between gap-1">
        
        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-[10px] sm:text-[11px] font-semibold text-[#29221C] hover:text-[#70472F] transition-colors leading-tight tracking-tight truncate">
            {product.title}
          </h3>
        </Link>

        {/* Price and Rating Row */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#29221C]">
            {formatINR(product.price)}
          </span>

          {/* Rating */}
          <div className="flex items-center gap-0.5 text-[9px] text-[#82776C]">
            <Star className="w-2.5 h-2.5 fill-[#E6A044] text-[#E6A044]" />
            <span className="font-semibold text-[#29221C]">{product.rating}</span>
            <span>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Artisan Metadata Row */}
        <Link
          href={`/artisans/${product.artisan.slug}`}
          className="pt-1.5 border-t border-[#F0E8DC] flex items-center gap-1.5 group/artisan"
        >
          <div className="w-4 h-4 rounded-full overflow-hidden bg-[#FAF7F1] shrink-0 border border-[#E7DED2] relative">
            <Image
              src={product.artisan.avatar}
              alt={product.artisan.name}
              width={16}
              height={16}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-medium text-[#29221C] group-hover/artisan:text-[#70472F] transition-colors truncate leading-none">
              {product.artisan.name}
            </span>
            <span className="text-[8px] text-[#82776C] truncate leading-none mt-0.5">
              {product.artisan.location}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
