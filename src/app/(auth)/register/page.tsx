"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { loginGoogle, switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"customer" | "artisan">("artisan");
  const [agreed, setAgreed] = useState(true);

  const handleRegister = async () => {
    if (selectedRole === "artisan") {
      await switchRole("artisan");
      router.push("/onboarding");
    } else {
      await switchRole("customer");
      router.push("/marketplace");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E0D5] p-8 shadow-craft space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#76513B] text-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.8]">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="font-serif text-2xl font-bold text-[#29251F]">Kaarigar</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#29251F]">
            Join the Movement
          </h1>
          <p className="text-xs text-[#777066]">
            Select how you would like to participate in Kaarigar AI.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label
            onClick={() => setSelectedRole("artisan")}
            className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedRole === "artisan"
                ? "border-[#76513B] bg-[#FAF7F1]"
                : "border-[#E8E0D5] hover:bg-[#FAF7F1]"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#76513B] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-sm text-[#29251F] block">
                I am an Artisan / Handcraft Collective
              </span>
              <p className="text-xs text-[#777066] mt-0.5">
                Digitise your craft workshop with Kaarigar AI, reach patrons worldwide, and receive direct fair weekly payouts.
              </p>
            </div>
          </label>

          <label
            onClick={() => setSelectedRole("customer")}
            className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedRole === "customer"
                ? "border-[#76513B] bg-[#FAF7F1]"
                : "border-[#E8E0D5] hover:bg-[#FAF7F1]"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#EFE9DF] text-[#76513B] flex items-center justify-center shrink-0 mt-0.5">
              <Heart className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-sm text-[#29251F] block">
                I am a Patron / Craft Enthusiast
              </span>
              <p className="text-xs text-[#777066] mt-0.5">
                Discover authentic verified Indian handicrafts, connect directly with makers, and enjoy insured doorstep delivery.
              </p>
            </div>
          </label>
        </div>

        {/* Terms agreement */}
        <div className="text-xs text-[#777066] flex items-start gap-2 pt-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 text-[#76513B] rounded focus:ring-[#76513B]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-[#76513B] underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#76513B] underline">Privacy Policy</Link>.
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          disabled={!agreed}
          onClick={handleRegister}
          className="w-full py-3.5 px-6 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-colors"
        >
          <span>Continue Registration</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center text-xs text-[#777066]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#76513B] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
