"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem, Product } from "@/types";
import { PRODUCTS } from "@/lib/api/fixtures";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  artisanImpactHours: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Pre-seed with 3 items matching screenshot badge "3"
  const [items, setItems] = useState<CartItem[]>(() => [
    {
      id: "cart_item_1",
      productId: PRODUCTS[0].id,
      product: PRODUCTS[0],
      quantity: 1,
    },
    {
      id: "cart_item_2",
      productId: PRODUCTS[2].id,
      product: PRODUCTS[2],
      quantity: 1,
    },
    {
      id: "cart_item_3",
      productId: PRODUCTS[7].id,
      product: PRODUCTS[7],
      quantity: 1,
    },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kaarigar_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("kaarigar_cart", JSON.stringify(newItems));
    } catch {}
  };

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            productId: product.id,
            product,
            quantity,
          },
        ];
      }
      try {
        localStorage.setItem("kaarigar_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== itemId);
      try {
        localStorage.setItem("kaarigar_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      try {
        localStorage.setItem("kaarigar_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearCart = () => {
    saveItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = subtotal > 2000 ? 250 : 0;
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  // Generous calculation: each ₹500 supports ~4 hours of artisan living wage
  const artisanImpactHours = Math.round((subtotal / 500) * 4);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shipping,
        total,
        artisanImpactHours,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
