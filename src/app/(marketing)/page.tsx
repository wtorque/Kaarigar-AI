import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Award, Shield, CheckCircle2, Camera } from "lucide-react";
import { HeroSection } from "@/components/marketplace/hero-section";
import { CategoryCard } from "@/components/marketplace/category-card";
import { ProductCard } from "@/components/marketplace/product-card";
import { CATEGORIES, PRODUCTS, ARTISANS } from "@/lib/api/fixtures";

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trending Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
            Trending Categories
          </h2>
          <Link
            href="/marketplace"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#76513B] hover:text-[#5E3E2A] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scrollable / Responsive Horizontal Categories Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
            Featured Products
          </h2>
          <Link
            href="/marketplace"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#76513B] hover:text-[#5E3E2A] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8 Products Grid matching reference screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Banner Section: "More Than Products — Artisans. Enriching Lives." */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#3B281E] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-[#4E372B]">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C28E46]">
              More Than Products
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Artisans. <br />Enriching Lives.
            </h2>
            <p className="text-xs sm:text-sm text-[#E2D5C7] leading-relaxed">
              Every handcrafted piece purchased on Kaarigar directly funds healthcare, schooling, and generational dignity for over 10,000 artisan families across rural India.
            </p>
            <div className="pt-2">
              <Link
                href="/artisans"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF7F1] text-[#29251F] text-xs sm:text-sm font-semibold hover:bg-white shadow-md hover:shadow-lg transition-all"
              >
                <span>Meet Our Artisans</span>
                <ArrowRight className="w-4 h-4 text-[#76513B]" />
              </Link>
            </div>
          </div>

          {/* Background subtle craft artwork */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none hidden md:block">
            <Image
              src="/images/hero/hero-crafts.webp"
              alt="Artisan hands at work"
              fill
              className="object-cover object-right"
            />
          </div>
        </div>
      </section>

      {/* 5. Signature Kaarigar AI Studio Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E8E0D5] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFE6] text-[#76513B] text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-[#A66B4D]" />
              <span>Signature Innovation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
              AI Studio for Rural Artisans
            </h2>

            <p className="text-sm text-[#777066] leading-relaxed">
              We eliminated the digital divide. Artisans simply photograph their handmade craft with a mobile phone. Our indigenous AI model analyzes the work to generate:
            </p>

            <div className="space-y-3">
              {[
                "Poetic cultural storytelling and craft heritage narratives",
                "Automated material and technique classification (Bastar, Molela, Chanderi)",
                "Fair-living-wage price recommendations calculating craft hours & materials",
                "Instant multi-language voice and text cataloguing",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#29251F]">
                  <CheckCircle2 className="w-4 h-4 text-[#78816A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/dashboard/ai-catalogue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] transition-colors shadow-sm"
              >
                <span>Try AI Catalogue Studio</span>
                <Sparkles className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#D4C8B8] text-[#29251F] text-xs sm:text-sm font-semibold hover:bg-[#FAF7F1] transition-colors"
              >
                <span>Learn How It Works</span>
              </Link>
            </div>
          </div>

          {/* Interactive AI Preview Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF7F1] rounded-2xl border border-[#E8E0D5] p-6 shadow-craft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#76513B] text-white flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#29251F]">Photo Analysis Output</h4>
                    <span className="text-[10px] text-[#78816A] font-semibold">AI Confidence: 99.4%</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5F0DF] text-[#436A31]">
                  Verified Heritage
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 aspect-square rounded-xl overflow-hidden relative border border-[#E8E0D5]">
                  <Image
                    src="/images/products/handpainted-lamp.webp"
                    alt="Analyzed craft"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 space-y-2 text-xs">
                  <p className="font-bold text-[#29251F]">
                    Handcrafted Terracotta Cutwork Ambient Lamp
                  </p>
                  <p className="text-[11px] text-[#777066] line-clamp-3">
                    Formed by hand using Banas riverbed clay steeped for three weeks, then hand-punched with delicate floral jali cuts to cast constellation shadows.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E8E0D5] text-[#76513B]">
                      Molela Terracotta
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E8E0D5] text-[#78816A]">
                      Riverbed Clay
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E0D5] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#777066] block">Fair Wage Price Recommendation</span>
                  <span className="font-bold text-sm text-[#29251F]">₹1,199</span>
                  <span className="text-[10px] text-[#78816A] ml-2 font-medium">(7 hrs craft labor factored)</span>
                </div>
                <span className="px-3 py-1 bg-[#76513B] text-white text-[11px] font-semibold rounded-full">
                  Ready to List
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Artisans Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
              Master Artisans of India
            </h2>
            <p className="text-xs text-[#777066] mt-1">
              Generational custodians keeping centuries of cultural memory alive.
            </p>
          </div>
          <Link
            href="/artisans"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#76513B] hover:text-[#5E3E2A] transition-colors"
          >
            <span>Meet All Artisans</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ARTISANS.slice(0, 4).map((artisan) => (
            <Link
              key={artisan.id}
              href={`/artisans/${artisan.slug}`}
              className="group bg-white rounded-2xl border border-[#E8E0D5] p-5 shadow-sm hover:shadow-craft-hover transition-all duration-300 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#EFE9DF] shrink-0 border-2 border-[#E8E0D5] group-hover:border-[#76513B] transition-colors relative">
                  <Image
                    src={artisan.avatar}
                    alt={artisan.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-bold text-[#29251F] truncate group-hover:text-[#76513B] transition-colors">
                      {artisan.name}
                    </h3>
                    {artisan.isVerified && (
                      <Award className="w-3.5 h-3.5 text-[#78816A] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#76513B] font-medium truncate">
                    {artisan.craft}
                  </span>
                  <span className="text-[11px] text-[#777066]">
                    {artisan.location}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#777066] mt-3 line-clamp-2 leading-relaxed">
                &ldquo;{artisan.quote || artisan.bio}&rdquo;
              </p>

              <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] text-[#777066]">
                <span>{artisan.yearsOfExperience} Years Heritage</span>
                <span className="font-semibold text-[#29251F]">
                  {artisan.productsCount} Crafts Listed
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Artisan Onboarding Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F1] rounded-3xl border-2 border-dashed border-[#D4C8B8] p-8 sm:p-12 text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#76513B]">
            Artisan Community
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F] max-w-xl mx-auto">
            Are You an Artisan or Craft Collective?
          </h2>
          <p className="text-xs sm:text-sm text-[#777066] max-w-lg mx-auto">
            Digitise your workshop in minutes. No listing fees, automated cataloguing in Hindi and regional languages, and direct weekly bank transfers.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] transition-colors shadow-sm"
            >
              Start Free Artisan Onboarding
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-full border border-[#D4C8B8] text-[#29251F] text-xs sm:text-sm font-semibold hover:bg-[#EFE9DF] transition-colors"
            >
              Contact Artisan Outreach Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
