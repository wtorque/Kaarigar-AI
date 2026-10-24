# KAARIGAR AI — BACKEND API CONTRACT SPECIFICATION

**API Version:** `v1`  
**Base URL:** `process.env.NEXT_PUBLIC_API_URL` (Defaults to `http://localhost:4000/api/v1`)  
**Companion Backend:** Fastify + Prisma + PostgreSQL + Redis + BullMQ + Firebase Admin SDK  
**Standard Protocol:** RESTful JSON over HTTPS  

---

## 1. AUTHENTICATION & HEADERS

Every authenticated request includes the Firebase ID Token in the standard HTTP header:

```http
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
Accept: application/json
```

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED | VALIDATION_ERROR | NOT_FOUND | FORBIDDEN | RATE_LIMITED | INTERNAL_SERVER_ERROR",
    "message": "Human readable explanation of error",
    "details": []
  }
}
```

---

## 2. API ENDPOINTS INVENTORY

### 2.1 Authentication & Session (`/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/verify-token` | Bearer Token | Verifies Firebase ID Token, upserts user, returns user profile & role |
| `GET` | `/auth/me` | Bearer Token | Returns current authenticated user record with permissions |
| `POST` | `/auth/logout` | Bearer Token | Revokes backend session |

**Request Body (`POST /auth/verify-token`):**
```json
{
  "email": "harshh@example.com",
  "displayName": "Harshh",
  "photoURL": "https://...",
  "role": "customer" // "customer" | "artisan"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_94821a",
    "firebaseUid": "fb_x782n19",
    "email": "harshh@example.com",
    "name": "Harshh",
    "role": "artisan", // "customer" | "artisan" | "admin"
    "avatar": "https://...",
    "artisanProfile": {
      "id": "art_8291a",
      "craft": "Terracotta & Pottery",
      "region": "Molela, Rajasthan",
      "isVerified": true
    }
  }
}
```

---

### 2.2 Products & Catalog (`/products`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | Optional | List products with filtering, search, sorting & pagination |
| `GET` | `/products/:id` | Optional | Retrieve product by UUID |
| `GET` | `/products/slug/:slug` | Optional | Retrieve product by human-readable slug |
| `GET` | `/products/featured` | Optional | Retrieve curated homepage products |
| `GET` | `/categories` | Optional | List all craft categories with metadata & item counts |

**Query Parameters (`GET /products`):**
- `page` (number, default: 1)
- `limit` (number, default: 12)
- `category` (string, e.g. `textiles`, `handicrafts`, `home-decor`, `jewelry`, `paintings`, `kitchen-dining`, `bags-accessories`, `festival-special`)
- `region` (string, e.g. `Bastar`, `Chanderi`, `Molela`, `Varanasi`, `Madhubani`, `Jaipur`)
- `minPrice` (number)
- `maxPrice` (number)
- `sort` (`featured` | `newest` | `price_asc` | `price_desc` | `rating`)
- `query` (search keyword)
- `inStockOnly` (boolean)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prod_1",
        "slug": "handcarved-wooden-elephant",
        "title": "Handcarved Wooden Elephant",
        "price": 1299,
        "originalPrice": 1699,
        "category": "handicrafts",
        "rating": 4.8,
        "reviewsCount": 120,
        "images": ["/images/products/wooden-elephant.webp"],
        "inStock": true,
        "stockCount": 14,
        "artisan": {
          "id": "art_1",
          "slug": "suresh-kumar",
          "name": "Suresh Kumar",
          "location": "Bastar, CG",
          "avatar": "/images/artisans/suresh.webp",
          "isVerified": true
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalItems": 48,
      "totalPages": 4
    }
  }
}
```

---

### 2.3 Artisans & Stories (`/artisans`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/artisans` | Optional | List artisans with regional and craft filtering |
| `GET` | `/artisans/:id` | Optional | Get artisan by UUID |
| `GET` | `/artisans/slug/:slug` | Optional | Get artisan public profile by slug |
| `GET` | `/artisans/slug/:slug/products` | Optional | Get products handcrafted by this artisan |

---

### 2.4 Cart & Checkout (`/cart`, `/orders`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cart` | Required | Get user cart items |
| `POST` | `/cart/items` | Required | Add item to cart |
| `PATCH` | `/cart/items/:id` | Required | Update item quantity |
| `DELETE` | `/cart/items/:id` | Required | Remove item from cart |
| `POST` | `/orders` | Required | Create order from cart & initiate payment session |
| `GET` | `/orders` | Required | List user orders |
| `GET` | `/orders/:id` | Required | Get detailed order summary & tracking timeline |

---

### 2.5 Artisan Studio & AI Tools (`/artisan`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/artisan/dashboard/stats` | Required (Artisan) | Sales GMV, order counts, listing health |
| `GET` | `/artisan/products` | Required (Artisan) | List artisan's managed products |
| `POST` | `/artisan/products` | Required (Artisan) | Publish new handcrafted product |
| `PATCH` | `/artisan/products/:id` | Required (Artisan) | Update product listing & stock |
| `POST` | `/artisan/ai-catalogue/analyze` | Required (Artisan) | Upload craft photo -> AI extracts title, story, category, price |

**AI Catalogue Analyze Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "suggestedTitle": "Handcrafted Terracotta Terrarium Lamp",
    "suggestedCategory": "home-decor",
    "detectedMaterials": ["Terracotta Clay", "Natural Oxide Glaze"],
    "craftTechnique": "Molela Hand-carved Cutwork Pottery",
    "heritageStory": "Molded by hand using mineral-rich clay from the Banas riverbed. Every floral cutwork aperture is pierced individually to cast warm geometric constellations when lit.",
    "recommendedPrice": 1199,
    "pricingBreakdown": {
      "materials": 240,
      "laborHours": 8,
      "fairLivingWagePerHour": 95,
      "craftComplexityMultiplier": 1.25,
      "fairArtisanMargin": 200
    },
    "tags": ["Terracotta", "Pierced Lamp", "Molela Craft", "Diwali Special", "Eco-friendly"]
  }
}
```

---

### 2.6 Admin Governance (`/admin`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/metrics` | Required (Admin) | Platform GMV, orders, active artisans |
| `GET` | `/admin/artisans/pending` | Required (Admin) | List artisans awaiting KYC review |
| `POST` | `/admin/artisans/:id/verify` | Required (Admin) | Approve or reject artisan application |
| `GET` | `/admin/audit-logs` | Required (Admin) | Platform compliance audit logs |
