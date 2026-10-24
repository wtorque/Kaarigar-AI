"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Package,
  Truck,
  FileText,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, role, switchRole } = useAuth();

  const navItems = [
    { label: "Governance Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Artisan KYC Verifications", href: "/admin/artisans", icon: Users },
    { label: "Product Moderation", href: "/admin/products", icon: Package },
    { label: "Platform Orders", href: "/admin/orders", icon: Truck },
    { label: "Security & Audit Logs", href: "/admin/audit-logs", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#1F2421] text-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#A8B2A6] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-white">
              Kaarigar Curator Governance
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#78816A] text-white text-[10px] font-bold">
              Level-2 Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => switchRole("customer")}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#E8E0D5]"
          >
            Switch to Patron View
          </button>
        </div>
      </header>

      {/* Main Shell */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-2.5 space-y-1 shadow-sm sticky top-20">
            <div className="px-3 py-2 text-[11px] font-bold text-[#777066] uppercase tracking-wider">
              Governance & Oversight
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#78816A] text-white shadow-sm"
                      : "text-[#777066] hover:text-[#29251F] hover:bg-[#FAF7F1]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#F0EBE1]">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 rounded-xl hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
