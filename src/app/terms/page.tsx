import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-[#76513B] font-semibold hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#E8E0D5] p-8 sm:p-12 shadow-sm space-y-6">
        <h1 className="font-serif text-3xl font-bold text-[#29251F]">
          Terms of Service & Fair Trade Charter
        </h1>
        <p className="text-xs text-[#777066]">
          Last updated: October 2026 • Kaarigar Marketplace Guidelines
        </p>

        <div className="space-y-6 text-xs text-[#554D44] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#29251F]">1. The Kaarigar Authenticity Promise</h2>
            <p>
              Every product listed on Kaarigar AI must be verified handmade by Indian artisans or artisan collectives. Mass factory-produced reproductions, synthetic counterfeit textiles, and deceptive plastic castings are strictly barred.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#29251F]">2. Fair Living Wage Commitment</h2>
            <p>
              Prices established through our AI Studio ensure craftspeople receive a dignified living wage factoring craft complexity and manual hours. Patrons agree to support transparent ethical compensation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#29251F]">3. Deliveries, Insured Transit & Returns</h2>
            <p>
              Due to the unique nature of authentic handmade pieces (subtle natural variations in wood grain, handloom weave knots, and terracotta kiln coloration are hallmarks of authenticity), returns are accepted within 7 days for transit damage or material defects.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
