"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Check,
  Upload,
  Camera,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser, switchRole } = useAuth();

  const [step, setStep] = useState(1);
  const [workshopName, setWorkshopName] = useState("Bastar Sacred Carvings");
  const [craftType, setCraftType] = useState("Wood Carving & Dhokra");
  const [region, setRegion] = useState("Bastar, Chhattisgarh");
  const [experience, setExperience] = useState(22);
  const [story, setStory] = useState(
    "Carving generational tribal deities and sacred forest animals from seasoned wood using traditional hand chisels."
  );
  const [photoPreview, setPhotoPreview] = useState("/images/products/wooden-elephant.webp");

  const handleFinish = async () => {
    await switchRole("artisan");
    updateUser({
      name: workshopName,
      artisanProfile: {
        id: `art_${Date.now()}`,
        craft: craftType,
        region,
        bio: story,
        isVerified: true,
        yearsOfExperience: experience,
        rating: 5.0,
      },
    });
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-10 shadow-craft space-y-8">
        
        {/* Progress Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#76513B]">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? "Workshop Setup" : step === 2 ? "Craft Lineage" : "Verification"}</span>
          </div>
          <div className="h-1.5 w-full bg-[#FAF7F1] rounded-full overflow-hidden border border-[#E8E0D5]">
            <div
              className="h-full bg-[#76513B] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Workshop Profile */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#29251F]">
                Tell Us About Your Workshop
              </h2>
              <p className="text-xs text-[#777066] mt-1">
                This helps patrons recognize your studio and regional craft lineage.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">Workshop or Studio Name</label>
                <input
                  type="text"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">Primary Craft Tradition</label>
                <input
                  type="text"
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                  placeholder="e.g. Chanderi Handloom Weaving, Molela Terracotta"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#29251F]">Region & State</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#29251F]">Generational Practice (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center justify-center gap-2"
            >
              <span>Next: Heritage Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Storytelling */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#29251F]">
                Your Craft Heritage Story
              </h2>
              <p className="text-xs text-[#777066] mt-1">
                Kaarigar patrons value the authentic narrative behind each handmade piece.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">
                  Artisan Biography & Craft Philosophy
                </label>
                <textarea
                  rows={4}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE9DF] border border-[#E0D7C9] text-xs space-y-1">
                <span className="font-bold text-[#76513B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  AI Story Polish Available
                </span>
                <p className="text-[#554D44] text-[11px]">
                  Our indigenous language models can translate and polish your story into English, Hindi, and regional dialects once your studio is live.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-full border border-[#D4C8B8] text-xs font-semibold text-[#29251F]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center justify-center gap-2"
              >
                <span>Next: Sample Work Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Photo & Launch */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#29251F]">
                Sample Craft Photo & Activation
              </h2>
              <p className="text-xs text-[#777066] mt-1">
                Upload or preview a photograph from your current workshop inventory.
              </p>
            </div>

            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative border-2 border-dashed border-[#D4C8B8] bg-[#FAF7F1] flex items-center justify-center">
                {photoPreview ? (
                  <Image src={photoPreview} alt="" fill className="object-cover" />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Camera className="w-8 h-8 mx-auto text-[#76513B]" />
                    <span className="text-xs text-[#777066] block">
                      Drag and drop craft photograph here
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-5 h-5 text-[#78816A] shrink-0" />
                <span>
                  By activating your studio, you agree to Kaarigar&apos;s Fair Trade Charter and Authentic Provenance standards.
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-full border border-[#D4C8B8] text-xs font-semibold text-[#29251F]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center justify-center gap-2 shadow-md"
              >
                <span>Complete Onboarding & Enter Studio</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
