import React from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E0D5] p-8 sm:p-12 shadow-craft space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F1] border border-[#E8E0D5] text-[#76513B] mx-auto flex items-center justify-center">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#76513B]">
            404 Error
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
            Handcraft Piece Not Found
          </h1>
          <p className="text-xs text-[#777066] leading-relaxed">
            The page or handcrafted piece you are looking for may have found a patron or been moved to a new workshop collection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/marketplace"
            className="px-5 py-2.5 rounded-full border border-[#D4C8B8] text-xs font-semibold text-[#29251F] hover:bg-[#FAF7F1] transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
