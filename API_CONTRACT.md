# KAARIGAR AI — REST API CONTRACT
## Version 1 Specification (`/api/v1`)

### 1. Global Conventions

#### 1.1 Base URL
All API requests are prefixed with: `/api/v1`

#### 1.2 Authentication Header
All protected endpoints require an Authorization HTTP header containing a valid Firebase ID Token:
```http
Authorization: Bearer <firebase_id_token>
```

#### 1.3 Idempotency Header
All non-safe mutation endpoints that create financial or inventory state (`POST /orders`, `POST /payments/checkout`, `POST /webhooks/payments`) accept:
```http
Idempotency-Key: <uuid-v4>
```

#### 1.4 Response Envelope Formats

##### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142
  }
}
```

##### Error Response (RFC 7807 aligned):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "priceMinor",
        "issue": "Price must be a positive integer"
      }
    ],
    "requestId": "req-98f5a2b1"
  }
}
```

#### 1.5 Standard Error Codes
- `UNAUTHORIZED`: Missing, expired, or cryptographically invalid token.
- `FORBIDDEN`: User lacks required role or resource ownership.
- `VALIDATION_ERROR`: Request body, params, or query failed Zod schema checks.
- `NOT_FOUND`: Target entity does not exist.
- `CONFLICT`: Resource conflict (e.g., unique email, concurrent stock depletion).
- `RATE_LIMITED`: Exceeded sliding-window rate limit.
- `INTERNAL_SERVER_ERROR`: Unhandled exception (sanitized in non-dev environments).

---

### 2. Endpoints Directory

#### 2.1 System & Health

##### `GET /api/v1/health`
Checks API server liveness.
- **Auth:** Public
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2026-10-22T17:15:00.000Z",
    "uptimeSeconds": 3482
  }
}
```

##### `GET /api/v1/health/ready`
Checks deep connectivity to PostgreSQL and Redis.
- **Auth:** Public
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "status": "READY",
    "checks": {
      "database": "UP",
      "redis": "UP"
    }
  }
}
```

---

#### 2.2 Users & Authentication Context

