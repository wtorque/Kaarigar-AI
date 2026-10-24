"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime client error intercepted:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E0D5] p-8 shadow-craft space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-xl font-bold text-[#29251F]">
            Something Interrupted the Loom
          </h2>
          <p className="text-xs text-[#777066]">
            We encountered a temporary interface glitch. Please try again.
          </p>
        </div>

        <div className="flex gap-2 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full border border-[#D4C8B8] text-xs font-semibold text-[#29251F] hover:bg-[#FAF7F1]"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
