# KAARIGAR AI — PROJECT BRAIN & PRODUCT CHARTER

**Repository:** `kaarigar-frontend`  
**Companion Backend:** `kaarigar-backend` (Node.js, Fastify, PostgreSQL, Prisma, Redis, BullMQ, Firebase Auth)  
**Role:** Customer Website & Artisan Digitization Portal  
**Target Release:** Production v1.0.0  

---

## 1. PRODUCT VISION

Kaarigar AI is an AI-powered Indian artisan marketplace bridging traditional rural and tribal craftspeople with contemporary urban and global patrons. 

While existing e-commerce platforms treat artisans as low-margin third-party dropshippers with steep tech barriers, Kaarigar AI provides an intuitive, dignified digital studio. Through **AI-assisted product cataloguing**, artisanal voice/camera inputs, and fair-pricing algorithms, rural creators with limited digital literacy can catalogue their crafts, tell their generational stories, and receive direct orders. For patrons, Kaarigar offers an authentic, curated editorial experience that celebrates India's living heritage with verified provenance.

---

## 2. TARGET USER PERSONAS

### 2.1 The Ethical Connoisseur (Urban Customer)
- **Profile:** 24–50 years old, design-conscious, values authenticity, provenance, and fair trade.
- **Goals:** Discover authentic handmade home decor, Chanderi silks, Madhubani art, Bastar brassware; understand the artisan behind each purchase; seamless payment (UPI/Cards) and reliable tracking.
- **Pain Points:** Ubiquitous factory-produced fakes labelled as "handicraft", lack of artisan connection, unpredictable delivery.

### 2.2 The Master Artisan (Rural/Tribal Creator)
- **Profile:** Generational craftsperson (potter in Molela, weaver in Chanderi, woodcarver in Bastar/Saharanpur). May operate with regional language literacy and smartphone cameras.
- **Goals:** Showcase crafts without complex typing or digital marketing jargon; receive transparent pricing and fair payouts; manage orders without logistical chaos.
- **Pain Points:** Exploitative middlemen taking 70%+ margins; tedious multi-step listing forms with English requirements; delayed payments.

### 2.3 The Platform Curator / Administrator
- **Profile:** Kaarigar quality and compliance team.
- **Goals:** Verify artisan identity and craft authenticity; moderate product listings; monitor dispute resolutions and platform GMV.

---

## 3. USER JOURNEYS & INTERACTION FLOWS

### Journey 1: Customer Discovery to Checkout
1. **Landing:** Enters homepage; greets with warm aesthetic, "Crafted by Real People", curated trending categories, and featured artisan spotlight.
2. **Explore:** Navigates via interactive search, category filters (Textiles, Home Decor, Handicrafts, Jewelry, Paintings, Dining), or region (Bastar, Chanderi, Varanasi).
3. **Product Detail:** Evaluates craft story, artisan profile ("Meet Meena Devi"), dimensions, materials, and artisan video/audio note.
4. **Cart & Wishlist:** Adds item to cart; views live artisan impact contribution and shipping estimates.
5. **Checkout:** Selects delivery address, enters phone/PIN code, selects payment method (UPI / Credit Card / NetBanking / COD), completes simulated/live checkout, and receives real-time tracking timeline.

### Journey 2: Artisan AI Studio Listing
1. **Sign-In:** Artisan signs in with Google via Firebase Auth.
2. **Dashboard:** Enters Artisan Portal showing total sales, pending orders, and craft inventory health.
3. **AI Catalogue Studio:** Uploads a photograph of newly fired terracotta vase or handwoven dupatta.
4. **AI Generation:** The Kaarigar AI engine analyzes visual attributes, suggests:
   - SEO-optimized title
   - Poetic craft heritage story and description
   - Material categorization (e.g. Molela Clay, Natural Mineral Dyes)
   - Technique classification (Terracotta Hand-burnishing)
   - Recommended price calculation factoring craft hours, raw materials, and fair living wage.
5. **Publish:** Artisan reviews in one click and publishes directly to the marketplace.

---

## 4. FUNCTIONAL REQUIREMENTS

- **Catalog & Discovery:** Multi-facet search (keyword, category, price range, craft region, availability, customer rating), sorting (popular, newest, price low-to-high, price high-to-low), and shareable URL state (`?category=textiles&minPrice=500`).
- **Artisan Showcase:** Dedicated artisan profiles with craft tradition history, studio location, verified badge, awards, and complete product portfolio.
- **Cart & Wishlist:** Persistent local storage + authenticated cloud synchronization, quantity controls, out-of-stock validation.
- **Authentication & Security:** Firebase Client SDK Google authentication with backend verification exchange. Graceful mock fallback in development when credentials are absent.
- **Artisan Studio & AI Tools:** Multi-step product creation with visual preview, AI attribute analyzer, inventory management with low-stock alerts, and order fulfillment tracking.
- **Admin Management:** Artisan KYC verification queue, product approval, order monitoring, and security audit log view.

---

## 5. NON-FUNCTIONAL REQUIREMENTS & CORE WEB VITALS

- **Performance:** Sub-1.5s Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS) < 0.05, Interaction to Next Paint (INP) < 100ms.
- **Design System Fidelity:** Warm ivory background (`#FAF7F1`), rich terracotta (`#76513B`), deep charcoal text (`#29251F`), muted olive accent (`#78816A`), and editorial serif typography matching reference design.
- **Accessibility:** WCAG 2.1 AA compliance, full keyboard navigation, screen reader ARIA landmarks, visible focus rings, and high contrast ratios.
- **Resilience:** Offline/mock data service layer enabling complete functional evaluation even when backend service is unavailable.
- **Security:** Strict separation between client and server credentials, zero exposure of Firebase Admin secrets, sanitization of inputs, CSRF/XSS defenses.

---

## 6. EXCLUSIONS & BOUNDARIES

- Native iOS / Android apps (future scope via React Native / Flutter sharing backend APIs).
- Direct database connection (PostgreSQL/Redis are strictly managed by `kaarigar-backend`).
- Financial payment gateway webhook handling (processed through backend payment endpoints).

---

## 7. ARCHITECTURAL DECISIONS RECORD (ADR SUMMARY)

- **ADR 001 — Next.js App Router with Server & Client Components:** Server Components for SEO, metadata, and static landing content; Client Components reserved for interactive islands (Cart, Filter pills, AI Studio, Auth modals).
- **ADR 002 — Dual-Mode API Client:** Strict TypeScript API client that calls Fastify backend when `NEXT_PUBLIC_API_URL` is available, with an automatic resilient in-memory fixture store for standalone demos and automated tests.
- **ADR 003 — State Management Strategy:** Local component state + React Context for global concerns (Cart, Wishlist, Auth, Location) + URL Search Params for marketplace discovery state. Avoid heavy external state managers.
