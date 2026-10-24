import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import { api } from "@/lib/api/client";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = await api.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { items: products } = await api.getProducts({ category: slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#777066]">
        <Link href="/" className="hover:text-[#76513B]">Home</Link>
        <span>/</span>
        <Link href="/marketplace" className="hover:text-[#76513B]">Marketplace</Link>
        <span>/</span>
        <span className="text-[#29251F] font-semibold">{category.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#2D211A] text-white p-8 sm:p-12 shadow-md">
        <div className="relative z-10 max-w-xl space-y-3">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs text-[#E2D5C7] hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <span className="text-[11px] uppercase tracking-widest text-[#C28E46] font-bold block">
            Craft Tradition
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#E2D5C7] leading-relaxed">
            {category.description}
          </p>
          <div className="pt-1 text-xs text-[#C4CDBC] font-medium">
            {products.length} Masterpiece{products.length === 1 ? "" : "s"} Available
          </div>
        </div>

        {/* Background Visual Texture */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden sm:block">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F]">
          Curated {category.name} Collection
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8E0D5] p-12 text-center text-xs text-[#777066]">
            No products currently in stock for this category. Check back soon for the next artisan batch!
          </div>
        )}
      </div>
    </div>
  );
}
