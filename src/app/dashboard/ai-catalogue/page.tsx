"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Camera,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Tag,
  DollarSign,
  Layers,
  FileText,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { AICatalogueResult, Product } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function AICatalogueStudioPage() {
  const router = useRouter();

  const samplePhotos = [
    {
      id: "pottery",
      title: "Molela Terracotta Lamp",
      image: "/images/products/handpainted-lamp.webp",
      category: "home-decor",
    },
    {
      id: "wood",
      title: "Bastar Carved Elephant",
      image: "/images/products/wooden-elephant.webp",
      category: "handicrafts",
    },
    {
      id: "textile",
      title: "Chanderi Silk Brocade",
      image: "/images/products/chanderi-saree.webp",
      category: "textiles",
    },
  ];

  const [selectedPhoto, setSelectedPhoto] = useState(samplePhotos[0].image);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<AICatalogueResult | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);

  // Editable fields
  const [editableTitle, setEditableTitle] = useState("");
  const [editableStory, setEditableStory] = useState("");
  const [editablePrice, setEditablePrice] = useState<number>(0);
  const [editableCategory, setEditableCategory] = useState("home-decor");

  const startAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 600);
    setTimeout(() => setAnalysisStep(3), 1200);

    setTimeout(async () => {
      const res = await api.analyzeCraftPhoto(selectedPhoto);
      setResult(res);
      setEditableTitle(res.suggestedTitle);
      setEditableStory(res.heritageStory);
      setEditablePrice(res.recommendedPrice);
      setEditableCategory(res.suggestedCategory);
      setAnalyzing(false);
      setAnalysisStep(4);
    }, 1800);
  };

  const handlePublish = async () => {
    if (!result) return;
    setPublishing(true);
    try {
      const newProduct = await api.addArtisanProduct({
        title: editableTitle || result.suggestedTitle,
        description: editableStory || result.heritageStory,
        price: Number(editablePrice) || result.recommendedPrice,
        category: editableCategory || result.suggestedCategory,
        images: [selectedPhoto],
        materials: result.detectedMaterials,
        craftTechnique: result.craftTechnique,
        tags: result.tags,
      });

      setPublishedProduct(newProduct);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Studio Header */}
      <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DF] text-[#76513B] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Indigenous Vision & Language Model</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
              AI Catalogue Studio
            </h1>
            <p className="text-xs text-[#777066] mt-1 max-w-xl">
              Turn raw workshop photographs into complete, poetic, fair-wage marketplace listings in under 30 seconds.
            </p>
          </div>
        </div>
      </div>

      {publishedProduct ? (
        <div className="bg-white rounded-3xl border border-[#78816A] p-8 text-center space-y-4 shadow-sm animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#E5F0DF] text-[#436A31] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Masterpiece Successfully Published!
          </h2>
          <p className="text-xs text-[#777066] max-w-md mx-auto">
            Your craft piece <strong className="text-[#29251F]">{publishedProduct.title}</strong> is now live on the Kaarigar marketplace with verified fair pricing.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href={`/product/${publishedProduct.slug}`}
              className="px-6 py-2.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A]"
            >
              View Live Marketplace Listing
            </Link>
            <button
              type="button"
              onClick={() => {
                setPublishedProduct(null);
                setResult(null);
              }}
              className="px-5 py-2.5 rounded-full border border-[#D4C8B8] text-xs font-semibold text-[#29251F] hover:bg-[#FAF7F1]"
            >
              Catalogue Another Craft
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Photo Upload / Selection */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#29251F]">
                1. Select or Upload Craft Photo
              </h2>

              {/* Main Photo Preview */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#E8E0D5] bg-[#FAF7F1]">
                <Image
                  src={selectedPhoto}
                  alt="Selected craft to catalogue"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Sample Photo Pickers */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#777066] block">
                  Select a workshop sample:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {samplePhotos.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(s.image);
                        setResult(null);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedPhoto === s.image
                          ? "border-[#76513B] ring-2 ring-[#76513B]/20"
                          : "border-[#E8E0D5] opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image src={s.image} alt={s.title} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                type="button"
                disabled={analyzing}
                onClick={startAnalysis}
                className="w-full py-3.5 px-6 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Craft Motifs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze with Kaarigar AI</span>
                  </>
                )}
              </button>

              {/* Step indicator while analyzing */}
              {analyzing && (
                <div className="p-3 bg-[#FAF7F1] rounded-xl text-xs space-y-2 border border-[#E8E0D5]">
                  <div className="flex items-center gap-2 text-[#76513B] font-semibold">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>
                      {analysisStep === 1
                        ? "Scanning texture, clay composition, and motifs..."
                        : analysisStep === 2
                        ? "Extracting cultural heritage narrative..."
                        : "Calculating fair living wage algorithm..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Output & Listing Customization */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#78816A]">
                      AI Generation Complete
                    </span>
                    <h2 className="font-serif text-lg font-bold text-[#29251F]">
                      Review & Publish Listing
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E5F0DF] text-[#436A31] text-xs font-bold">
                    ✓ Verified Standards
                  </span>
                </div>

                {/* Form fields */}
                <div className="space-y-4 text-xs">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="font-semibold text-[#29251F] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#76513B]" />
                      Craft Title
                    </label>
                    <input
                      type="text"
                      value={editableTitle}
                      onChange={(e) => setEditableTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl font-medium focus:outline-none focus:border-[#76513B]"
                    />
                  </div>

                  {/* Heritage Story */}
                  <div className="space-y-1">
                    <label className="font-semibold text-[#29251F] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#A66B4D]" />
                      Heritage Narrative & Story
                    </label>
                    <textarea
                      rows={4}
                      value={editableStory}
                      onChange={(e) => setEditableStory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl font-serif text-xs leading-relaxed focus:outline-none focus:border-[#76513B]"
                    />
                  </div>

                  {/* Materials & Technique detected */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-2">
                    <span className="font-bold text-[#29251F] block">
                      AI Detected Craft Technique:
                    </span>
                    <p className="text-[#76513B] font-semibold">{result.craftTechnique}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.detectedMaterials.map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E0D5] text-[#29251F] text-[11px]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fair Wage Pricing Breakdown Algorithm */}
                  <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E0D7C9] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#29251F] flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-[#76513B]" />
                        Fair Living Wage Computation
                      </span>
                      <span className="text-[10px] text-[#78816A] font-bold">
                        Ethical Price Algorithm
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="bg-white/80 p-2 rounded-xl">
                        <span className="text-[#777066] block">Materials</span>
                        <strong className="text-[#29251F]">
                          {formatINR(result.pricingBreakdown.materials)}
                        </strong>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl">
                        <span className="text-[#777066] block">Craft Labor</span>
                        <strong className="text-[#29251F]">
                          {result.pricingBreakdown.laborHours} hrs
                        </strong>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl">
                        <span className="text-[#777066] block">Hourly Rate</span>
                        <strong className="text-[#29251F]">
                          {formatINR(result.pricingBreakdown.fairLivingWagePerHour)}/hr
                        </strong>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl">
                        <span className="text-[#777066] block">Artisan Margin</span>
                        <strong className="text-[#436A31]">
                          +{formatINR(result.pricingBreakdown.fairArtisanMargin)}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#D4C8B8] flex items-center justify-between">
                      <label className="font-bold text-xs text-[#29251F]">
                        Listing Price (INR)
                      </label>
                      <input
                        type="number"
                        value={editablePrice}
                        onChange={(e) => setEditablePrice(Number(e.target.value))}
                        className="w-32 px-3 py-1.5 bg-white border border-[#D4C8B8] rounded-xl font-bold text-sm text-[#29251F] text-right"
                      />
                    </div>
                  </div>
                </div>

                {/* Publish CTA */}
                <button
                  type="button"
                  disabled={publishing}
                  onClick={handlePublish}
                  className="w-full py-3.5 px-6 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {publishing ? (
                    <span>Publishing to Marketplace...</span>
                  ) : (
                    <>
                      <span>1-Click Publish to Kaarigar Marketplace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E8E0D5] p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F1] text-[#76513B] mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#29251F]">
                  Ready for AI Craft Extraction
                </h3>
                <p className="text-xs text-[#777066] max-w-sm mx-auto">
                  Click &ldquo;Analyze with Kaarigar AI&rdquo; on the left to extract cultural storytelling, technical classification, and fair-wage price breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
