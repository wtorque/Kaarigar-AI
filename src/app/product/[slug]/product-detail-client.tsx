"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { formatINR } from "@/lib/utilities/cn";
import { ProductCard } from "@/components/marketplace/product-card";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#777066]">
        <Link href="/" className="hover:text-[#76513B]">Home</Link>
        <span>/</span>
        <Link href="/marketplace" className="hover:text-[#76513B]">Marketplace</Link>
        <span>/</span>
        <Link href={`/marketplace/${product.category}`} className="hover:text-[#76513B] capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#29251F] font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main PDP Grid: Gallery (Left) & Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E8E0D5] bg-[#FAF7F1] shadow-craft">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-all duration-300"
            />
            
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white text-[#29251F] shadow-sm transition-all"
              aria-label="Toggle wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? "fill-[#76513B] text-[#76513B]" : "stroke-[1.8]"
                }`}
              />
            </button>
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-[#76513B] ring-2 ring-[#76513B]/20"
                      : "border-[#E8E0D5] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Buy Actions & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Info */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#A66B4D]">
              {product.subCategory || product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#29251F]">
              {product.title}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-[#D97706] text-[#D97706]"
                        : "text-[#D4C8B8]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#29251F]">{product.rating}</span>
              <span className="text-xs text-[#777066]">({product.reviewsCount} verified reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#29251F]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#9C9488] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#78816A] font-medium block mt-0.5">
                Inclusive of all taxes • 100% directly supports the artisan
              </span>
            </div>

            {product.inStock ? (
              <span className="px-2.5 py-1 rounded-full bg-[#E5F0DF] text-[#436A31] text-xs font-semibold">
                In Stock ({product.stockCount} left)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-black/10 text-[#777066] text-xs font-semibold">
                Backorder Available
              </span>
            )}
          </div>

          {/* Product Description */}
          <p className="text-xs sm:text-sm text-[#777066] leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E8E0D5] rounded-full bg-white px-3 py-1.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-sm font-bold text-[#777066] hover:text-[#29251F] px-2"
                >
                  -
                </button>
                <span className="text-xs font-bold px-3 text-[#29251F]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-sm font-bold text-[#777066] hover:text-[#29251F] px-2"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#76513B] text-white text-xs sm:text-sm font-semibold hover:bg-[#5E3E2A] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-[#C4CDBC]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({formatINR(product.price * quantity)})</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href="/cart"
              className="block w-full py-3 rounded-full border border-[#76513B] text-[#76513B] text-center text-xs font-semibold hover:bg-[#FAF7F1] transition-colors"
            >
              Go to Checkout
            </Link>
          </div>

          {/* Meet The Artisan Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E0D5] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777066]">
                Artisan Provenance
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#78816A] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Master Maker
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FAF7F1] shrink-0 border border-[#E8E0D5]">
                <Image
                  src={product.artisan.avatar}
                  alt={product.artisan.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#29251F]">
                  {product.artisan.name}
                </h4>
                <p className="text-xs text-[#777066]">
                  {product.artisan.location}
                </p>
              </div>
            </div>

            <Link
              href={`/artisans/${product.artisan.slug}`}
              className="flex items-center justify-between text-xs font-semibold text-[#76513B] hover:underline pt-1"
            >
              <span>Explore {product.artisan.name}&apos;s Workshop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Craft Specifications Accordion / Details */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-1.5">
              <span className="font-bold text-[#29251F] block">Materials & Heritage Technique</span>
              <p className="text-[#777066]">{product.craftTechnique}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.materials.map((m, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white text-[#76513B] border border-[#E8E0D5] text-[11px]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {product.dimensions && (
              <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-1">
                <span className="font-bold text-[#29251F] block">Dimensions</span>
                <p className="text-[#777066]">{product.dimensions}</p>
              </div>
            )}

            {product.careInstructions && (
              <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-1">
                <span className="font-bold text-[#29251F] block">Care Instructions</span>
                <p className="text-[#777066]">{product.careInstructions}</p>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-[#777066]">
            <div className="p-2.5 rounded-xl bg-white border border-[#E8E0D5] space-y-1">
              <Truck className="w-4 h-4 mx-auto text-[#76513B]" />
              <span>Safe Express Delivery</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#E8E0D5] space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-[#78816A]" />
              <span>100% Authentic Handcraft</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#E8E0D5] space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-[#A66B4D]" />
              <span>7-Day Return Window</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-[#E8E0D5] space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            More Handcrafted Pieces You May Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
