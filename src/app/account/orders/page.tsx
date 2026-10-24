"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, Truck } from "lucide-react";
import { api } from "@/lib/api/client";
import { Order } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#29251F]">
          Order History & Tracking
        </h2>
        <p className="text-xs text-[#777066] mt-0.5">
          View all handcrafted consignments dispatched directly from artisan workshops.
        </p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-[#777066]">Loading orders...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-4"
            >
              {/* Top metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8E0D5]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFE9DF] text-[#76513B] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#29251F] block">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] text-[#777066]">
                      Placed on {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#76513B]">
                    Status: {order.status}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="px-3.5 py-1.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center gap-1"
                  >
                    <span>View Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-white border border-[#E8E0D5]">
                        <Image src={it.image} alt={it.title} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#29251F]">{it.title}</span>
                        <span className="text-[11px] text-[#777066] block">
                          Artisan: {it.artisanName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#29251F]">{formatINR(it.price * it.quantity)}</span>
                      <span className="text-[10px] text-[#777066] block">Qty: {it.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Total */}
              <div className="pt-3 border-t border-[#E8E0D5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#777066]">
                  <Truck className="w-3.5 h-3.5 text-[#78816A]" />
                  <span>Tracking: <strong className="text-[#29251F]">{order.trackingNumber || "Assigned on Dispatch"}</strong></span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#777066] mr-2">Total Paid:</span>
                  <span className="font-serif text-base font-bold text-[#29251F]">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#777066]">
          You have no orders yet.
        </div>
      )}
    </div>
  );
}
