"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { formatINR } from "@/lib/utilities/cn";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    artisanImpactHours,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "HERITAGE" || promoCode.trim().toUpperCase() === "KAARIGAR") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try using code 'HERITAGE'");
    }
  };

  const finalDiscount = promoApplied ? discount + 150 : discount;
  const finalTotal = Math.max(0, subtotal - finalDiscount + shipping);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F1] border border-[#E8E0D5] text-[#76513B] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
          Your Handcraft Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#777066] max-w-sm mx-auto">
          Discover meaningful handmade crafts from master potters, weavers, and carvers across India.
        </p>
        <div className="pt-2">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] shadow-sm"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#29251F]">
            Your Shopping Bag
          </h1>
          <p className="text-xs text-[#777066] mt-0.5">
            {itemCount} handcrafted item{itemCount === 1 ? "" : "s"} ready for dispatch.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline"
        >
          Clear Bag
        </button>
      </div>

      {/* Social Impact Meter Banner */}
      <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E0D7C9] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#76513B] text-white flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#FAF7F1]" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-[#29251F] block">
            Direct Artisan Impact Guarantee
          </span>
          <span className="text-[#777066]">
            This purchase directly finances approximately{" "}
            <strong className="text-[#76513B]">{artisanImpactHours} hours</strong> of dignified living-wage craft labor in rural artisan clusters.
          </span>
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E8E0D5] p-4 flex gap-4 items-center shadow-sm"
            >
              {/* Product Thumbnail */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#FAF7F1] border border-[#E8E0D5] shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-semibold text-sm text-[#29251F] hover:text-[#76513B] line-clamp-1"
                >
                  {item.product.title}
                </Link>
                <p className="text-xs text-[#777066]">
                  Artisan: <span className="text-[#29251F] font-medium">{item.product.artisan.name}</span> ({item.product.artisan.location})
                </p>
                <div className="font-bold text-sm text-[#29251F]">
                  {formatINR(item.product.price)}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-[#E8E0D5] rounded-full bg-[#FAF7F1] px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="text-xs font-bold text-[#777066] hover:text-[#29251F] px-1.5"
                >
                  -
                </button>
                <span className="text-xs font-bold px-2 text-[#29251F]">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-xs font-bold text-[#777066] hover:text-[#29251F] px-1.5"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right hidden sm:block min-w-20">
                <div className="font-bold text-sm text-[#29251F]">
                  {formatINR(item.product.price * item.quantity)}
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 text-[#777066] hover:text-red-600 transition-colors"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#76513B] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping for Crafts</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#29251F] pb-3 border-b border-[#F0EBE1]">
              Order Summary
            </h3>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#777066]">
                <span>Items Subtotal</span>
                <span className="text-[#29251F] font-medium">{formatINR(subtotal)}</span>
              </div>

              {finalDiscount > 0 && (
                <div className="flex justify-between text-[#436A31]">
                  <span>Craft Heritage Discount</span>
                  <span>- {formatINR(finalDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#777066]">
                <span>Doorstep Insured Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[#436A31] font-semibold">FREE</span>
                  ) : (
                    formatINR(shipping)
                  )}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-3 border-t border-[#F0EBE1] space-y-1.5">
              <label className="text-[11px] font-semibold text-[#777066] block">
                Have a Cultural Promotion Code?
              </label>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777066]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try 'HERITAGE'"
                    className="w-full pl-8 pr-2 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl uppercase placeholder:normal-case focus:outline-none focus:border-[#76513B]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#FAF7F1] border border-[#E8E0D5] text-xs font-semibold text-[#76513B] hover:bg-[#EFE9DF]"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-[11px] text-[#436A31]">✓ Extra ₹150 artisan discount applied!</p>
              )}
              {promoError && (
                <p className="text-[11px] text-red-600">{promoError}</p>
              )}
            </form>

            {/* Grand Total */}
            <div className="pt-3 border-t border-[#F0EBE1] flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-[#29251F] block">Total Amount</span>
                <span className="text-[10px] text-[#777066]">Includes GST & Insurance</span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#29251F]">
                {formatINR(finalTotal)}
              </span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-full bg-[#76513B] text-white text-center text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] transition-colors flex items-center justify-center gap-2 shadow-md block"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#78816A] text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>256-Bit Bank Grade Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
