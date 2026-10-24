"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/marketplace/${category.slug}`}
      className="group relative w-full h-[82px] sm:h-[86px] rounded-2xl overflow-hidden border border-[#E7DED2] bg-[#EFE8DD] shadow-2xs hover:shadow-md transition-all duration-300 block"
    >
      {/* Background Craft Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Subtle Dark Gradient at bottom for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
      </div>

      {/* Top Wishlist Heart Icon (subtle ambient heart) */}
      <div className="absolute top-1.5 right-1.5 z-10">
        <span className="p-1 rounded-full bg-black/20 backdrop-blur-2xs text-white/70 hover:text-white transition-colors flex items-center justify-center">
          <Heart className="w-2.5 h-2.5 stroke-[1.8]" />
        </span>
      </div>

      {/* Bottom Category Label and Arrow Circle Button */}
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between z-10 gap-1">
        <span className="text-[11px] font-semibold text-white tracking-tight leading-tight drop-shadow-xs truncate">
          {category.name}
        </span>
        <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white text-[#29221C] flex items-center justify-center group-hover:bg-[#FAF7F1] group-hover:scale-110 transition-all shrink-0 shadow-2xs">
          <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
        </div>
      </div>
    </Link>
  );
}
