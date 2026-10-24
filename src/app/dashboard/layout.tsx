"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Sparkles,
  Package,
  PlusCircle,
  Boxes,
  Truck,
  TrendingUp,
  Settings,
  ArrowLeft,
  Award,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, role, switchRole, logout } = useAuth();

  const navItems = [
    { label: "Studio Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "AI Catalogue Studio",
      href: "/dashboard/ai-catalogue",
      icon: Sparkles,
      highlight: true,
    },
    { label: "Product Inventory", href: "/dashboard/products", icon: Package },
    { label: "Add New Product", href: "/dashboard/products/new", icon: PlusCircle },
    { label: "Stock Alerts", href: "/dashboard/inventory", icon: Boxes },
    { label: "Incoming Orders", href: "/dashboard/orders", icon: Truck },
    { label: "Sales & Insights", href: "/dashboard/insights", icon: TrendingUp },
    { label: "Payouts & Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col">
      {/* Studio Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E0D5] px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#777066] hover:text-[#76513B] font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </Link>
          <div className="h-4 w-px bg-[#E8E0D5]" />
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#29251F]">
              Kaarigar Artisan Studio
            </span>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5F0DF] text-[#436A31]">
              <Award className="w-3 h-3" />
              Verified Workshop
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ai-catalogue"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Catalogue Assistant</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-[#E8E0D5]">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FAF7F1] border border-[#E8E0D5] relative">
              <Image
                src={user?.avatar || "/images/artisans/suresh.webp"}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-[#29251F] hidden md:inline-block">
              {user?.name || "Artisan Workshop"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Shell: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Studio Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-2.5 space-y-1 shadow-sm sticky top-20">
            <div className="px-3 py-2 text-[11px] font-bold text-[#777066] uppercase tracking-wider">
              Studio Operations
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#76513B] text-white shadow-sm"
                      : item.highlight
                      ? "text-[#76513B] bg-[#FAF7F1] hover:bg-[#EFE9DF]"
                      : "text-[#777066] hover:text-[#29251F] hover:bg-[#FAF7F1]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#76513B] text-white">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#F0EBE1] space-y-1">
              <Link
                href="/marketplace"
                className="flex items-center justify-between px-3.5 py-2 text-xs text-[#777066] hover:text-[#29251F] rounded-xl hover:bg-[#FAF7F1]"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 rounded-xl hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Studio</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Studio Content Area */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
