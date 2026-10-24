import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { api } from "@/lib/api/client";
import { ProductDetailClient } from "./product-detail-client";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Kaarigar AI",
    };
  }

  return {
    title: `${product.title} | Kaarigar AI`,
    description: product.description,
    openGraph: {
      title: `${product.title} — Handcrafted by ${product.artisan.name}`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await api.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const { items: allCategoryProducts } = await api.getProducts({
    category: product.category,
  });

  const relatedProducts = allCategoryProducts.filter((p) => p.id !== product.id);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
