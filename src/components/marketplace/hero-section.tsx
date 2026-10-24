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
    <section className="relative overflow-hidden pt-4 pb-4 lg:pt-6 lg:pb-6 bg-[#FAF7F1]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Container */}
        <div className="relative min-h-[320px] lg:h-[330px] rounded-3xl overflow-hidden bg-[#FAF7F1] flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Column: Editorial Headline, Copy, Buttons, Trust Strip */}
          <div className="relative z-20 w-full lg:w-[48%] flex flex-col justify-center py-2">
            
            {/* Eyebrow Tag */}
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.22em] text-[#82776C] uppercase font-sans">
                Handmade • Authentic • Local
              </span>
            </div>

            {/* Headline matching screenshot */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-[#29221C] leading-[1.08] mt-2.5">
              Crafted <br />
              <span className="font-serif font-bold text-[#29221C]">by Real People</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-sm text-[#777066] leading-relaxed max-w-md mt-2.5 font-sans">
              Discover unique handmade products from talented artisans across India. Support local communities and keep traditions alive.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#302117] text-white text-xs font-semibold hover:bg-[#4A3425] shadow-xs transition-all active:scale-95"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F1] border border-[#DDD4C7] text-[#29221C] text-xs font-semibold hover:bg-[#EFE8DD] transition-all"
              >
                <div className="w-4 h-4 rounded-full bg-[#302117]/10 flex items-center justify-center text-[#302117]">
                  <Play className="w-2 h-2 fill-current ml-0.5" />
                </div>
                <span>Watch Story</span>
              </button>
            </div>

            {/* 4 Compact Trust Indicators integrated into lower hero edge */}
            <div className="mt-5 w-full max-w-2xl bg-[#F2ECE2]/85 backdrop-blur-xs border border-[#E7DED2] rounded-2xl sm:rounded-full px-3 py-2 sm:px-3.5 sm:py-1.5 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2.5 sm:gap-3 shadow-2xs">
              {trustPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E5DDD0] text-[#70472F] flex items-center justify-center shrink-0 border border-[#DDD4C7]">
                      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[1.8]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#29221C] leading-none">
                        {pillar.title}
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-[#82776C] leading-tight mt-0.5">
                        {pillar.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="relative w-full lg:w-[56%] h-[260px] sm:h-[300px] lg:h-full mt-3 lg:mt-0 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 rounded-2xl lg:rounded-none overflow-hidden">

            {/* Indian Handicrafts Image */}
            <div className="relative w-full h-full">
              <Image
                src="/images/hero/hero-crafts.webp"
                alt="Indian Handicrafts: Terracotta Pottery, Wooden Carvings, Chanderi Silk, Woven Baskets"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center lg:object-right"
              />

              {/* Seamless blend gradient from left */}
              <div className="absolute inset-y-0 left-0 w-24 lg:w-40 bg-gradient-to-r from-[#FAF7F1] via-[#FAF7F1]/80 to-transparent pointer-events-none hidden lg:block" />

              {/* Handwritten Script Callout: "Support Local ♡" in top right */}
              <div className="absolute top-4 right-6 select-none pointer-events-none transform -rotate-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
                <span
                  className="font-script text-3xl sm:text-4xl text-white tracking-wide"
                  style={{ fontFamily: "var(--font-script), 'Caveat', cursive, sans-serif" }}
                >
                  Support Local
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block drop-shadow-sm -mt-1"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Floating Pill Badge on Hero: "10,000+ Artisans / Real People, Real Stories ->" */}
              <Link
                href="/artisans"
                className="absolute bottom-4 right-6 flex items-center gap-3 bg-[#201812]/85 hover:bg-[#201812]/95 backdrop-blur-md text-white p-2 pl-2.5 pr-3 rounded-full border border-white/20 shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                {/* Overlapping Avatars */}
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  {ARTISANS.slice(0, 2).map((artisan, index) => (
                    <div
                      key={artisan.id}
                      className="inline-block w-7 h-7 rounded-full ring-2 ring-white/60 overflow-hidden bg-[#70472F] relative"
                      style={{ zIndex: 2 - index }}
                    >
                      <Image
                        src={artisan.avatar}
                        alt={artisan.name}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Text Details */}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold tracking-tight leading-none text-white">
                    10,000+ Artisans
                  </span>
                  <span className="text-[9px] text-white/80 font-normal leading-tight mt-0.5">
                    Real People, Real Stories
                  </span>
                </div>

                {/* Arrow Button */}
                <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0 ml-0.5">
                  <ArrowRight className="w-3 h-3 stroke-[2.2]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal ("Watch Story") */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#FAF7F1] rounded-3xl overflow-hidden shadow-2xl border border-[#E7DED2]">
            <div className="p-4 sm:p-5 border-b border-[#E7DED2] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#70472F]">
                  Living Cultural Heritage
                </span>
                <h3 className="font-serif text-lg font-bold text-[#29221C]">
                  The Hands Behind The Heritage
                </h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE8DD] text-[#82776C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Kaarigar Heritage Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 text-xs text-[#777066] leading-relaxed">
              Every handcrafted piece purchased on Kaarigar directly funds healthcare, schooling, and generational dignity for over 10,000 artisan families across rural India.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
