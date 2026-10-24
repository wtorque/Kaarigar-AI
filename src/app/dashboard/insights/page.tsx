"use client";

import React from "react";
import { TrendingUp, Users, MapPin, Award, Heart } from "lucide-react";
import { formatINR } from "@/lib/utilities/cn";

export default function DashboardInsightsPage() {
  const topCategories = [
    { name: "Handicrafts & Woodcraft", revenue: 42100, share: 50 },
    { name: "Terracotta Home Decor", revenue: 23400, share: 28 },
    { name: "Festival Oil Diyas", revenue: 19150, share: 22 },
  ];

  const buyerRegions = [
    { city: "Bhopal, MP", orders: 14, percent: 34 },
    { city: "Mumbai, MH", orders: 11, percent: 26 },
    { city: "New Delhi, DL", orders: 9, percent: 21 },
    { city: "Bengaluru, KA", orders: 8, percent: 19 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#29251F]">
          Studio Analytics & Cultural Reach
        </h2>
        <p className="text-xs text-[#777066] mt-0.5">
          Understand which crafts resonate most with design patrons nationwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Contribution */}
        <div className="p-6 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#29251F]">
              Top Craft Traditions by Revenue
            </h3>
            <span className="text-xs font-semibold text-[#76513B]">Total: {formatINR(84650)}</span>
          </div>

          <div className="space-y-3 text-xs">
            {topCategories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-[#29251F]">{cat.name}</span>
                  <span className="font-bold text-[#76513B]">{formatINR(cat.revenue)} ({cat.share}%)</span>
                </div>
                <div className="h-2 w-full bg-[#E8E0D5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#76513B] rounded-full"
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Patron Distribution */}
        <div className="p-6 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#29251F]">
              Geographic Patron Reach
            </h3>
            <span className="text-xs font-semibold text-[#78816A]">4 Major Metros</span>
          </div>

          <div className="space-y-3 text-xs">
            {buyerRegions.map((reg) => (
              <div key={reg.city} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E0D5]">
                <div className="flex items-center gap-2 text-[#29251F] font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#76513B]" />
                  <span>{reg.city}</span>
                </div>
                <span className="text-xs font-bold text-[#76513B]">
                  {reg.orders} Orders ({reg.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fair Trade Badge Note */}
      <div className="p-5 rounded-2xl bg-[#EFE9DF] border border-[#E0D7C9] flex items-center gap-3 text-xs">
        <Award className="w-6 h-6 text-[#76513B] shrink-0" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#29251F] block">
            Kaarigar Verified Ethical Living Wage Ratio: 99.8%
          </span>
          <p className="text-[#554D44] text-[11px]">
            Your pricing structure meets national fair artisan standards with zero intermediary deductions.
          </p>
        </div>
      </div>
    </div>
  );
}
