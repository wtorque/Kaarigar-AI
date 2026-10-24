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
  LayoutDashboard,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useCart } from "@/features/cart/cart-context";
import { useLocation } from "@/components/layout/location-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { cn } from "@/lib/utilities/cn";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, loginGoogle } = useAuth();
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
    <header className="sticky top-0 z-50 bg-[#FAF7F1] border-b border-[#E7DED2]/90">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-5">
          
          {/* 1. Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-6 lg:gap-7 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Ornate Indian handicraft emblem icon */}
              <div className="w-8 h-8 rounded-lg bg-[#302117] text-[#FAF7F1] flex items-center justify-center shadow-xs group-hover:bg-[#4A3425] transition-colors shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-current fill-none stroke-[1.7]"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
                  <rect x="7" y="7" width="10" height="10" rx="2" strokeWidth="1.2" transform="rotate(45 12 12)" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#29221C] leading-none">
                  Kaarigar
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.14em] text-[#82776C] uppercase font-medium mt-0.5">
                  Artisans • People • Opportunities
                </span>
              </div>
            </Link>

            {/* 2. Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
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
                      "text-xs transition-colors py-1.5",
                      isActive
                        ? "px-3.5 rounded-full bg-[#EFE8DD] text-[#29221C] font-semibold shadow-2xs"
                        : "px-2.5 text-[#5A5046] hover:text-[#29221C] font-medium"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 3. Center: Wider Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-[340px] lg:max-w-[420px]"
          >
            <div className="w-full flex items-center bg-white border border-[#E7DED2] rounded-full px-3.5 py-1.5 shadow-2xs focus-within:border-[#70472F] focus-within:ring-1 focus-within:ring-[#70472F]/20 transition-all">
              <Search className="w-3.5 h-3.5 text-[#82776C] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search handmade products, artisans or categories..."
                className="w-full pl-2 text-[11px] text-[#29221C] placeholder:text-[#82776C] bg-transparent focus:outline-none"
              />
            </div>
          </form>

          {/* 4. Far Right: Location, Cart, Profile, and Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            
            {/* Location Selector (Desktop/Tablet) */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 text-xs text-[#29221C] hover:text-[#70472F] py-1 px-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#70472F]" />
                <span className="font-medium whitespace-nowrap">
                  {city}, {state}
                </span>
                <ChevronDown className="w-3 h-3 text-[#82776C]" />
              </button>

              {isLocationOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E7DED2] p-2 z-50">
                  <div className="text-[10px] font-semibold text-[#82776C] px-2 py-1 uppercase tracking-wider">
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
                        city === item.city && "text-[#70472F] font-semibold bg-[#FAF7F1]"
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

            {/* Shopping Cart Pill */}
            <Link
              href="/cart"
              className="relative p-1 text-[#29221C] hover:text-[#70472F] transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.8]" />
              <span className="absolute -top-1 -right-1.5 min-w-[15px] h-3.5 sm:h-4 px-1 bg-[#C24128] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {itemCount > 0 ? itemCount : 3}
              </span>
            </Link>

            {/* User Profile Pill / Menu */}
            <div className="relative">
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 p-1 sm:pr-2.5 bg-white border border-[#E7DED2] rounded-full hover:border-[#70472F]/40 transition-all shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-[#FAF7F1] relative ring-1 ring-[#70472F]/20 shrink-0">
                    <Image
                      src={user.avatar || "/images/artisans/harshh.webp"}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#29221C] hidden md:inline-block">
                    Hello, {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#82776C] hidden md:inline-block" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loginGoogle}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#302117] text-white rounded-full hover:bg-[#4A3425] transition-colors shadow-2xs"
                >
                  Sign In
                </button>
              )}

              {/* Profile Dropdown */}
              {isProfileOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E7DED2] p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#F0E8DC] mb-1">
                    <p className="text-xs font-semibold text-[#29221C]">{user.name}</p>
                    <p className="text-[11px] text-[#82776C] truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EFE8DD] text-[#70472F]">
                        {role || "Customer"}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <Link
                      href="/account"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#29221C] hover:bg-[#FAF7F1]"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#82776C]" />
                      My Account & Orders
                    </Link>

                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#29221C] hover:bg-[#FAF7F1]"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#82776C]" />
                      Saved Wishlist ({wishlistItems.length})
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#70472F] hover:bg-[#FAF7F1] font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#70472F]" />
                      Artisan Studio
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-left mt-1 pt-2 border-t border-[#F0E8DC]"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-[#29221C] hover:bg-[#EFE8DD] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E7DED2] py-4 space-y-3 bg-[#FAF7F1]">
            <form onSubmit={handleSearchSubmit} className="px-2">
              <div className="flex items-center bg-white border border-[#E7DED2] rounded-full px-3 py-2 shadow-2xs">
                <Search className="w-4 h-4 text-[#82776C] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, artisans..."
                  className="w-full pl-2 text-xs bg-transparent text-[#29221C] focus:outline-none"
                />
              </div>
            </form>

            <nav className="flex flex-col space-y-1 px-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-[#29221C] rounded-lg hover:bg-[#EFE8DD] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
