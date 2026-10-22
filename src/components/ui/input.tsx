import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utilities/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  isPill?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, isPill = false, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full bg-white text-[#29251F] border border-[#E8E0D5] px-4 py-2.5 text-sm transition-all placeholder:text-[#9C9488] focus:outline-none focus:border-[#76513B] focus:ring-2 focus:ring-[#76513B]/20 disabled:opacity-50 disabled:bg-[#FAF7F1]",
            isPill ? "rounded-full" : "rounded-xl",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
