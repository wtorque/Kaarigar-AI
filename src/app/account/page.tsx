"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { api } from "@/lib/api/client";
import { Order } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] space-y-1">
          <span className="text-[11px] text-[#777066]">Total Orders</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {orders.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] space-y-1">
          <span className="text-[11px] text-[#777066]">Saved in Wishlist</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {wishlistItems.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] space-y-1">
          <span className="text-[11px] text-[#777066]">Artisan Hours Funded</span>
          <div className="font-serif text-2xl font-bold text-[#76513B]">
            ~48 hrs
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] space-y-1">
          <span className="text-[11px] text-[#777066]">Delivery Pincode</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {user?.address?.pincode || "462016"}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
          <h2 className="font-serif text-lg font-bold text-[#29251F]">
            Recent Craft Purchases
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-[#76513B] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 2).map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#29251F]">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#76513B]">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#777066]">
                    Ordered on {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {order.items.map((it) => (
                      <span key={it.id} className="text-xs text-[#29251F] font-medium">
                        {it.title} (×{it.quantity})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                  <span className="font-serif text-base font-bold text-[#29251F]">
                    {formatINR(order.total)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E8E0D5] text-xs font-semibold text-[#76513B] hover:bg-[#EFE9DF]"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#777066] py-4">No recent orders placed.</p>
        )}
      </div>

      {/* Saved Wishlist Preview */}
      {wishlistItems.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
            <h2 className="font-serif text-lg font-bold text-[#29251F]">
              Your Saved Crafts
            </h2>
            <Link
              href="/account/wishlist"
              className="text-xs font-semibold text-[#76513B] hover:underline"
            >
              Manage Wishlist ({wishlistItems.length})
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {wishlistItems.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="group p-3 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] block"
              >
                <div className="aspect-square rounded-xl overflow-hidden relative mb-2">
                  <Image src={item.images[0]} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="text-xs font-semibold text-[#29251F] truncate">{item.title}</h4>
                <span className="text-xs font-bold text-[#76513B]">{formatINR(item.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
