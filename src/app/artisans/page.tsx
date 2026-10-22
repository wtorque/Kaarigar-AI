"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Award, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { ARTISANS } from "@/lib/api/fixtures";

export default function ArtisansPage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");

  const states = ["all", "Chhattisgarh", "Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Bihar"];

  const filteredArtisans = ARTISANS.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.craft.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase());

    const matchesState =
      selectedState === "all" || a.state.toLowerCase() === selectedState.toLowerCase();

    return matchesSearch && matchesState;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header & Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#A66B4D]">
          The Living Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29251F]">
          Meet India&apos;s Master Artisans
        </h1>
        <p className="text-xs sm:text-sm text-[#777066] leading-relaxed">
          Behind every thread, chisel stroke, and clay curve is a family keeping ancestral traditions alive. Browse verified creators across India.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E0D5] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777066]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by artisan or craft..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-full focus:outline-none focus:border-[#76513B]"
          />
        </div>

        {/* State Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar">
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                selectedState === st
                  ? "bg-[#76513B] text-white"
                  : "bg-[#FAF7F1] text-[#777066] hover:text-[#29251F] border border-[#E8E0D5]"
              }`}
            >
              {st === "all" ? "All States" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredArtisans.map((artisan) => (
          <div
            key={artisan.id}
            className="bg-white rounded-3xl border border-[#E8E0D5] overflow-hidden shadow-sm hover:shadow-craft-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#EFE9DF] border-2 border-[#76513B]/20 relative">
                  <Image
                    src={artisan.avatar}
                    alt={artisan.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                {artisan.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E5F0DF] text-[#436A31]">
                    <Award className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#29251F]">
                  {artisan.name}
                </h3>
                <p className="text-xs font-semibold text-[#76513B]">{artisan.craft}</p>
                <div className="flex items-center gap-1 text-[11px] text-[#777066] mt-0.5">
                  <MapPin className="w-3 h-3 text-[#777066]" />
                  <span>{artisan.location}</span>
                </div>
              </div>

              <p className="text-xs text-[#777066] leading-relaxed line-clamp-3">
                {artisan.bio}
              </p>

              {artisan.awards && artisan.awards.length > 0 && (
                <div className="text-[10px] text-[#A66B4D] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span className="truncate">{artisan.awards[0]}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#FAF7F1] border-t border-[#E8E0D5] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#29251F]">
                {artisan.productsCount} Handcrafted Pieces
              </span>
              <Link
                href={`/artisans/${artisan.slug}`}
                className="text-xs font-bold text-[#76513B] hover:text-[#5E3E2A] flex items-center gap-1"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
