import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#76513B]">
          Our Purpose & Lineage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#29251F] leading-tight">
          Preserving India&apos;s Living Heritage Through Ethical AI & Fair Patronage
        </h1>
        <p className="text-xs sm:text-sm text-[#777066] leading-relaxed">
          India is home to the world&apos;s most diverse living handicraft traditions, passed down through families for centuries. Kaarigar AI ensures master craftspeople thrive in the digital economy without losing their autonomy.
        </p>
      </div>

      {/* Visual Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E8E0D5] bg-[#EFE9DF] shadow-craft">
          <Image
            src="/images/hero/hero-crafts.webp"
            alt="Handicrafts of India"
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase font-bold tracking-wider text-[#A66B4D]">
            The Middleman Problem
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
            Why Traditional Craftspeople Were Being Left Behind
          </h2>
          <p className="text-xs sm:text-sm text-[#777066] leading-relaxed">
            For decades, rural artisans surrendered 70% to 85% of their product margins to urban traders and aggregators. They lacked English fluency, smartphone typing skills, and digital marketing know-how to list on mass e-commerce platforms.
          </p>
          <p className="text-xs sm:text-sm text-[#777066] leading-relaxed">
            Kaarigar AI solves this through visual AI: an artisan takes one photograph, speaks in their local tongue, and our engine automatically identifies materials, generates rich cultural stories, and sets fair living wage prices.
          </p>
        </div>
      </div>

      {/* Four Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Direct Patronage",
            desc: "Zero intermediary cuts. Artisans receive verified weekly payouts calculating direct craft hours and materials.",
            icon: HeartHandshake,
          },
          {
            title: "Indigenous AI Studio",
            desc: "Computer vision and regional language models calibrate technical craft classification and heritage stories.",
            icon: Sparkles,
          },
          {
            title: "Verified Provenance",
            desc: "Every product includes the artisan's name, workshop location, and generational heritage background.",
            icon: ShieldCheck,
          },
          {
            title: "Living Wage Guarantee",
            desc: "Prices are scientifically computed based on fair regional daily wages, rejecting exploitative sweatshop models.",
            icon: Award,
          },
        ].map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F1] text-[#76513B] flex items-center justify-center border border-[#E8E0D5]">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#29251F]">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#777066] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-[#FAF7F1] rounded-3xl border border-[#D4C8B8] p-8 sm:p-12 text-center space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
          Experience Authentic Indian Crafts
        </h2>
        <p className="text-xs sm:text-sm text-[#777066] max-w-lg mx-auto">
          Explore handmade works from Bastar, Chanderi, Molela, Madhubani, and Varanasi.
        </p>
        <div className="pt-2">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] shadow-sm"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
