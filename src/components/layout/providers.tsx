"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/auth-context";
import { CartProvider } from "@/features/cart/cart-context";
import { WishlistProvider } from "@/features/wishlist/wishlist-context";
import { LocationProvider } from "@/components/layout/location-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <LocationProvider>{children}</LocationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