##### `GET /api/v1/me`
Retrieves the authenticated user profile, resolved roles, and associated artisan profile (if any).
- **Auth:** Bearer Token
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": "usr_9b1deb4d3b7d4fb69213cc5ecdf40b58",
    "email": "artisan.ramesh@kaarigar.ai",
    "name": "Ramesh Kumar",
    "avatarUrl": "https://lh3.googleusercontent.com/...",
    "role": "ARTISAN",
    "status": "ACTIVE",
    "artisanProfile": {
      "id": "art_28fbc026",
      "craftTitle": "Jaipur Blue Pottery Master Artisan",
      "status": "VERIFIED",
      "clusterRegion": "Jaipur, Rajasthan",
      "giTagNumber": "GI-0082"
    }
  }
}
```

##### `PATCH /api/v1/me`
Updates user profile settings (name, phone, preferences).
- **Auth:** Bearer Token
- **Request Body:**
```json
{
  "name": "Ramesh Kumar Prajapati",
  "phone": "+919876543210"
}
```

##### `GET /api/v1/me/addresses` & `POST /api/v1/me/addresses`
Manages customer shipping and billing addresses.
- **Request Body (POST):**
```json
{
  "fullName": "Ramesh Kumar",
  "phone": "+919876543210",
  "streetAddress": "House 42, Kumhar Gram",
  "city": "Jaipur",
  "state": "Rajasthan",
  "postalCode": "302001",
  "country": "IN",
  "isDefault": true
}
```

---

#### 2.3 Artisan Module

##### `POST /api/v1/artisans/onboarding`
Submits artisan onboarding details for admin verification.
- **Auth:** Bearer Token (Role: CUSTOMER or ARTISAN)
- **Request Body:**
```json
{
  "businessName": "Prajapati Blue Clay Studio",
  "craftTitle": "Master Ceramic & Blue Pottery Artisan",
  "story": "Carrying forward 4 generations of traditional quartz & copper oxide glazing in Kot Jewar.",
  "clusterRegion": "Kot Jewar, Jaipur",
  "giTagNumber": "GI-0082",
  "idDocumentType": "AADHAAR_OR_ARTISAN_CARD",
  "idDocumentNumber": "XXXX-XXXX-1234",
  "payoutBankDetails": {
    "accountNumber": "987654321000",
    "ifscCode": "SBIN0001234",
    "accountHolderName": "Ramesh Kumar Prajapati"
  }
}
```
- **Response 201 Created:** Returns created `ArtisanProfile` with status `PENDING`.

##### `GET /api/v1/artisans/me`
Retrieves current artisan's business profile, analytics summary, and verification status.

---

#### 2.4 Categories & Public Products

##### `GET /api/v1/categories`
Lists hierarchical craft categories, GI cluster tags, and materials.
- **Auth:** Public

##### `POST /api/v1/categories`
Admin route to create or update craft categories.
- **Auth:** Bearer Token (Role: ADMIN or SUPER_ADMIN)

##### `GET /api/v1/products`
Lists public published artisan products with filtering, search, and pagination.
- **Auth:** Public
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
  - `categoryId` (UUID)
  - `search` (keyword in title/description/craft)
  - `clusterRegion` (string)
  - `minPrice` / `maxPrice` (in minor units)
  - `sortBy` (`newest` | `price_asc` | `price_desc` | `popular`)

##### `GET /api/v1/products/:id`
Retrieves detailed product listing, artisan provenance story, verified GI tag, images, variants, and live stock availability.

##### `POST /api/v1/artisans/products`
Creates a new product (draft or published).
- **Auth:** Bearer Token (Role: ARTISAN with `VERIFIED` status)
- **Request Body:**
```json
{
  "title": "Handcrafted Floral Jaipur Blue Pottery Vase 10\"",
  "description": "Authentic quartz-based traditional vase fired with Egyptian paste technique.",
  "craftTechnique": "Blue Pottery Slip Casting and Hand Painting",
  "story": "Painted by master artisan Ramesh using natural cobalt oxide dye.",
  "categoryId": "cat_7781a9f0",
  "clusterRegion": "Jaipur, Rajasthan",
  "giTagNumber": "GI-0082",
  "basePriceMinor": 185000,
  "images": [
    {
      "url": "https://assets.kaarigar.ai/prod-123-1.jpg",
      "isPrimary": true,
      "altText": "Front view of floral painted blue pottery vase"
    }
  ],
  "variants": [
    {
      "sku": "JBP-VASE-10-BLUE",
      "title": "10 Inch - Traditional Cobalt Blue",
      "priceMinor": 185000,
      "stockQuantity": 5,
      "attributes": { "height": "10 inches", "color": "Cobalt Blue" }
    }
  ]
}
```

##### `PATCH /api/v1/artisans/products/:id`
Updates product specifications, pricing, and variant details.
- **Auth:** Bearer Token (Owner Artisan or Admin)

##### `DELETE /api/v1/artisans/products/:id`
Soft deletes or archives an artisan product.

---

#### 2.5 AI Cataloguing Module

##### `POST /api/v1/ai/catalogue`
Initiates vision-powered craft listing generation from uploaded image(s) or URLs.
- **Auth:** Bearer Token (Role: ARTISAN)
- **Request Body (JSON or Multipart):**
```json
{
  "imageUrl": "https://assets.kaarigar.ai/temp/artisan_upload_raw.jpg",
  "artisanNotes": "Handmade brass bell, made in Bastar using lost-wax Dhokra technique."
}
```
- **Response 202 Accepted:**
```json
{
  "success": true,
  "data": {
    "jobId": "catjob_7841bf02",
    "status": "PENDING",
    "estimatedDurationSeconds": 6,
    "checkStatusUrl": "/api/v1/ai/catalogue/catjob_7841bf02"
  }
}
```

##### `GET /api/v1/ai/catalogue/:jobId`
Polls AI catalogue job completion and fetches generated draft attributes.
- **Auth:** Bearer Token (Owner Artisan)
- **Response 200 OK (When Completed):**
```json
{
  "success": true,
  "data": {
    "jobId": "catjob_7841bf02",
    "status": "COMPLETED",
    "generatedDraft": {
      "suggestedTitle": "Bastar Dhokra Handcrafted Tribal Bell in Bell Metal",
      "suggestedDescription": "Traditional non-ferrous metal casting using lost-wax technique dating back to the Indus Valley civilization. Each bell produces an earthy chime and carries tribal motifs.",
      "craftTechnique": "Dhokra Lost-Wax Bell Metal Casting",
      "story": "Crafted by skilled artisans of Bastar using beeswax modeling and red clay casting moulds.",
      "suggestedCategory": "Metal Craft & Brassware",
      "suggestedPriceRange": {
        "minMinor": 120000,
        "maxMinor": 160000
      },
      "suggestedTags": ["dhokra", "tribal craft", "lost-wax", "bastar", "bell metal"],
      "materials": ["Bell Metal", "Brass", "Beeswax", "Natural Clay"]
    }
  }
}
```

##### `POST /api/v1/ai/catalogue/:jobId/publish`
Converts verified and artisan-edited draft into a live `Product` record.

---

#### 2.6 Cart & Wishlist

##### `GET /api/v1/cart`
Fetches user cart, items, real-time prices, and stock status.

##### `POST /api/v1/cart/items`
Adds an item variant to cart with requested quantity.

##### `PATCH /api/v1/cart/items/:id`
Updates item quantity in cart.

##### `DELETE /api/v1/cart/items/:id`
Removes an item from cart.

##### `GET /api/v1/wishlist` & `POST /api/v1/wishlist/items` & `DELETE /api/v1/wishlist/items/:productId`
Manages customer saved items.

---

#### 2.7 Orders & Checkout Pipeline

##### `POST /api/v1/payments/checkout`
Reserves inventory atomically, locks unit prices, creates an Order (`PENDING_PAYMENT`), and initializes a payment session with the payment provider.
- **Auth:** Bearer Token
- **Headers:** `Idempotency-Key: <UUID>`
- **Request Body:**
```json
{
  "shippingAddressId": "addr_91823712",
  "items": [
    {
      "variantId": "var_81723812",
      "quantity": 1
    }
  ]
}
```
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_55210921",
    "orderNumber": "KRG-202610-0042",
    "totalAmountMinor": 185000,
    "currency": "INR",
    "paymentSession": {
      "paymentId": "pay_9812401",
      "provider": "SANDBOX",
      "providerReferenceId": "order_mock_rzp_98124",
      "expiresAt": "2026-10-22T17:35:00.000Z"
    }
  }
}
```

