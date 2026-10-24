"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import { CATEGORIES } from "@/lib/api/fixtures";
import { api, ProductFilterParams } from "@/lib/api/client";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentRegion = searchParams.get("region") || "";
  const currentSort = (searchParams.get("sort") as ProductFilterParams["sort"]) || "featured";
  const currentQuery = searchParams.get("query") || "";
  const inStockOnly = searchParams.get("inStock") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentQuery);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .getProducts({
        category: currentCategory,
        region: currentRegion,
        sort: currentSort,
        query: currentQuery,
        inStockOnly,
      })
      .then((res) => {
        if (isMounted) {
          setProducts(res.items);
          setTotalCount(res.total);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentCategory, currentRegion, currentSort, currentQuery, inStockOnly]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/marketplace?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/marketplace");
    setSearchInput("");
  };

  const regions = ["Bastar", "Chanderi", "Jaipur", "Varanasi", "Molela", "Madhubani", "Saharanpur", "Jhabua"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Breadcrumb */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#777066]">
          <Link href="/" className="hover:text-[#76513B]">Home</Link>
          <span>/</span>
          <span className="text-[#29251F] font-semibold">Marketplace</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
              Handcrafted Treasures of India
            </h1>
            <p className="text-xs sm:text-sm text-[#777066] mt-1">
              Explore authentic pieces from master artisans across 14 craft traditions.
            </p>
          </div>
          <div className="text-xs text-[#777066] font-medium">
            Showing <span className="font-bold text-[#29251F]">{totalCount}</span> items
          </div>
        </div>
      </div>

      {/* Top Filter & Sort Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E8E0D5] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        
        {/* Category Pills (Quick Filter) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar flex-1">
          <button
            type="button"
            onClick={() => updateParam("category", "all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              currentCategory === "all"
                ? "bg-[#76513B] text-white"
                : "bg-[#FAF7F1] text-[#777066] hover:text-[#29251F] border border-[#E8E0D5]"
            }`}
          >
            All Crafts
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam("category", cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                currentCategory === cat.slug
                  ? "bg-[#76513B] text-white"
                  : "bg-[#FAF7F1] text-[#777066] hover:text-[#29251F] border border-[#E8E0D5]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Controls: Sort Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#777066] bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#76513B]" />
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-transparent text-xs font-medium text-[#29251F] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl text-[#29251F]"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter (Desktop) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#76513B]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#29251F]">
                  Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-[#76513B] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Keyword Search within catalog */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#29251F]">Keyword Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#777066]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateParam("query", searchInput.trim());
                    }
                  }}
                  placeholder="Wood, Silk, Diya..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F1] rounded-xl border border-[#E8E0D5]"
                />
              </div>
            </div>

            {/* Regional Origin Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#29251F]">Craft Region</label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => updateParam("region", null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    !currentRegion ? "bg-[#FAF7F1] text-[#76513B] font-semibold" : "text-[#777066] hover:bg-[#FAF7F1]"
                  }`}
                >
                  <span>All Regions</span>
                  {!currentRegion && <span className="text-[10px]">✓</span>}
                </button>
                {regions.map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => updateParam("region", reg)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      currentRegion === reg ? "bg-[#FAF7F1] text-[#76513B] font-semibold" : "text-[#777066] hover:bg-[#FAF7F1]"
                    }`}
                  >
                    <span>{reg}</span>
                    {currentRegion === reg && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Filter */}
            <div className="pt-3 border-t border-[#F0EBE1]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#29251F]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
                  className="rounded text-[#76513B] focus:ring-[#76513B]"
                />
                <span className="font-medium">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E8E0D5] p-3 space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E8E0D5] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F1] text-[#76513B] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#29251F]">
                No handcrafted pieces found
              </h3>
              <p className="text-xs text-[#777066] max-w-sm mx-auto">
                We couldn&apos;t find any items matching your current filters. Try selecting different craft categories or resetting your search.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A]"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-[#777066]">
          Loading Kaarigar craft marketplace...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
