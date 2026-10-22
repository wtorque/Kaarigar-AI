# KAARIGAR AI — FRONTEND APPLICATION

[![Next.js 16+](https://img.shields.io/badge/Next.js-16%2B_App_Router-black)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-10%2F10_Passing-brightgreen)](https://vitest.dev/)

**Kaarigar AI** is an AI-powered Indian artisan marketplace bridging traditional rural and tribal craftspeople with contemporary urban and global patrons.

This repository (`kaarigar-frontend`) contains the complete production-grade website frontend built with Next.js App Router, TypeScript, Tailwind CSS, Firebase Client SDK, and an indigenous AI Catalogue Studio.

---

## 🌟 Visual Reference Alignment

The website translates the warm, editorial aesthetic of the primary visual reference into a desktop and mobile responsive experience:

- **Warm Natural Palette:** Ivory surface (`#FAF7F1`), rich terracotta (`#76513B`), warm terracotta accent (`#A66B4D`), muted olive-sage (`#78816A`), and deep warm charcoal text (`#29251F`).
- **Editorial Typography:** Classic display serif headers (*Playfair Display*) paired with clean, accessible sans-serif body (*Plus Jakarta Sans*).
- **Hero Alignment:** Exact match to the reference headline *"Crafted by Real People"*, 4 trust pillars (*Authentic Products, Direct from Artisans, Support Local, Secure Shopping*), and floating *10,000+ Artisans* badge.
- **Trending Categories:** Horizontal card row featuring Handicrafts, Textiles, Home Decor, Jewelry, Bags & Accessories, Paintings, Kitchen & Dining, and Festival Special.
- **Featured Products:** Exact 8 craft showcases with INR pricing, star ratings, and artisan provenance tags.

---

## 📁 Repository Structure

```text
kaarigar-frontend/
├── public/
│   ├── images/
│   │   ├── products/         # Handcarved Elephant, Chanderi Saree, Terracotta Lamp...
│   │   ├── categories/       # Handicrafts, Textiles, Home Decor, Jewelry...
│   │   ├── artisans/         # Suresh Kumar, Meena Devi, Ravi Artisans...
│   │   └── hero/             # Curated craft studio composite photography
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (marketing)/      # Public homepage, /about, /contact
│   │   ├── marketplace/      # /marketplace with faceted filters, /[category]
│   │   ├── product/[slug]/   # Detailed product gallery, artisan bio, reviews
│   │   ├── artisans/         # /artisans directory, /[slug] dedicated profile
│   │   ├── search/           # Instant keyword & faceted search
│   │   ├── (auth)/           # /login (Google Auth), /register, /onboarding
│   │   ├── cart/             # Shopping bag, promo discounts, social impact meter
│   │   ├── checkout/         # Address validation, payment methods (UPI/Card/COD)
│   │   ├── account/          # Customer portal: orders, [id] tracking, wishlist
│   │   ├── dashboard/        # Artisan Studio Portal: overview, AI catalogue, inventory
│   │   ├── admin/            # Curator Governance: KYC verifications, audit logs
│   │   ├── privacy/ & terms/
│   │   ├── layout.tsx & globals.css
│   │   ├── error.tsx & loading.tsx & not-found.tsx
│   ├── components/
│   │   ├── ui/               # Button, Badge, Card, Input, Skeleton
│   │   ├── layout/           # Navbar, Footer, Providers, LocationContext
│   │   └── marketplace/      # ProductCard, CategoryCard, HeroSection
│   ├── features/
│   │   ├── auth/             # AuthContext, multi-role simulation, Firebase SDK
│   │   ├── cart/             # CartContext, quantity management, impact hours
│   │   └── wishlist/         # WishlistContext with optimistic updates
│   ├── lib/
│   │   ├── api/              # Typed client with live backend / offline fixture fallback
│   │   ├── firebase/         # Client SDK config & authentication helpers
│   │   └── utilities/        # cn, formatINR, slugify
│   └── types/                # Domain types (Product, Category, Artisan, Order, User)
├── tests/
│   ├── unit/                 # API client, formatting, calculations
│   ├── components/           # UI component test suite
│   └── e2e/                  # Playwright E2E scenarios
├── PROJECT_BRAIN.md          # Product Charter & Personas
├── ARCHITECTURE.md           # System Topology, Data Flow & Mermaid Diagrams
├── API_CONTRACT.md           # OpenAPI Specification & Endpoints
├── SECURITY.md               # Secrets Classification & Auth Boundaries
├── TASKS.md                  # Strict Evidence-Based Task Tracker
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on Node v24.20.0)
- **npm**: v9+ (or pnpm / yarn)

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Fastify backend API endpoint | `http://localhost:4000/api/v1` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public Firebase Client API Key | Development fallback provided |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `kaarigar-ai.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `kaarigar-ai` |

> **Note on Backend Independence:** The frontend includes an automated resilient mock fallback layer in `src/lib/api/client.ts`. If the companion Fastify backend is offline, the website functions smoothly with all interactive features (filters, search, cart, checkout, AI studio analysis, role switching).

### 3. Installation
```bash
npm install --legacy-peer-deps
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🧪 Testing Suite

### Unit & Component Tests (Vitest)
```bash
npm test
```
Runs 10 automated test suites verifying API client filtering, currency formatting, living-wage algorithm calculations, and component rendering.

### End-to-End Tests (Playwright)
```bash
npx playwright test
```

---

## 🔐 Multi-Role Interactive Demo

For instant manual evaluation and code-review testing, the user menu in the top navbar includes a **Quick Switch Role** toggle:
1. **Patron (Customer):** Browse marketplace, add to bag, place simulated orders, track consignments.
2. **Master Artisan:** Access `/dashboard`, launch `/dashboard/ai-catalogue`, adjust stock in `/dashboard/inventory`, fulfill incoming orders.
3. **Curator (Admin):** Access `/admin`, approve pending artisan KYC applications, curate featured homepage collections, inspect security audit logs.

---

## 📜 Five Required Specifications

- [`PROJECT_BRAIN.md`](./PROJECT_BRAIN.md): Product vision, user personas, functional and non-functional requirements.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md): Route hierarchy, state management, and Mermaid sequence diagrams.
- [`API_CONTRACT.md`](./API_CONTRACT.md): OpenAPI contract, request/response payloads, and error codes.
- [`SECURITY.md`](./SECURITY.md): Client credential boundaries, CSRF/XSS defenses, and route guard specs.
- [`TASKS.md`](./TASKS.md): Evidence-based progress tracker across all 6 phases.
