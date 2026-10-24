"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const links = [
    { label: "Account Overview", href: "/account", icon: User },
    { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
    { label: "Saved Wishlist", href: "/account/wishlist", icon: Heart },
    { label: "Profile & Address", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F1]">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Account Header */}
        <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#FAF7F1] border-2 border-[#E8E0D5] relative">
              {user?.avatar ? (
                <Image src={user.avatar} alt="" fill className="object-cover" />
              ) : (
                <User className="w-8 h-8 text-[#76513B] m-4" />
              )}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#29251F]">
                {user?.name || "Patron Account"}
              </h1>
              <p className="text-xs text-[#777066]">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#76513B]">
                {role || "Customer"} Member
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Artisan Portal</span>
            </Link>
          </div>
        </div>

        {/* Layout Grid: Sidebar Navigation + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E8E0D5] p-2 space-y-1 shadow-sm">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-[#76513B] text-white shadow-sm"
                        : "text-[#777066] hover:text-[#29251F] hover:bg-[#FAF7F1]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-600 rounded-xl hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-9">{children}</section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
