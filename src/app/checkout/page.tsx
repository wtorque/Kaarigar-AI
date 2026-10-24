"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Truck,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { useAuth } from "@/features/auth/auth-context";
import { formatINR } from "@/lib/utilities/cn";
import { api } from "@/lib/api/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, discount, shipping, total, clearCart } = useCart();

  const [fullName, setFullName] = useState(user?.name || "Harshh");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [street, setStreet] = useState(user?.address?.street || "Plot 42, Gulmohar Enclave, Arera Colony");
  const [city, setCity] = useState(user?.address?.city || "Bhopal");
  const [state, setState] = useState(user?.address?.state || "Madhya Pradesh");
  const [pincode, setPincode] = useState(user?.address?.pincode || "462016");

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    if (!street.trim()) errs.street = "Street address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!pincode.trim() || pincode.length !== 6) errs.pincode = "Enter a valid 6-digit PIN code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((item) => ({
          id: `item_${Date.now()}_${item.id}`,
          productId: item.productId,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          artisanName: item.product.artisan.name,
        })),
        subtotal,
        discount,
        shipping,
        total,
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          pincode,
        },
        paymentMethod,
      });

      clearCart();
      router.push(`/account/orders/${order.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-serif text-2xl font-bold text-[#29251F]">
          Your bag is empty
        </h1>
        <p className="text-xs text-[#777066]">
          Add handcrafted items to your bag before checking out.
        </p>
        <Link
          href="/marketplace"
          className="inline-block px-5 py-2.5 rounded-full bg-[#76513B] text-white text-xs font-semibold"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#777066]">
        <Link href="/" className="hover:text-[#76513B]">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#76513B]">Bag</Link>
        <span>/</span>
        <span className="text-[#29251F] font-semibold">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
                <div className="w-6 h-6 rounded-full bg-[#76513B] text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="font-serif text-lg font-bold text-[#29251F]">
                  Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29251F]">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29251F]">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                  {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[#29251F]">Street Address / House / Colony</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                  {errors.street && <p className="text-[11px] text-red-600">{errors.street}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29251F]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                  {errors.city && <p className="text-[11px] text-red-600">{errors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29251F]">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29251F]">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                  {errors.pincode && <p className="text-[11px] text-red-600">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
                <div className="w-6 h-6 rounded-full bg-[#76513B] text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h2 className="font-serif text-lg font-bold text-[#29251F]">
                  Select Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "upi",
                    title: "Instant UPI",
                    desc: "Google Pay, PhonePe, Paytm, BHIM",
                    icon: QrCode,
                  },
                  {
                    id: "card",
                    title: "Credit / Debit Card",
                    desc: "Visa, Mastercard, RuPay",
                    icon: CreditCard,
                  },
                  {
                    id: "netbanking",
                    title: "Net Banking",
                    desc: "All Major Indian Banks",
                    icon: Building,
                  },
                  {
                    id: "cod",
                    title: "Cash on Delivery",
                    desc: "Pay when craft arrives",
                    icon: Truck,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? "border-[#76513B] bg-[#FAF7F1] ring-1 ring-[#76513B]"
                          : "border-[#E8E0D5] hover:bg-[#FAF7F1]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id as any)}
                        className="mt-1 text-[#76513B] focus:ring-[#76513B]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#29251F]">
                          <Icon className="w-4 h-4 text-[#76513B]" />
                          <span>{m.title}</span>
                        </div>
                        <span className="text-[11px] text-[#777066] block mt-0.5">
                          {m.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#76513B] text-white text-sm font-semibold hover:bg-[#5E3E2A] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Securing your order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm & Place Order ({formatINR(total)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Review */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#29251F] pb-3 border-b border-[#F0EBE1]">
              Review Order Items ({items.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F1] border border-[#E8E0D5] relative shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-[#29251F] truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-[#777066]">
                      Qty: {item.quantity} × {formatINR(item.product.price)}
                    </p>
                  </div>
                  <div className="font-bold text-xs text-[#29251F]">
                    {formatINR(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] space-y-2 text-xs">
              <div className="flex justify-between text-[#777066]">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#436A31]">
                  <span>Craft Discount</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#777066]">
                <span>Insured Doorstep Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
              </div>
              <div className="pt-2 border-t border-[#F0EBE1] flex justify-between font-bold text-sm text-[#29251F]">
                <span>Total Due</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F1] rounded-xl text-[11px] text-[#78816A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Direct craft insurance with verified artisan invoice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
