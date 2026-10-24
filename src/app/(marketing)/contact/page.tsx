"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("support");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#76513B]">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
          Connect with Kaarigar AI
        </h1>
        <p className="text-xs sm:text-sm text-[#777066]">
          Whether you need help with an order, want to onboard a rural craft collective, or need bespoke corporate gifting, we are here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#29251F]">
            Direct Channels
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5]">
              <Mail className="w-4 h-4 text-[#76513B] mt-0.5" />
              <div>
                <strong className="text-[#29251F] block">Email Inquiries</strong>
                <span className="text-[#777066]">namaste@kaarigar.in</span>
                <span className="text-[10px] text-[#78816A] block mt-0.5">Average reply time: under 4 hours</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5]">
              <Phone className="w-4 h-4 text-[#76513B] mt-0.5" />
              <div>
                <strong className="text-[#29251F] block">Artisan Outreach Helpline</strong>
                <span className="text-[#777066]">+91 1800 200 4820 (Toll Free)</span>
                <span className="text-[10px] text-[#78816A] block mt-0.5">Available in Hindi, English & Regional Dialects</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D5]">
              <MapPin className="w-4 h-4 text-[#76513B] mt-0.5" />
              <div>
                <strong className="text-[#29251F] block">Heritage Office</strong>
                <span className="text-[#777066]">Kaarigar AI Foundation, Craft Guild Block, Bhopal, MP 462016</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 space-y-6 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-[#E5F0DF] text-[#436A31] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#29251F]">
                Message Received with Reverence!
              </h3>
              <p className="text-xs text-[#777066] max-w-sm mx-auto">
                Thank you for contacting Kaarigar AI. Our outreach team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#29251F]">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Nair"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#29251F]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">Inquiry Category</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                >
                  <option value="support">Customer Support / Order Status</option>
                  <option value="artisan">Artisan Workshop Onboarding</option>
                  <option value="corporate">Corporate & Bulk Gifting</option>
                  <option value="press">Press & Cultural Partnerships</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#29251F]">How Can We Help?</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F1] border border-[#E8E0D5] rounded-xl focus:outline-none focus:border-[#76513B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#76513B] text-white text-xs font-semibold hover:bg-[#5E3E2A] flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
