"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, Check, X, Shield } from "lucide-react";
import { ARTISANS } from "@/lib/api/fixtures";

export default function AdminArtisansPage() {
  const [artisansList, setArtisansList] = useState(ARTISANS);

  const toggleVerification = (id: string) => {
    setArtisansList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isVerified: !a.isVerified } : a))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Artisan Registry & KYC Status
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Manage official artisan badges and craft lineage authentications.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F1] border border-[#E8E0D5] text-[#78816A]">
          {artisansList.length} Registered Artisans
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D5] text-[#777066] uppercase text-[10px] tracking-wider">
              <th className="pb-3 font-bold">Artisan</th>
              <th className="pb-3 font-bold">Craft & Heritage</th>
              <th className="pb-3 font-bold">Location</th>
              <th className="pb-3 font-bold">Experience</th>
              <th className="pb-3 font-bold">Verification Status</th>
              <th className="pb-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE1]">
            {artisansList.map((a) => (
              <tr key={a.id} className="hover:bg-[#FAF7F1] transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#EFE9DF] relative border border-[#E8E0D5]">
                      <Image src={a.avatar} alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <span className="font-bold text-[#29251F] block">{a.name}</span>
                      <span className="text-[10px] text-[#777066]">{a.productsCount} listings</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 text-[#29251F] font-medium">{a.craft}</td>
                <td className="py-3.5 text-[#777066]">{a.location}</td>
                <td className="py-3.5 font-bold text-[#29251F]">{a.yearsOfExperience} yrs</td>
                <td className="py-3.5">
                  {a.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F0DF] text-[#436A31]">
                      <Award className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Under Review
                    </span>
                  )}
                </td>
                <td className="py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => toggleVerification(a.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      a.isVerified
                        ? "bg-white border border-[#E8E0D5] text-[#777066] hover:text-red-600"
                        : "bg-[#78816A] text-white hover:bg-[#5E6554]"
                    }`}
                  >
                    {a.isVerified ? "Revoke Badge" : "Grant Badge"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
