"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/api/fixtures";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#241F1C] text-[#E8E0D5] pt-16 pb-12 border-t border-[#3B332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Cultural Banner */}
        <div className="pb-12 border-b border-[#3B332E] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-[11px] uppercase tracking-widest text-[#C28E46] font-semibold">
              The Artisan Chronicle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1">
              Stories from India&apos;s generational workshops, delivered weekly.
            </h3>
            <p className="text-xs text-[#A89F93] mt-2 max-w-xl">
              Receive curated craft histories, artisan portraits, and early access to limited-edition handloom and pottery drops.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#78816A]/20 border border-[#78816A] rounded-2xl text-xs text-[#C4CDBC]">
                <CheckCircle2 className="w-4 h-4 text-[#8FA37E] shrink-0" />
                <span>You are subscribed to The Artisan Chronicle. Welcome to our craft circle!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777066]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#1A1715] text-white border border-[#423933] rounded-full placeholder:text-[#6E645A] focus:outline-none focus:border-[#C28E46]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 text-xs font-semibold bg-[#76513B] text-white rounded-full hover:bg-[#8F5E41] transition-colors shrink-0 flex items-center gap-1.5"
                >
                  Join
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#76513B] text-[#FAF7F1] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-current fill-none stroke-[1.8]"
                >
                  <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  Kaarigar
                </span>
                <span className="text-[9px] tracking-wider text-[#A89F93] uppercase font-medium">
                  Artisans • People • Opportunities
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A89F93] leading-relaxed max-w-sm">
              An AI-assisted national marketplace honoring India&apos;s living handicraft traditions. We empower rural craftspeople with fair living wages, authentic storytelling, and direct patronage.
            </p>
            <div className="text-[11px] text-[#78816A] flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#78816A] animate-pulse" />
              100% Verified Artisan Provenance & Direct Payouts
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
              Craft Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#A89F93]">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/marketplace/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/marketplace" className="text-[#C28E46] hover:underline">
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* For Artisans */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
              For Artisans
            </h4>
            <ul className="space-y-2 text-xs text-[#A89F93]">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Artisan Studio Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/ai-catalogue" className="hover:text-white transition-colors">
                  AI Catalogue Assistant
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Join as an Artisan
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Fair Wage Standards
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Artisan Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Heritage & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
              Trust & Heritage
            </h4>
            <ul className="space-y-2 text-xs text-[#A89F93]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Mission & Story
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-white transition-colors">
                  Master Artisans Directory
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#78816A] hover:underline">
                  Curator Governance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 border-t border-[#3B332E] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777066] gap-4">
          <p>© {new Date().getFullYear()} Kaarigar AI. Dedicated to India&apos;s generational masters.</p>
          <div className="flex items-center gap-1">
            <span>Built with respect for Indian heritage</span>
            <Heart className="w-3.5 h-3.5 text-[#A65636] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
