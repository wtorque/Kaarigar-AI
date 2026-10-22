"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/types";
import { PRODUCTS } from "@/lib/api/fixtures";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  // Pre-seed with one product
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => [PRODUCTS[1]]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kaarigar_wishlist");
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const updated = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      try {
        localStorage.setItem("kaarigar_wishlist", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    try {
      localStorage.setItem("kaarigar_wishlist", JSON.stringify([]));
    } catch {}
  };

  const wishlistIds = wishlistItems.map((p) => p.id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
