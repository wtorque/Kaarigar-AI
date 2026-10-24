"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Users, Package, TrendingUp, Check, X, AlertCircle } from "lucide-react";
import { api } from "@/lib/api/client";
import { formatINR } from "@/lib/utilities/cn";

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({
    totalGmv: 4892000,
    activeArtisans: 10420,
    totalProducts: 48200,
    pendingVerifications: 14,
    disputeRatePercent: 0.2,
  });

  const [pendingArtisans, setPendingArtisans] = useState([
    {
      id: "app_1",
      name: "Ramlal Sahu",
      craft: "Dhokra Lost-Wax Bell Metal",
      location: "Kondagaon, Bastar, CG",
      experience: "28 years",
      appliedDate: "Yesterday",
    },
    {
      id: "app_2",
      name: "Anandi Devi",
      craft: "Bhagalpur Tussar Silk Weaving",
      location: "Bhagalpur, Bihar",
      experience: "15 years",
      appliedDate: "2 days ago",
    },
    {
      id: "app_3",
      name: "Gopal Prajapati",
      craft: "Khurja Ceramic & Glaze Ware",
      location: "Khurja, UP",
      experience: "19 years",
      appliedDate: "3 days ago",
    },
  ]);

  const [actionDone, setActionDone] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getAdminMetrics().then(setMetrics);
  }, []);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setActionDone((prev) => ({ ...prev, [id]: action }));
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Platform GMV</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {formatINR(metrics.totalGmv)}
          </div>
          <span className="text-[10px] text-[#436A31] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% YoY growth
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Verified Active Artisans</span>
          <div className="font-serif text-2xl font-bold text-[#76513B]">
            {metrics.activeArtisans.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#78816A] font-semibold">
            Across 18 Indian States
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Live Catalog Listings</span>
          <div className="font-serif text-2xl font-bold text-[#29251F]">
            {metrics.totalProducts.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#777066]">
            100% Provenance Checked
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] space-y-1 shadow-xs">
          <span className="text-[11px] text-[#777066] font-medium">Customer Dispute Rate</span>
          <div className="font-serif text-2xl font-bold text-[#436A31]">
            {metrics.disputeRatePercent}%
          </div>
          <span className="text-[10px] text-[#436A31] font-semibold">
            Industry Benchmark: 2.1%
          </span>
        </div>
      </div>

      {/* KYC Verification Queue */}
      <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#78816A]" />
            <h2 className="font-serif text-lg font-bold text-[#29251F]">
              Artisan KYC Verification Queue ({pendingArtisans.length})
            </h2>
          </div>
          <Link href="/admin/artisans" className="text-xs text-[#78816A] font-semibold hover:underline">
            View All Applications
          </Link>
        </div>

        <div className="space-y-3">
          {pendingArtisans.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <span className="font-bold text-sm text-[#29251F] block">{a.name}</span>
                <span className="text-[11px] text-[#76513B] font-semibold block">{a.craft}</span>
                <span className="text-[11px] text-[#777066]">
                  {a.location} • {a.experience} practice • Applied {a.appliedDate}
                </span>
              </div>

              {actionDone[a.id] ? (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    actionDone[a.id] === "approved"
                      ? "bg-[#E5F0DF] text-[#436A31]"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  ✓ {actionDone[a.id]}
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(a.id, "approved")}
                    className="px-3.5 py-1.5 rounded-full bg-[#78816A] text-white font-semibold hover:bg-[#5E6554] flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Grant Badge</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(a.id, "rejected")}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E8E0D5] text-red-600 font-semibold hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
