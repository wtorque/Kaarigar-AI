"use client";

import React, { useState } from "react";
import { Check, Save, Building, ShieldCheck, MapPin } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

export default function DashboardSettingsPage() {
  const { user } = useAuth();

  const [bankName, setBankName] = useState("State Bank of India");
  const [accountNumber, setAccountNumber] = useState("••••••••9482");
  const [ifsc, setIfsc] = useState("SBIN0001824");
  const [upiId, setUpiId] = useState("suresh.bastar@okhdfcbank");
  const [workshopAddress, setWorkshopAddress] = useState("Village Kondagaon, Near Bell Metal Guild, Bastar, CG - 494226");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#29251F]">
          Artisan Payouts & Workshop Settings
        </h2>
        <p className="text-xs text-[#777066] mt-0.5">
          Weekly customer payments are settled directly to this account every Tuesday.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Payout Banking Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE1]">
            <Building className="w-4 h-4 text-[#76513B]" />
            <h3 className="font-bold uppercase tracking-wider text-xs text-[#29251F]">
              Direct Bank Settlement Account
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl uppercase focus:outline-none focus:border-[#76513B]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">UPI ID for Instant Disbursal</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
              />
            </div>
          </div>
        </div>

        {/* Pickup Logistics Address */}
        <div className="space-y-4 pt-4 border-t border-[#F0EBE1]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE1]">
            <MapPin className="w-4 h-4 text-[#76513B]" />
            <h3 className="font-bold uppercase tracking-wider text-xs text-[#29251F]">
              Workshop Physical Pickup Address
            </h3>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#29251F]">Courier Pickup Location</label>
            <textarea
              rows={2}
              value={workshopAddress}
              onChange={(e) => setWorkshopAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#E5F0DF] text-[#436A31] flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Verified under Government of India Artisans Development Board Registry</span>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center gap-2 shadow-sm"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-[#C4CDBC]" />
              <span>Details Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Payout Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
