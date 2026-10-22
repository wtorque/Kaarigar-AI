# KAARIGAR AI — PROJECT BRAIN
## Product Scope, Domain Invariants, Business Rules, and Core Requirements

### 1. Product Vision & Mission
Kaarigar AI is an enterprise-grade digital enablement platform purpose-built for traditional Indian artisans (*Kaarigars*). Traditional artisans face severe digital divides: complex e-commerce interfaces, written language barriers, difficulty writing SEO-friendly product copy, and lack of inventory management skills. 

Kaarigar AI solves this with:
- **Vision-Driven AI Cataloguing:** An artisan simply snaps 1-3 photographs of their handcrafted artifact. Kaarigar AI extracts craft taxonomy, materials, regional craft cluster heritage (e.g., *Madhubani*, *Blue Pottery of Jaipur*, *Dhokra Brass Casting*, *Banarasi Silk*), estimated fair market valuation, and auto-generates bilingual/multilingual listings with rich storytelling.
- **Fair Commerce & Transparency:** Explicit provenance, artisan identity verification, fair artisan payout calculations, and zero hidden platform cuts.
- **Robust Multi-Role Commerce:** Customers discover authentic handcrafted items, purchase securely with real-time stock reservations, and receive transparent tracking.
- **Resilient Offline-First & Distributed Foundations:** Built on Fastify, PostgreSQL, Prisma, Redis, BullMQ, and Firebase Authentication.

---

### 2. Core Entities & Domain Terminology
1. **User:** Core identity entity linked to an external provider (Firebase Google Authentication).
2. **Role Hierarchy:**
   - `CUSTOMER`: General consumer browsing and purchasing authentic artisan products.
   - `ARTISAN`: Craft creator who maintains a craft profile, submits products, runs AI cataloguing, and fulfills orders.
   - `ADMIN`: Platform staff reviewing artisan verification documents, managing categories, and moderating content.
   - `SUPER_ADMIN`: Root administrator with system configuration and security audit privileges.
3. **ArtisanProfile:** Holds artisan business identity, craft specialization, Indian craft cluster / GI (Geographical Indication) tag details, government artisan card / Aadhaar / document verification status (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`), bank payout details, and bio.
4. **Product & ProductVariant:** Handcrafted item entity. Includes rich story, materials, craft technique, dimension specs, weight, base price in minor currency units (paise/cents), and variants (e.g., size/color variations).
5. **Inventory:** Strict concurrency-safe stock records linked to ProductVariants with reserved quantity tracking and atomic updates.
6. **CatalogueJob:** Async background task state machine for computer vision inspection, craft attribute extraction, and listing draft generation.
7. **Order & OrderItem:** State machine representing the customer purchase agreement, snapshotting unit prices and artisan commissions at the exact moment of checkout.
8. **Payment & PaymentWebhookEvent:** Cryptographically verified payment transaction lifecycle with strict idempotency and deduplication.

---

### 3. Business Invariants & Rules

#### 3.1 Money & Currency Policy
- All monetary amounts are stored strictly as **integers in minor currency units** (`paise` for INR, where ₹100.00 = `10000`).
- No floating-point arithmetic is permitted in pricing calculations.
- Tax and platform fee calculation formulas must use integer math with banker's rounding or floor/ceil rules explicitly codified in the domain service.

#### 3.2 Artisan Verification & Publishing Rules
- Anyone with an authenticated account can register as an artisan candidate (`status = PENDING`).
- **Publishing Invariant:** An artisan CANNOT publish products to public search/catalogues until their `ArtisanProfile.status` is set to `VERIFIED` by an `ADMIN`.
- Unverified artisans can create draft products, test the AI cataloguing pipeline, and prepare listings, but products will remain in `DRAFT` status and are invisible to the public.

#### 3.3 Inventory Reservation & Concurrency Rules
- Cart addition does not reserve stock. Stock reservation occurs strictly at the start of Checkout (`POST /api/v1/payments/checkout`).
- Stock reservations use row-level PostgreSQL locking (`SELECT ... FOR UPDATE`) or atomic decrement conditions:
  `UPDATE inventories SET quantity = quantity - $reserved, reserved_quantity = reserved_quantity + $reserved WHERE id = $id AND quantity >= $reserved`.
- A reservation has a time-to-live of **15 minutes**.
- If the payment is not confirmed within 15 minutes, a BullMQ cleanup job or cron automatically releases the reserved inventory back to available stock.
- On successful payment webhook confirmation, reserved quantity is permanently finalized (`reserved_quantity = reserved_quantity - $ordered`).

#### 3.4 Idempotency Policy
- Critical mutation endpoints (`POST /api/v1/orders`, `POST /api/v1/payments/checkout`, `POST /api/v1/webhooks/payments`) require an `Idempotency-Key` HTTP header.
- Cached results for identical idempotency keys are returned for duplicate requests within 24 hours.

#### 3.5 AI Cataloguing Integrity
- The AI vision pipeline suggests: Title, Description, Craft Technique, Story/Provenance, Suggested Price Range, and Category.
- **Integrity Rule:** The AI will never fabricate false GI certifications or misleading material claims.
- The output of AI cataloguing is stored as a `CatalogueJob` draft. The artisan must review, edit, and explicitly submit the listing before it can transition to published state.

---

### 4. Non-Functional Requirements & Performance
- **Database:** PostgreSQL is the single source of truth. Relational integrity with foreign keys, check constraints, indexes, and ACID transactions.
- **Cache & Queues:** Redis for rate limiting, cache queries (TTL: 5-60 min), and BullMQ queue storage. Graceful degradation when Redis is temporarily unreachable.
- **Security:** Firebase Admin token verification on every private endpoint, RBAC + resource ownership verification, Zod input validation, secure HTTP headers, sanitization, and audit logs.