##### `POST /api/v1/webhooks/payments`
Cryptographically verified webhook handler for payment gateways (Razorpay / Stripe).
- **Auth:** Signature Header (e.g. `X-Razorpay-Signature` or `Stripe-Signature`)
- **Action:** Deduplicates event, verifies signature, atomically moves `Order` to `PAYMENT_CONFIRMED`, finalizes inventory reservation, notifies artisan, and schedules payout accounting.

##### `GET /api/v1/orders`
Lists orders for the authenticated customer or orders belonging to an artisan's workshop.

##### `GET /api/v1/orders/:id`
Fetches full order details, tracking information, and status timeline.

##### `POST /api/v1/orders/:id/cancel`
Cancels pending order and releases reserved stock.

---

#### 2.8 Notifications & Admin

##### `GET /api/v1/notifications` & `PATCH /api/v1/notifications/:id/read`
In-app notifications for order status, verification results, and sales.

##### `GET /api/v1/admin/artisans`
Lists artisan applications for review.
- **Auth:** Bearer Token (Role: ADMIN or SUPER_ADMIN)

##### `PATCH /api/v1/admin/artisans/:id/verify`
Approves or rejects artisan profile verification with reason.
- **Auth:** Bearer Token (Role: ADMIN or SUPER_ADMIN)
- **Request Body:**
```json
{
  "status": "VERIFIED",
  "reviewNotes": "Aadhaar and Artisan Card verified against Ministry of Textiles registry."
}
```

##### `GET /api/v1/admin/analytics`
Platform overview: Gross Merchandise Value (GMV), active artisans, verification queue size, orders completed.
