"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Package, Check, X, Eye } from "lucide-react";
import { api } from "@/lib/api/client";
import { Product } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredMap, setFeaturedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.getProducts({ limit: 50 }).then((res) => {
      setProducts(res.items);
      const map: Record<string, boolean> = {};
      res.items.forEach((p) => {
        map[p.id] = !!p.featured;
      });
      setFeaturedMap(map);
    });
  }, []);

  const toggleFeatured = (id: string) => {
    setFeaturedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Product Moderation & Curation
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Review quality benchmarks and toggle products featured on the homepage.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-white border border-[#E8E0D5] shrink-0">
                <Image src={p.images[0]} alt="" fill className="object-cover" />
              </div>
              <div>
                <span className="font-bold text-[#29251F] text-sm block">{p.title}</span>
                <span className="text-[11px] text-[#777066]">
                  Artisan: {p.artisan.name} ({p.artisan.location}) • {formatINR(p.price)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleFeatured(p.id)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  featuredMap[p.id]
                    ? "bg-[#76513B] text-white"
                    : "bg-white border border-[#E8E0D5] text-[#777066] hover:text-[#29251F]"
                }`}
              >
                {featuredMap[p.id] ? "★ Featured on Homepage" : "Promote to Homepage"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
