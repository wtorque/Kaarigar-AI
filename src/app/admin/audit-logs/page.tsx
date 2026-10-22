"use client";

import React from "react";
import { Shield, Key, CheckCircle2, Clock } from "lucide-react";

export default function AdminAuditLogsPage() {
  const logs = [
    {
      id: "log_1",
      timestamp: "Today, 18:24:10",
      actor: "curator@kaarigar.in",
      action: "KYC_VERIFICATION_APPROVED",
      details: "Approved master artisan credentials for Suresh Kumar (Bastar Teakwood)",
      ip: "103.21.244.12",
      status: "SUCCESS",
    },
    {
      id: "log_2",
      timestamp: "Today, 17:15:02",
      actor: "system_cron",
      action: "AI_CATALOGUE_ALGORITHM_SYNC",
      details: "Calibrated rural living wage baseline rate to ₹95/hr per Labor Ministry benchmark",
      ip: "127.0.0.1",
      status: "SUCCESS",
    },
    {
      id: "log_3",
      timestamp: "Yesterday, 21:40:55",
      actor: "curator@kaarigar.in",
      action: "FEATURED_PRODUCT_UPDATED",
      details: "Promoted Handpainted Lamp (prod_3) to Homepage Featured banner",
      ip: "103.21.244.12",
      status: "SUCCESS",
    },
    {
      id: "log_4",
      timestamp: "Yesterday, 14:12:30",
      actor: "firebase_auth_service",
      action: "TOKEN_VERIFY_EXCHANGE",
      details: "Issued session attestation for user harshh@kaarigar.in",
      ip: "49.36.120.44",
      status: "SUCCESS",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#29251F]">
            Security & Governance Audit Logs
          </h2>
          <p className="text-xs text-[#777066] mt-0.5">
            Immutable log of all administrative actions, KYC decisions, and token exchanges.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#76513B]">
                  {log.action}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#E5F0DF] text-[#436A31]">
                  {log.status}
                </span>
              </div>
              <p className="text-[#29251F] font-medium">{log.details}</p>
              <span className="text-[10px] text-[#777066]">
                By {log.actor} • IP {log.ip}
              </span>
            </div>

            <div className="text-right sm:text-right text-[11px] text-[#777066] font-mono shrink-0">
              {log.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
