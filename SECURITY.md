# KAARIGAR AI — FRONTEND SECURITY CHARTER

**Security Classification:** Level-2 Production E-Commerce & Creator Portal  
**Target Compliance:** OWASP Top 10 Web Application Security, ISO 27001 Data Confidentiality  

---

## 1. ENVIRONMENT VARIABLE CLASSIFICATION & BOUNDARIES

### 1.1 Public Variables (Safe for Browser Bundle)
All variables prefixed with `NEXT_PUBLIC_` are bundled into the client JavaScript bundle. They MUST NOT contain secret keys:

```env
# API Gateway
NEXT_PUBLIC_API_URL="https://api.kaarigar.in/api/v1"

# Firebase Client Configuration (Public API Keys per Google Security Model)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyA..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="kaarigar-prod.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="kaarigar-prod"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="kaarigar-prod.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="928371928"
NEXT_PUBLIC_FIREBASE_APP_ID="1:928371928:web:abcdef"

# Application Public Config
NEXT_PUBLIC_APP_NAME="Kaarigar AI"
NEXT_PUBLIC_APP_URL="https://kaarigar.in"
```

### 1.2 Strictly Forbidden in Frontend
The following secrets belong exclusively to `kaarigar-backend` and are strictly barred from this repository:
- `FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY` / `GOOGLE_APPLICATION_CREDENTIALS`
- `DATABASE_URL` (PostgreSQL connection strings)
- `REDIS_URL`
- Payment gateway secret keys (`RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`)
- JWT private signing secrets

---

## 2. FIREBASE AUTHENTICATION BOUNDARIES & TOKEN EXCHANGE

1. **Client Identity Verification:** The browser uses the Firebase Client SDK solely to authenticate with Google Identity Providers and obtain a signed ID Token (`JWT`).
2. **Zero Client Trust:** The frontend NEVER grants role authorization (e.g. `isArtisan`, `isAdmin`) based on client-side state, localStorage, or cookies alone.
3. **Backend Attestation:** The client immediately sends the ID Token to `POST /auth/verify-token`. The backend verifies the cryptographic signature with Google public certs via Firebase Admin SDK and issues the verified user record and roles from PostgreSQL.
4. **Token Expiry & Refresh:** Firebase Client SDK automatically manages silent token refreshes. The API client intercepts 401 Unauthorized responses and attempts one token refresh before forcing logout.

---

## 3. DEFENSE AGAINST WEB VULNERABILITIES

### 3.1 Cross-Site Scripting (XSS)
- React 19 JSX automatically escapes all evaluated values before DOM insertion.
- Dangerous methods (`dangerouslySetInnerHTML`) are banned in general UI components.
- Markdown rendering (e.g. in craft stories) is sanitized with strict allowed tags and attributes.
- Content Security Policy (CSP) headers are configured in `next.config.ts`.

### 3.2 Cross-Site Request Forgery (CSRF)
- The REST API communicates via JSON payloads and Authorization Bearer headers.
- Since browsers do not automatically attach Authorization headers across origins (unlike ambient cookies), classical cross-origin CSRF is mitigated.
- State-changing actions (checkout, product creation) require active session headers.

### 3.3 Open Redirect Vulnerabilities
- Authentication redirects (e.g., `returnUrl` query parameters) are strictly validated:
  - Must begin with a single forward slash (`/`) and NOT double slash (`//` which redirects to external schemes).
  - External domains are rejected, falling back to `/`.

---

## 4. ROUTE GUARDS & ACCESS CONTROL

Client route guards enforce visual navigation boundaries:
- `/dashboard/*`: Requires active session with `role === 'artisan' || role === 'admin'`. Unauthenticated visitors are redirected to `/login?redirect=/dashboard`.
- `/admin/*`: Requires active session with `role === 'admin'`. Non-admins redirected to `/`.
- `/account/*`: Requires active authenticated session.
- **Backend Enforces Authority:** Even if a malicious actor bypasses client route guards, the backend API rejects unauthorized requests with `403 Forbidden`.

---

## 5. SENSITIVE DATA & PRIVACY PROTECTION

- **Payment Data:** Credit card numbers and UPI PINs never touch our servers or frontend state. Checkout uses tokenized gateways or redirects.
- **Artisan Privacy:** Sensitive tax details (PAN, GSTIN) and personal phone numbers are masked on public artisan profiles; only public workshop location and studio name are displayed.

---

## 6. SECURITY TEST CASES CHECKLIST

- [x] Reject external URL redirects in login/auth callbacks.
- [x] Verify API client transmits Bearer token in HTTPS headers.
- [x] Verify no Firebase Admin credentials exist in `.env.example` or code.
- [x] Verify form inputs sanitize malicious script tags.
- [x] Verify role escalation cannot be achieved via client-side storage tampering.
