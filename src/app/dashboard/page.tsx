"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  ArrowRight,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { formatINR } from "@/lib/utilities/cn";
import { Product, Order } from "@/types";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    totalSales: 84650,
    totalOrders: 42,
    activeListings: 18,
    artisanRating: 4.8,
    pendingFulfillment: 3,
    fairLivingHoursLogged: 320,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getArtisanDashboardStats().then(setStats);
    api.getOrders().then(setRecentOrders);
    api.getProducts().then((res) => setProducts(res.items));
  }, []);

  const lowStockItems = products.filter((p) => p.stockCount <= 8);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-[#3B281E] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C28E46]">
            Artisan Studio Hub
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Welcome to Your Digital Workshop
          </h1>
          <p className="text-xs text-[#E2D5C7] leading-relaxed">
            Your generational crafts are currently visible to thousands of design patrons across India. Use the AI Studio to catalogue new creations in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/ai-catalogue"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F1] text-[#29251F] text-xs font-semibold hover:bg-white transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#76513B]" />
              <span>Launch AI Catalogue Studio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Total Studio Sales</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {formatINR(stats.totalSales)}
          </div>
          <span className="text-[10px] text-[#436A31] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Orders Fulfilled</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {stats.totalOrders}
          </div>
          <span className="text-[10px] text-[#76513B] font-medium">
            {stats.pendingFulfillment} pending dispatch
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Active Catalog Listings</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {stats.activeListings}
          </div>
          <span className="text-[10px] text-[#78816A] font-medium">
            Across 4 categories
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Living Wage Hours Logged</span>
          <div className="font-serif text-2xl font-bold text-[#76513B]">
            {stats.fairLivingHoursLogged} hrs
          </div>
          <span className="text-[10px] text-[#436A31] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Fair Living Wage
          </span>
        </div>
      </div>

      {/* Grid: Pending Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pending Orders awaiting fulfillment */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#76513B]" />
              <h2 className="font-serif text-base font-bold text-[#29251F]">
                Orders Awaiting Workshop Packing
              </h2>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-[#76513B] hover:underline"
            >
              View All ({recentOrders.length})
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#29251F] block">{ord.orderNumber}</span>
                  <span className="text-[11px] text-[#777066]">
                    {ord.items.length} item{ord.items.length === 1 ? "" : "s"} • Ship to {ord.shippingAddress.city}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#29251F] block">{formatINR(ord.total)}</span>
                  <span className="text-[10px] uppercase font-bold text-[#76513B]">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="font-serif text-base font-bold text-[#29251F]">
                Stock Attention
              </h2>
            </div>
            <Link
              href="/dashboard/inventory"
              className="text-xs font-semibold text-[#76513B] hover:underline"
            >
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex items-center gap-3 text-xs"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-white border border-[#E8E0D5] shrink-0">
                  <Image src={item.images[0]} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-[#29251F] truncate block">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Only {item.stockCount} left in workshop
                  </span>
                </div>
                <span className="font-bold text-[#29251F]">{formatINR(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
