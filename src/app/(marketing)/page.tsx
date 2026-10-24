import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/marketplace/hero-section";
import { CategoryCard } from "@/components/marketplace/category-card";
import { ProductCard } from "@/components/marketplace/product-card";
import { CATEGORIES, PRODUCTS } from "@/lib/api/fixtures";

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 8);
  const trendingCategories = CATEGORIES.slice(0, 8);

  return (
    <div className="space-y-5 sm:space-y-6 pb-6">
      
      {/* 1. Hero Section with Integrated Trust Indicators & Indian Handicraft Photography */}
      <HeroSection />

      {/* 2. Trending Categories Section (8 landscape image cards in one row) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#29221C]">
            Trending Categories
          </h2>
          <Link
            href="/marketplace"
            className="group flex items-center gap-1 text-xs font-semibold text-[#29221C] hover:text-[#70472F] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 8 Category Cards Grid in One Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {trendingCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section (8 compact cards in one row) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#29221C]">
            Featured Products
          </h2>
          <Link
            href="/marketplace"
            className="group flex items-center gap-1 text-xs font-semibold text-[#29221C] hover:text-[#70472F] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 8 Products Grid matching reference screenshot in One Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Wide Artisan Promotional Banner: "More Than Products — Artisans. Enriching Lives." */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-1">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#241710] text-white p-5 sm:p-6 lg:px-10 lg:py-6 shadow-sm border border-[#3E291D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-h-[105px] lg:h-[115px]">

          {/* Background photograph of artisan hands carving wood */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Image
              src="/images/banners/artisan-banner.webp"
              alt="Artisan hands carving wood with chisel and mallet"
              fill
              className="object-cover object-center opacity-40"
            />
            {/* Dark warm gradient overlay to guarantee text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C120C]/95 via-[#1C120C]/75 to-[#1C120C]/35" />
          </div>

          {/* Left Text */}
          <div className="relative z-10 space-y-0.5 max-w-xl">
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#D9A76A] block">
              More Than Products
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              — Artisans. Enriching Lives.
            </h2>
          </div>

          {/* Right CTA Button */}
          <div className="relative z-10 shrink-0">
            <Link
              href="/artisans"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white text-xs font-semibold backdrop-blur-xs shadow-xs hover:scale-105 transition-all group"
            >
              <span>Meet Our Artisans</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
