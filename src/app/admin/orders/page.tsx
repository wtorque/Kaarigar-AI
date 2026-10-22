"use client";

import React, { useEffect, useState } from "react";
import { Truck, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { api } from "@/lib/api/client";
import { Order } from "@/types";
import { formatINR } from "@/lib/utilities/cn";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Platform Orders & Dispute Oversight
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Real-time monitor of patron purchases and courier logistics.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D5] text-[#777066] uppercase text-[10px] tracking-wider">
              <th className="pb-3 font-bold">Order #</th>
              <th className="pb-3 font-bold">Date</th>
              <th className="pb-3 font-bold">Destination</th>
              <th className="pb-3 font-bold">Total</th>
              <th className="pb-3 font-bold">Payment</th>
              <th className="pb-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE1]">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#FAF7F1] transition-colors">
                <td className="py-3.5 font-bold text-[#29251F]">{ord.orderNumber}</td>
                <td className="py-3.5 text-[#777066]">
                  {new Date(ord.date).toLocaleDateString("en-IN")}
                </td>
                <td className="py-3.5 text-[#29251F]">
                  {ord.shippingAddress.city}, {ord.shippingAddress.state}
                </td>
                <td className="py-3.5 font-bold text-[#29251F]">{formatINR(ord.total)}</td>
                <td className="py-3.5 uppercase font-medium text-[#777066]">{ord.paymentMethod}</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E5F0DF] text-[#436A31]">
                    {ord.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
