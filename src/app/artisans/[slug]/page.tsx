import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Award, MapPin, Star, Sparkles, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api/client";
import { ProductCard } from "@/components/marketplace/product-card";

interface ArtisanPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArtisanDetailPage({ params }: ArtisanPageProps) {
  const { slug } = await params;
  const artisan = await api.getArtisanBySlug(slug);

  if (!artisan) {
    notFound();
  }

  const products = await api.getArtisanProducts(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#777066]">
        <Link href="/" className="hover:text-[#76513B]">Home</Link>
        <span>/</span>
        <Link href="/artisans" className="hover:text-[#76513B]">Artisans</Link>
        <span>/</span>
        <span className="text-[#29251F] font-semibold">{artisan.name}</span>
      </div>

      {/* Hero Artisan Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-10 shadow-craft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FAF7F1] shadow-lg relative bg-[#EFE9DF]">
            <Image
              src={artisan.avatar}
              alt={artisan.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
                {artisan.name}
              </h1>
              {artisan.isVerified && (
                <Award className="w-5 h-5 text-[#78816A]" />
              )}
            </div>
            <p className="text-xs font-semibold text-[#76513B] mt-0.5">
              {artisan.craft}
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-[#777066] mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{artisan.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs pt-2">
            <div>
              <span className="font-bold text-base text-[#29251F] block">
                {artisan.yearsOfExperience}
              </span>
              <span className="text-[#777066] text-[11px]">Years Practice</span>
            </div>
            <div className="h-8 w-px bg-[#E8E0D5]" />
            <div>
              <div className="flex items-center justify-center gap-1 font-bold text-base text-[#29251F]">
                <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                <span>{artisan.rating}</span>
              </div>
              <span className="text-[#777066] text-[11px]">({artisan.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio & Craft Story */}
        <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-[#E8E0D5] pt-6 lg:pt-0 lg:pl-8">
          <span className="text-xs uppercase font-bold tracking-wider text-[#A66B4D]">
            Craft Heritage & Lineage
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F]">
            {artisan.craftHeritage}
          </h2>
          <p className="text-xs sm:text-sm text-[#777066] leading-relaxed">
            {artisan.bio}
          </p>

          {artisan.quote && (
            <blockquote className="p-4 rounded-2xl bg-[#FAF7F1] border-l-4 border-[#76513B] text-xs sm:text-sm italic text-[#29251F] font-serif">
              &ldquo;{artisan.quote}&rdquo;
            </blockquote>
          )}

          {artisan.awards && (
            <div className="pt-2">
              <span className="text-xs font-bold text-[#29251F] block mb-1.5">
                Recognitions & Honors:
              </span>
              <div className="flex flex-wrap gap-2">
                {artisan.awards.map((award, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[#FAF7F1] border border-[#E8E0D5] text-xs text-[#76513B] font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#A66B4D]" />
                    {award}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Artisan's Handcrafted Pieces */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#29251F]">
              Handcrafted Collection by {artisan.name}
            </h2>
            <p className="text-xs text-[#777066] mt-0.5">
              Available direct from the workshop in {artisan.location}.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#76513B]">
            {products.length} {products.length === 1 ? "Piece" : "Pieces"}
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8E0D5] p-10 text-center text-xs text-[#777066]">
            This artisan is currently crafting new pieces. Contact our outreach team to place a custom bespoke order.
          </div>
        )}
      </div>
    </div>
  );
}
