"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { useCart } from "@/features/cart/cart-context";
import { formatINR } from "@/lib/utilities/cn";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Saved Wishlist ({wishlistItems.length})
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Keep track of handcrafted treasures you plan to acquire.
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-red-600 hover:underline"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-[#FAF7F1] rounded-2xl border border-[#E8E0D5] overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-square relative w-full overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-red-600 shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-semibold text-xs sm:text-sm text-[#29251F] hover:text-[#76513B] line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  <p className="text-[11px] text-[#777066]">
                    By {product.artisan.name} • {product.artisan.location}
                  </p>
                  <div className="font-bold text-sm text-[#29251F] mt-1">
                    {formatINR(product.price)}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      addItem(product, 1);
                      toggleWishlist(product);
                    }}
                    className="w-full py-2 rounded-xl bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F1] text-[#76513B] mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#29251F]">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-[#777066] max-w-sm mx-auto">
            Explore our curated craft collections and bookmark your favorite pieces.
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-5 py-2 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A]"
          >
            Explore Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
