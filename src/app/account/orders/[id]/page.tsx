"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  CreditCard,
  Sparkles,
  Download,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { Order } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrderById(id).then((res) => {
      setOrder(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#777066]">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E0D5] p-12 text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#29251F]">Order Not Found</h2>
        <Link href="/account/orders" className="text-xs text-[#76513B] font-semibold hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { title: "Order Placed", date: "Verified & Authorized", completed: true },
    { title: "Artisan Workshop Preparing", date: "Eco-friendly protective packing", completed: true },
    { title: "Handed over to Express Courier", date: order.trackingNumber || "DEL-984210IN", completed: order.status === "shipped" || order.status === "delivered" },
    { title: "Delivered to Doorstep", date: order.estimatedDelivery ? `Est. ${order.estimatedDelivery}` : "Pending", completed: order.status === "delivered" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE1]">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-[#76513B] font-semibold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#29251F]">
              Order #{order.orderNumber}
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#E5F0DF] text-[#436A31]">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#777066] mt-0.5">
            Placed on {new Date(order.date).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8E0D5] text-xs font-semibold text-[#29251F] hover:bg-[#FAF7F1]"
        >
          <Download className="w-3.5 h-3.5 text-[#76513B]" />
          <span>Print Artisan Invoice</span>
        </button>
      </div>

      {/* Tracking Progress Timeline */}
      <div className="bg-[#FAF7F1] rounded-2xl border border-[#E8E0D5] p-6 space-y-4">
        <h3 className="font-serif text-base font-bold text-[#29251F]">
          Consignment Tracking Timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((st, idx) => (
            <div key={idx} className="relative flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    st.completed
                      ? "bg-[#76513B] text-white"
                      : "bg-[#E8E0D5] text-[#777066]"
                  }`}
                >
                  {st.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold ${st.completed ? "text-[#29251F]" : "text-[#9C9488]"}`}>
                  {st.title}
                </span>
              </div>
              <p className="text-[11px] text-[#777066] pl-9">
                {st.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Items & Artisan Note */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-base font-bold text-[#29251F]">
            Handcrafted Items
          </h3>

          <div className="space-y-3">
            {order.items.map((it) => (
              <div
                key={it.id}
                className="p-3.5 rounded-2xl border border-[#E8E0D5] bg-white flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7F1] border border-[#E8E0D5] relative shrink-0">
                  <Image src={it.image} alt={it.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs space-y-0.5">
                  <h4 className="font-semibold text-sm text-[#29251F] truncate">
                    {it.title}
                  </h4>
                  <p className="text-[11px] text-[#777066]">
                    Direct from Maker: <strong className="text-[#76513B]">{it.artisanName}</strong>
                  </p>
                  <p className="text-[11px] text-[#777066]">
                    Quantity: {it.quantity} × {formatINR(it.price)}
                  </p>
                </div>
                <div className="font-bold text-sm text-[#29251F]">
                  {formatINR(it.price * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Artisan Personalized Note */}
          <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E0D7C9] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#76513B]">
              <Sparkles className="w-4 h-4" />
              <span>A Note from Our Artisan Workshop</span>
            </div>
            <p className="text-xs text-[#554D44] italic font-serif leading-relaxed">
              &ldquo;Thank you for supporting traditional Indian handcrafts. Your order enables our family to continue practicing our generational art form with pride and independence.&rdquo;
            </p>
          </div>
        </div>

        {/* Invoice & Shipping Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-[#29251F]">
              Delivery & Billing
            </h3>

            <div className="space-y-1">
              <span className="font-bold text-[#29251F] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#76513B]" />
                Shipping Destination:
              </span>
              <p className="text-[#777066] pl-4">
                {order.shippingAddress.fullName} <br />
                {order.shippingAddress.street} <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode} <br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E8E0D5] space-y-1">
              <span className="font-bold text-[#29251F] flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#76513B]" />
                Payment Method:
              </span>
              <p className="text-[#777066] pl-4 uppercase font-semibold">
                {order.paymentMethod} • Fully Settled
              </p>
            </div>

            <div className="pt-3 border-t border-[#E8E0D5] space-y-1.5">
              <div className="flex justify-between text-[#777066]">
                <span>Items Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#436A31]">
                  <span>Craft Heritage Discount</span>
                  <span>- {formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#777066]">
                <span>Insured Doorstep Shipping</span>
                <span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E0D5] flex justify-between font-bold text-sm text-[#29251F]">
                <span>Total Amount Paid</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
