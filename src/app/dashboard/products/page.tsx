"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Sparkles, Edit3, Eye, Trash2 } from "lucide-react";
import { api } from "@/lib/api/client";
import { Product } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ limit: 50 }).then((res) => {
      setProducts(res.items);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header with Add Product CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Product Catalog Inventory
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Manage your workshop&apos;s active listings, stock availability, and prices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/ai-catalogue"
            className="px-4 py-2 rounded-full bg-[#EFE9DF] text-[#76513B] text-xs font-semibold hover:bg-[#E0D7C9] flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Fast List</span>
          </Link>
          <Link
            href="/dashboard/products/new"
            className="px-4 py-2 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Add</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#777066]">Loading listings...</div>
      ) : products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E0D5] text-[#777066] uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-bold">Craft Piece</th>
                <th className="pb-3 font-bold">Category</th>
                <th className="pb-3 font-bold">Price</th>
                <th className="pb-3 font-bold">Stock</th>
                <th className="pb-3 font-bold">Rating</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F1] transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-[#FAF7F1] border border-[#E8E0D5] shrink-0">
                        <Image src={p.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[#29251F] block truncate max-w-xs">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-[#777066] truncate block">
                          {p.craftTechnique}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 capitalize text-[#777066]">{p.category}</td>
                  <td className="py-3.5 font-bold text-[#29251F]">{formatINR(p.price)}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stockCount > 5
                          ? "bg-[#E5F0DF] text-[#436A31]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stockCount} units
                    </span>
                  </td>
                  <td className="py-3.5 text-[#29251F]">
                    ★ {p.rating} ({p.reviewsCount})
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/product/${p.slug}`}
                        className="p-1.5 rounded-lg text-[#777066] hover:text-[#76513B] hover:bg-white"
                        title="View Public PDP"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#777066]">
          No products listed yet. Click &ldquo;AI Fast List&rdquo; to add your first craft!
        </div>
      )}
    </div>
  );
}
