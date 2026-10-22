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
      className="group relative flex-shrink-0 w-36 sm:w-44 h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E8E0D5] bg-[#EFE9DF] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Background Craft Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 150px, 180px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Subtle Dark Gradient at bottom for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      </div>

      {/* Top Wishlist Heart Icon (decor / optional bookmark) */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white transition-colors flex items-center justify-center">
          <Heart className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Bottom Category Label and Arrow Circle Button */}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
        <span className="text-xs sm:text-sm font-semibold text-white tracking-wide leading-tight drop-shadow-sm">
          {category.name}
        </span>
        <div className="w-6 h-6 rounded-full bg-white/90 text-[#29251F] flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shrink-0 ml-1.5 shadow-sm">
          <ArrowRight className="w-3 h-3 stroke-[2.2]" />
        </div>
      </div>
    </Link>
  );
}
