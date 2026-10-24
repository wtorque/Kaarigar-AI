import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Privacy Policy & Artisan Data Protection
        </h1>
        <p className="text-xs text-[#777066]">
          Last updated: October 2026 • Kaarigar AI Data Protection Charter
        </p>

        <div className="space-y-6 text-xs text-[#554D44] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#29251F]">1. Information We Collect</h2>
            <p>
              Kaarigar AI collects customer contact and delivery details exclusively for fulfillment of authentic Indian handicraft orders. For artisans, we collect workshop locations, craft techniques, and direct payout bank identifiers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#29251F]">2. Artisan Data & Identity Sovereignty</h2>
            <p>
              We firmly reject the extraction or commercial reselling of generational craft patterns. All intellectual property, traditional motifs, and family design lineages remain 100% owned by the master artisan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#29251F]">3. Security & Financial Transactions</h2>
            <p>
              All customer payments are encrypted via PCI-DSS Level 1 compliant gateways. Card details and UPI security credentials are never stored on Kaarigar servers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
