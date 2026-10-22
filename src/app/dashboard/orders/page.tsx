"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Truck, CheckCircle2, Clock, Printer, MapPin } from "lucide-react";
import { api } from "@/lib/api/client";
import { Order } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Incoming Patron Orders & Fulfillment
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Pack items carefully with traditional craft notes and update dispatch status.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#436A31]">
          {orders.length} Active Consignments
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-[#777066]">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] space-y-4 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E0D5]">
                <div>
                  <span className="font-bold text-sm text-[#29251F] block">
                    Order #{ord.orderNumber}
                  </span>
                  <span className="text-[11px] text-[#777066]">
                    Ordered: {new Date(ord.date).toLocaleDateString("en-IN")} • Destination: {ord.shippingAddress.city}, {ord.shippingAddress.state}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={ord.status}
                    onChange={(e) => updateStatus(ord.id, e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#E8E0D5] rounded-xl font-semibold text-xs text-[#76513B] focus:outline-none"
                  >
                    <option value="placed">Placed</option>
                    <option value="processing">Processing & Packing</option>
                    <option value="shipped">Handed to Courier</option>
                    <option value="delivered">Delivered to Patron</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 bg-white border border-[#E8E0D5] rounded-xl text-[#777066] hover:text-[#29251F]"
                    title="Print Packing Slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                {ord.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-white border border-[#E8E0D5] shrink-0">
                        <Image src={it.image} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#29251F] block">{it.title}</span>
                        <span className="text-[10px] text-[#777066]">Qty: {it.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#29251F]">{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Payout note */}
              <div className="pt-3 border-t border-[#E8E0D5] flex items-center justify-between text-[11px] text-[#78816A]">
                <span>Artisan Direct Settlement: 100% Guaranteed</span>
                <span className="font-serif text-sm font-bold text-[#29251F]">
                  Order Total: {formatINR(ord.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
