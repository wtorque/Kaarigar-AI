"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Users,
  HeartHandshake,
  Lock,
  X,
  Sparkles,
} from "lucide-react";
import { ARTISANS } from "@/lib/api/fixtures";

export function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const trustPillars = [
    {
      title: "Authentic Products",
      subtitle: "Verified Artisans",
      icon: ShieldCheck,
    },
    {
      title: "Direct from Artisans",
      subtitle: "No Middlemen",
      icon: Users,
    },
    {
      title: "Support Local",
      subtitle: "Empower Communities",
      icon: HeartHandshake,
    },
    {
      title: "Secure Shopping",
      subtitle: "Safe & Trusted",
      icon: Lock,
    },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-14 lg:py-12 bg-[#FAF7F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            
            {/* Eyebrow Tag */}
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#777066] uppercase">
                Handmade • Authentic • Local
              </span>
            </div>

            {/* Headline matching screenshot */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#29251F] leading-[1.12]">
              Crafted <br />
              <span className="italic font-normal">by Real</span> People
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#777066] leading-relaxed max-w-lg">
              Discover unique handmade products from talented artisans across India. Support local communities and keep traditions alive.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-transparent border border-[#D4C8B8] text-[#29251F] text-xs sm:text-sm font-semibold hover:bg-[#EFE9DF] transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#76513B]">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Story</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden border border-[#E8E0D5] bg-[#EAE2D5] shadow-craft">
              
              {/* Composite Craft Photography */}
              <Image
                src="/images/hero/hero-crafts.webp"
                alt="Curated Indian Handicrafts: Terracotta, Carved Wood, Banarasi Silk, Jute"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              {/* Hand-drawn Script Callout: "Support Local ♡" */}
              <div className="absolute top-6 right-6 select-none pointer-events-none transform rotate-3">
                <span className="font-serif italic text-xl sm:text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  Support Local ♡
                </span>
              </div>

              {/* Floating Pill Badge on Hero: "10,000+ Artisans / Real People, Real Stories ->" */}
              <Link
                href="/artisans"
                className="absolute bottom-6 right-6 flex items-center gap-3.5 bg-black/60 hover:bg-black/75 backdrop-blur-md text-white p-2.5 pr-4 rounded-full border border-white/20 shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                {/* Overlapping Avatars */}
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  {ARTISANS.slice(0, 3).map((artisan, index) => (
                    <div
                      key={artisan.id}
                      className="inline-block w-8 h-8 rounded-full ring-2 ring-white/40 overflow-hidden bg-[#76513B] relative"
                      style={{ zIndex: 3 - index }}
                    >
                      <Image
                        src={artisan.avatar}
                        alt={artisan.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Text Details */}
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    10,000+ Artisans
                  </span>
                  <span className="text-[10px] text-white/80 font-normal">
                    Real People, Real Stories
                  </span>
                </div>

                {/* Arrow */}
                <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0 ml-1">
                  <ArrowRight className="w-3 h-3 stroke-[2.2]" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Value / Trust Props Row matching reference screenshot */}
        <div className="mt-12 pt-8 border-t border-[#E8E0D5]/70 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EFE9DF] text-[#76513B] flex items-center justify-center shrink-0 border border-[#E0D7C9]">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#29251F]">
                    {pillar.title}
                  </span>
                  <span className="text-[11px] text-[#777066]">
                    {pillar.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal ("Watch Story") */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#FAF7F1] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E0D5]">
            <div className="p-4 sm:p-6 border-b border-[#E8E0D5] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A66B4D]">
                  Living Cultural Heritage
                </span>
                <h3 className="font-serif text-lg font-bold text-[#29251F]">
                  The Hands Behind The Heritage
                </h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE9DF] text-[#777066] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <Image
                  src="/images/hero/hero-crafts.webp"
                  alt="Story thumbnail"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#76513B] flex items-center justify-center text-white shadow-lg">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                  <p className="font-serif text-lg font-semibold max-w-md drop-shadow-md">
                    &ldquo;When a craft dies, centuries of generational memory vanish with it.&rdquo;
                  </p>
                  <p className="text-xs text-white/80">
                    A short documentary following Ramesh Pal in Molela and Meena Devi in Chanderi.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-[#777066]">
                  <Sparkles className="w-4 h-4 text-[#A66B4D]" />
                  <span>Powered by Kaarigar AI Fair Trade Initiative</span>
                </div>
                <Link
                  href="/artisans"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-xs font-semibold text-[#76513B] hover:underline"
                >
                  Explore All Artisan Profiles →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
