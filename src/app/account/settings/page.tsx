"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { Check, Save } from "lucide-react";

export default function AccountSettingsPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "Harshh");
  const [email] = useState(user?.email || "harshh@kaarigar.in");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [street, setStreet] = useState(user?.address?.street || "Plot 42, Gulmohar Enclave, Arera Colony");
  const [city, setCity] = useState(user?.address?.city || "Bhopal");
  const [state, setState] = useState(user?.address?.state || "Madhya Pradesh");
  const [pincode, setPincode] = useState(user?.address?.pincode || "462016");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      address: {
        street,
        city,
        state,
        pincode,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#29251F]">
          Profile & Address Settings
        </h2>
        <p className="text-xs text-[#777066] mt-0.5">
          Manage your delivery addresses and personal preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#76513B]">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl text-[#777066] opacity-75 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">Contact Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F0EBE1] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#76513B]">
            Default Delivery Address
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#29251F]">Street / Building / Area</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F0EBE1] flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center gap-1.5 shadow-sm"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#C4CDBC]" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
