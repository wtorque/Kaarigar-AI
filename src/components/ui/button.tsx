"use client";

import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utilities/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isPill?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isPill = false,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76513B]/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#76513B] text-white hover:bg-[#5E3E2A] shadow-sm hover:shadow-md",
      secondary:
        "bg-[#A66B4D] text-white hover:bg-[#8F5538] shadow-sm",
      outline:
        "border border-[#D4C8B8] text-[#29251F] hover:bg-[#EFE9DF] hover:border-[#76513B]/40",
      ghost:
        "text-[#76513B] hover:bg-[#76513B]/10",
      link:
        "text-[#76513B] underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    const roundedStyle = isPill ? "rounded-full" : size === "icon" ? "rounded-full" : "rounded-xl";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], roundedStyle, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
