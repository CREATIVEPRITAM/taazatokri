# TaazaTokari Firebase Infrastructure & Backend Contracts

## 1. Plan & Billing Architecture Note
> [!IMPORTANT]
> - The live Firebase project is currently on the **Spark Plan (Free Tier)**.
> - **Live production deployment of Cloud Functions requires upgrading to the Blaze Plan (Pay-as-you-go)**.
> - **Local Development & Testing:** All Cloud Functions and Firestore rules are fully implemented and can be run/tested locally via the **Firebase Local Emulator Suite** (`firebase emulators:start`) without needing Blaze billing.
> - Billing must NOT be enabled automatically.

---

## 2. Identity & Access Separation Model

1. **Customers (`users/{uid}`):**
   - Stored strictly in the `users` collection keyed by Firebase Auth UID.
   - Holds customer name, mobile, and accountStatus (`active` | `blocked`).
   - Role fields inside `users` are never checked or trusted for elevated access. Customers cannot promote themselves.
2. **Admins (`admins/{uid}`):**
   - Stored strictly in the dedicated `admins` collection.
   - Validated via `admins/{uid}` document existence and/or custom claims (`request.auth.token.admin == true`).
   - Single Admin role in V1; multiple admin accounts allowed.
3. **Delivery Partners (`deliveryPartners/{authUid}`):**
   - Stored strictly in the `deliveryPartners` collection keyed by Firebase Auth UID (`authUid`).
   - **`authUid`** is the authoritative security identifier used for Firestore rules and authorization.
   - **`partnerId`** (e.g., `DP001`) is strictly a human-readable display reference.
   - Partners can only read their own profile; only Admin can create or update partner documents.

---

## 3. Order Write-Path Security

- **Direct Customer Write Access is DENIED:**
  - `orders` collection rules strictly block direct client `create` and `update` by customers.
  - Customers can only READ orders where `resource.data.customerId == request.auth.uid`.
- **Authoritative Write Paths (Cloud Functions):**
  - **`createOrder`:** The only authoritative path for order creation. Enforces Asia/Kolkata ordering window (`openingTime <= now < 23:00`), validates items & server-side prices, enforces ₹50 minimum, auto-assigns primary partner (`assignedPartnerUid`), and atomically writes the order.
  - **`cancelOrder`:** The only authoritative path for customer cancellation. Validates caller ownership, ensures order is in `order_placed` status, strictly enforces the 11:00 PM cutoff on the placement day in Asia/Kolkata, and atomically updates status to `cancelled`.
- **Delivery Partner Progression:**
  - Assigned Delivery Partner (verified via `resource.data.assignedPartnerUid == request.auth.uid`) can only transition order status (`out_for_delivery`, `delivered`, `failed`) and confirm COD collection. They cannot alter items, bill summary, or customer address details.

---

## 4. Local Emulator Suite Configuration

The local development environment is configured in `firebase.json`:
- **Auth Emulator:** `http://localhost:9099`
- **Firestore Emulator:** `http://localhost:8080`
- **Functions Emulator:** `http://localhost:5001`
- **Emulator UI:** `http://localhost:4000`

Run emulators locally:
```bash
firebase emulators:start
```
