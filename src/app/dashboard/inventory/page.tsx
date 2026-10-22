"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Boxes, AlertTriangle, Plus, Check } from "lucide-react";
import { api } from "@/lib/api/client";
import { Product } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function DashboardInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    api.getProducts({ limit: 50 }).then((res) => setProducts(res.items));
  }, []);

  const handleStockChange = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockCount: Math.max(0, p.stockCount + delta) } : p
      )
    );
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Inventory Health & Restocking
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Monitor workshop physical stock and trigger batch updates.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F1] border border-[#E8E0D5] text-[#76513B]">
          {products.length} Tracked SKUs
        </span>
      </div>

      <div className="space-y-3">
        {products.map((p) => {
          const isLow = p.stockCount <= 8;
          return (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-white border border-[#E8E0D5] shrink-0">
                  <Image src={p.images[0]} alt="" fill className="object-cover" />
                </div>
                <div>
                  <span className="font-bold text-[#29251F] block text-sm">
                    {p.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#777066] capitalize">{p.category}</span>
                    <span className="text-[11px] font-bold text-[#76513B]">{formatINR(p.price)}</span>
                    {isLow && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="flex items-center border border-[#E8E0D5] rounded-full bg-white px-2 py-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => handleStockChange(p.id, -1)}
                    className="px-2 font-bold text-[#777066] hover:text-[#29251F]"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-xs text-[#29251F]">
                    {p.stockCount} in stock
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStockChange(p.id, 1)}
                    className="px-2 font-bold text-[#777066] hover:text-[#29251F]"
                  >
                    +
                  </button>
                </div>

                {savedId === p.id && (
                  <span className="text-[10px] font-bold text-[#436A31] flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Updated
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
