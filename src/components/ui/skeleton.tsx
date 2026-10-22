import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utilities/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-[#EBE4D8]/70", className)}
      {...props}
    />
  );
}
