import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaarigar AI — Artisans • People • Opportunities",
  description:
    "Discover unique handmade products from talented artisans across India. AI-assisted artisan digitisation, fair trade craft marketplace, and living cultural heritage.",
  keywords: [
    "Indian handicrafts",
    "Handmade",
    "Artisans",
    "Chanderi Silk",
    "Bastar Woodcraft",
    "Molela Terracotta",
    "Madhubani Paintings",
    "Kaarigar AI",
  ],
  authors: [{ name: "Kaarigar AI" }],
  openGraph: {
    title: "Kaarigar AI — Crafted by Real People",
    description: "Support local artisans across India. Discover authentic handmade heritage crafts.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${caveat.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#FAF7F1] text-[#29221C] selection:bg-[#70472F]/20 selection:text-[#70472F]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
