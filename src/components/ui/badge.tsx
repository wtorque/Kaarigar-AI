import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utilities/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "accent" | "outline" | "gold";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#EFE9DF] text-[#76513B] border border-[#E0D7C9]",
    primary: "bg-[#76513B] text-white",
    secondary: "bg-[#A66B4D] text-white",
    accent: "bg-[#78816A]/15 text-[#555C4A] border border-[#78816A]/30",
    outline: "border border-[#D4C8B8] text-[#777066]",
    gold: "bg-[#FBF0D8] text-[#9A6A1E] border border-[#F0D59D]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
