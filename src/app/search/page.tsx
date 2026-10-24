"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, ArrowRight, X } from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import { api } from "@/lib/api/client";
import { Product } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputVal(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    api.getProducts({ query: query.trim() }).then((res) => {
      setResults(res.items);
      setLoading(false);
    });
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
          Search Handicrafts & Artisans
        </h1>
        <p className="text-xs sm:text-sm text-[#777066]">
          Search for materials, craft styles, regional motifs, or master makers.
        </p>

        {/* Search Bar Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <SearchIcon className="w-5 h-5 absolute left-4 text-[#777066]" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search wooden elephant, silk saree, terracotta vase..."
            className="w-full pl-12 pr-28 py-3.5 text-sm bg-white rounded-full border border-[#E8E0D5] shadow-sm focus:outline-none focus:border-[#76513B] focus:ring-2 focus:ring-[#76513B]/20"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => {
                setInputVal("");
                router.push("/search");
              }}
              className="absolute right-20 text-[#777066] hover:text-[#29251F]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A]"
          >
            Search
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-[#777066]">
          <span>Popular searches:</span>
          {["Elephant", "Chanderi", "Terracotta", "Jhumka", "Madhubani", "Diya"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setInputVal(term);
                router.push(`/search?q=${encodeURIComponent(term)}`);
              }}
              className="px-2.5 py-1 rounded-full bg-[#FAF7F1] border border-[#E8E0D5] text-[#76513B] hover:bg-[#EFE9DF]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D5]">
          <h2 className="text-sm font-semibold text-[#29251F]">
            Results for &ldquo;<span className="text-[#76513B]">{query}</span>&rdquo; ({results.length})
          </h2>
          <Link
            href="/marketplace"
            className="text-xs text-[#76513B] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[#777066]">Searching crafts...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="bg-white rounded-3xl border border-[#E8E0D5] p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-[#29251F]">
            No handcrafted pieces matched &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs text-[#777066]">
            Try searching for broader keywords like &quot;wood&quot;, &quot;silk&quot;, or &quot;pottery&quot;.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777066]">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
