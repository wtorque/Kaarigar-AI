"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { useCart } from "@/features/cart/cart-context";
import { formatINR } from "@/lib/utilities/cn";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden shadow-sm hover:shadow-craft-hover transition-all duration-300 flex flex-col h-full">
      
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#FAF7F1] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top Badges: Out of stock or discount */}
        {!product.inStock && (
          <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full z-10">
            Out of Stock
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#29251F] hover:text-[#76513B] shadow-sm transition-all z-10"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? "fill-[#76513B] text-[#76513B]" : "stroke-[1.8]"
            }`}
          />
        </button>

        {/* Quick Add to Cart button on hover */}
        {product.inStock && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addItem(product, 1);
            }}
            className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-[#76513B] text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 shadow-md hover:bg-[#5E3E2A] z-10"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        
        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block group/link">
          <h3 className="text-xs sm:text-sm font-semibold text-[#29251F] group-hover/link:text-[#76513B] transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Price and Rating Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm sm:text-base text-[#29251F]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-[#9C9488] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#777066]">
            <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
            <span className="font-semibold text-[#29251F]">{product.rating}</span>
            <span>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Artisan Metadata Row */}
        <Link
          href={`/artisans/${product.artisan.slug}`}
          className="pt-2 border-t border-[#F0EBE1] flex items-center gap-2 group/artisan"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden bg-[#EFE9DF] shrink-0 border border-[#E8E0D5]">
            <Image
              src={product.artisan.avatar}
              alt={product.artisan.name}
              width={20}
              height={20}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-[11px] text-[#777066] truncate group-hover/artisan:text-[#76513B] transition-colors">
            <span className="font-medium text-[#29251F]">{product.artisan.name}</span>
            <span className="mx-1">•</span>
            <span>{product.artisan.location}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
