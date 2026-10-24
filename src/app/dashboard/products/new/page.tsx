"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Plus } from "lucide-react";
import { api } from "@/lib/api/client";
import { CATEGORIES } from "@/lib/api/fixtures";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("handicrafts");
  const [price, setPrice] = useState(1299);
  const [stockCount, setStockCount] = useState(10);
  const [craftTechnique, setCraftTechnique] = useState("Traditional Hand Carving");
  const [materials, setMaterials] = useState("Seasoned Teakwood, Natural Beeswax");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await api.addArtisanProduct({
        title,
        category,
        price: Number(price),
        stockCount: Number(stockCount),
        craftTechnique,
        materials: materials.split(",").map((s) => s.trim()),
        description: description || "Handcrafted with generational devotion by master artisans.",
        images: ["/images/products/wooden-elephant.webp"],
      });

      router.push("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
        <div>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#76513B] font-semibold hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inventory</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#29251F]">
            Manual Craft Listing
          </h1>
        </div>

        <Link
          href="/dashboard/ai-catalogue"
          className="px-4 py-2 rounded-full bg-[#EFE9DF] text-[#76513B] text-xs font-semibold hover:bg-[#E0D7C9] flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prefer AI Cataloguing?</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-[#29251F]">Product Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Handcarved Bastar Wooden Elephant"
            className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-[#29251F]">Craft Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#29251F]">Selling Price (₹)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#29251F]">Available Stock</label>
            <input
              type="number"
              required
              value={stockCount}
              onChange={(e) => setStockCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-[#29251F]">Craft Technique</label>
            <input
              type="text"
              value={craftTechnique}
              onChange={(e) => setCraftTechnique(e.target.value)}
              placeholder="e.g. Lost-wax Dhokra Casting, Extra-weft Weaving"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#29251F]">Materials (comma separated)</label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="e.g. Mulberry Silk, Gold Zari, Teakwood"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[#29251F]">Heritage Craft Story & Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share the generational inspiration, origin of raw materials, and workshop details..."
            className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {loading ? (
            <span>Publishing piece...</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Publish Craft to Marketplace</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
