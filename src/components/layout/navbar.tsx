"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Heart,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useCart } from "@/features/cart/cart-context";
import { useLocation } from "@/components/layout/location-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { cn } from "@/lib/utilities/cn";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchRole, logout, loginGoogle } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { city, state, setLocation } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Discover", href: "/marketplace" },
    { label: "Products", href: "/marketplace" },
    { label: "Artisans", href: "/artisans" },
    { label: "Stories", href: "/about" },
    { label: "About", href: "/about" },
  ];

  const indianCities = [
    { city: "Bhopal", state: "MP" },
    { city: "Jaipur", state: "RJ" },
    { city: "Varanasi", state: "UP" },
    { city: "Bastar", state: "CG" },
    { city: "New Delhi", state: "DL" },
    { city: "Mumbai", state: "MH" },
    { city: "Bengaluru", state: "KA" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F1]/95 backdrop-blur-md border-b border-[#E8E0D5]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Left: Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {/* Traditional Indian Handicraft / Floral Knot Emblem */}
            <div className="w-10 h-10 rounded-xl bg-[#76513B] text-[#FAF7F1] flex items-center justify-center shadow-sm group-hover:bg-[#5E3E2A] transition-colors">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 stroke-current fill-none stroke-[1.8]"
              >
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#29251F]">
                Kaarigar
              </span>
              <span className="text-[10px] tracking-wider text-[#777066] uppercase font-medium">
                Artisans • People • Opportunities
              </span>
            </div>
          </Link>

          {/* 2. Center: Navigation Pills */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#F4EFE6]/80 p-1 rounded-full border border-[#E8E0D5]">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href) && link.href !== "/";

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                    isActive
                      ? "bg-white text-[#29251F] shadow-sm font-semibold"
                      : "text-[#777066] hover:text-[#29251F] hover:bg-white/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-sm lg:max-w-md"
          >
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777066] pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handmade products, artisans or categories..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white text-[#29251F] border border-[#E8E0D5] rounded-full placeholder:text-[#9C9488] focus:outline-none focus:border-[#76513B] focus:ring-2 focus:ring-[#76513B]/15 transition-all shadow-sm"
            />
          </form>

          {/* 4. Right: Location, Cart, and Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Location Selector */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 text-xs text-[#29251F] hover:text-[#76513B] py-1 px-2 rounded-lg transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#76513B]" />
                <span className="font-medium whitespace-nowrap">
                  {city}, {state}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#777066]" />
              </button>

              {isLocationOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E8E0D5] p-2 z-50">
                  <div className="text-[11px] font-semibold text-[#777066] px-2 py-1 uppercase tracking-wider">
                    Select Your Region
                  </div>
                  {indianCities.map((item) => (
                    <button
                      key={item.city}
                      onClick={() => {
                        setLocation(item.city, item.state);
                        setIsLocationOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-xs rounded-lg flex items-center justify-between hover:bg-[#FAF7F1] transition-colors",
                        city === item.city && "text-[#76513B] font-semibold bg-[#FAF7F1]"
                      )}
                    >
                      <span>
                        {item.city}, {item.state}
                      </span>
                      {city === item.city && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="hidden sm:flex relative p-2 text-[#29251F] hover:text-[#76513B] transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#76513B]" />
              )}
            </Link>

            {/* Shopping Cart Pill */}
            <Link
              href="/cart"
              className="relative p-2 text-[#29251F] hover:text-[#76513B] transition-colors group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8] group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#A65636] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile Pill / Menu */}
            <div className="relative">
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-white border border-[#E8E0D5] rounded-full hover:border-[#76513B]/40 transition-all shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-[#76513B]/10 relative border border-[#E8E0D5]">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 m-1.5 text-[#76513B]" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#29251F] hidden sm:inline-block">
                    Hello, {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#777066]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loginGoogle}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#76513B] text-white rounded-full hover:bg-[#5E3E2A] transition-colors shadow-sm"
                >
                  Sign In
                </button>
              )}

              {/* Profile Dropdown */}
              {isProfileOpen && user && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8E0D5] p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#F0EBE1] mb-1">
                    <p className="text-xs font-semibold text-[#29251F]">{user.name}</p>
                    <p className="text-[11px] text-[#777066] truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#76513B]">
                        {role || "Customer"}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <Link
                      href="/account"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#29251F] hover:bg-[#FAF7F1]"
                    >
                      <UserIcon className="w-4 h-4 text-[#777066]" />
                      My Account & Orders
                    </Link>

                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#29251F] hover:bg-[#FAF7F1]"
                    >
                      <Heart className="w-4 h-4 text-[#777066]" />
                      Saved Wishlist
                    </Link>

                    {/* Artisan Portal Shortcut */}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#76513B] hover:bg-[#FAF7F1] font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#76513B]" />
                      Artisan Studio Portal
                    </Link>

                    {/* AI Catalogue Studio */}
                    <Link
                      href="/dashboard/ai-catalogue"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#A66B4D] hover:bg-[#FAF7F1] font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-[#A66B4D]" />
                      AI Catalogue Studio
                    </Link>

                    {/* Admin Portal Shortcut */}
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#78816A] hover:bg-[#FAF7F1]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#78816A]" />
                      Admin Governance
                    </Link>
                  </div>

                  {/* Role Switcher for seamless Pair Programming & Demo */}
                  <div className="border-t border-[#F0EBE1] pt-2 px-3 py-1">
                    <span className="text-[10px] uppercase font-semibold text-[#777066] flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" /> Quick Switch Role
                    </span>
                    <div className="flex gap-1 mt-1.5">
                      {(["customer", "artisan", "admin"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setIsProfileOpen(false);
                          }}
                          className={cn(
                            "flex-1 text-[11px] py-1 rounded-md capitalize font-medium transition-colors border",
                            role === r
                              ? "bg-[#76513B] text-white border-[#76513B]"
                              : "bg-[#FAF7F1] text-[#777066] border-[#E8E0D5] hover:border-[#76513B]"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#F0EBE1] mt-2 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 rounded-lg hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-[#29251F] hover:text-[#76513B]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF7F1] border-b border-[#E8E0D5] px-4 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#777066]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, artisans..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-full border border-[#E8E0D5]"
            />
          </form>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-[#29251F] hover:bg-[#EFE9DF] rounded-xl"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E8E0D5] flex items-center justify-between text-xs">
            <span className="text-[#777066]">Location:</span>
            <span className="font-semibold text-[#76513B]">{city}, {state}</span>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-semibold bg-[#76513B] text-white rounded-xl"
            >
              Artisan Studio
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-semibold bg-[#78816A] text-white rounded-xl"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
