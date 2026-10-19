# TaazaTokari (V1) — Farm-to-Home Fresh Produce Delivery Platform

Production-oriented repository for **TaazaTokari V1**.

## 1. Project Overview & Business Model
TaazaTokari operates on an **order-first, next-morning delivery procurement model**:
- **Ordering Cutoff:** Strictly **11:00 PM IST (23:00)** daily.
- **Configurable Ordering Window:** Opening time is Admin-configurable via system settings (provisional default `06:00 AM IST`), closing at the locked cutoff of **11:00 PM IST (23:00)**. When closed, checkout is blocked with: *"Ordering is currently closed. The next ordering window opens at [opening time]."*
- **Cancellation Cutoff:** Customer self-cancellation is strictly permitted only before **11:00 PM IST** on the order placement date. At or after 11:00 PM, cancellation is blocked with: *"Cancellation window closed."*
- **Delivery Window:** Fixed **7:00 AM – 9:30 AM** next eligible morning.
- **Commercial Rules:**
  - Minimum order amount: **₹50** (checkout blocked below ₹50).
  - Delivery charge: **₹20** for orders ₹50–₹99; **₹0 (Free)** for orders ₹100+.
  - Payment: **Cash on Delivery (COD) only** in V1.
- **Procurement & Freshness:** Fresh produce does not require warehouse stock tracking. Demand is consolidated daily by delivery date from customer orders. Stock tracking applies only to inventory-based packaged goods.
- **Area Auto-Assignment:** City → Sector/Area → Block. Orders are automatically assigned to the primary delivery partner mapped to that Block. Unmapped orders appear in Admin *Attention Required*.

---

## 2. Approved Technology Stack

| Surface | Technology Stack | Key Capabilities |
| :--- | :--- | :--- |
| **Customer App** | React Native with Expo (Dev Client / Prebuild), TypeScript | Native Phone OTP (SMS Retriever), Push Notifications (FCM), Voice/Text Search, Standalone APK |
| **Delivery Partner App** | React Native with Expo (Dev Client / Prebuild), TypeScript | Native Phone OTP for Admin-whitelisted numbers, Call Customer intent, Google Maps navigation, Landmark photo viewer (No Camera permission), Standalone APK |
| **Admin Dashboard** | React + Vite + TypeScript, Firebase Web SDK, Vanilla CSS | 10 Operational Modules, Procurement Aggregation & Print, Area & Partner Mapping, COD Settlement |
| **Backend** | Firebase Auth, Cloud Firestore, Firebase Storage, FCM, Cloud Functions (TypeScript) | Atomic Order ID generation, Sector/Block auto-assignment, Server-side cutoff enforcement (Asia/Kolkata) |
| **Shared Core** | `@taazatokri/shared` (TypeScript) | Pure contracts, schemas, pricing calculator, and IST date/time utilities |

---

## 3. Repository Structure

```
taazatokri/
├── customer-app/         # Customer Android App (React Native Expo + TypeScript)
├── delivery-app/         # Delivery Partner Android App (React Native Expo + TypeScript)
├── admin-dashboard/      # Admin Web Dashboard (React + Vite + TypeScript)
├── firebase/             # Firebase configuration, rules & Cloud Functions
├── shared/               # Pure TypeScript shared package (@taazatokri/shared)
│   ├── src/
│   │   ├── types/        # Order, Product, Category, Area, User, Settlement interfaces
│   │   ├── constants/    # Business rules, default categories, status labels
│   │   └── utils/        # Pricing calculations, IST date/time helpers
│   ├── tsconfig.json
│   └── package.json
├── docs/                 # PRD and Master Blueprint (Source of Truth)
├── tsconfig.base.json    # Base TypeScript configuration
├── package.json          # Root workspace configuration
└── .gitignore
```

---

## 4. Development Roadmap

- [x] **Phase 1: Project Setup & Shared Core** (Root setup, Git init, `@taazatokri/shared` contracts, Base TS configs, placeholder boundaries)
- [ ] **Phase 2: Admin Dashboard & Catalog Management** (Desktop operations, Area master, Delivery partners, Catalog, Order queue, Purchase requirements)
- [ ] **Phase 3: Customer App** (Shopping, address selection with landmark photo, cart rules, atomic checkout, tracking & cancellation)
- [ ] **Phase 4: Delivery Partner App** (Whitelisted login, assigned orders, customer call, navigation, COD delivery confirmation, earnings)
- [ ] **Phase 5: Cloud Functions, Push Notifications & APK Builds** (Triggers, FCM dispatch, EAS APK generation with managed Keystore)
