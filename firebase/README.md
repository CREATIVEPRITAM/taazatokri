# TaazaTokari Firebase Infrastructure

## Overview
Backend services and rules configuration for TaazaTokari V1.

## Services (Approved V1)
- **Firebase Authentication:**
  - Customer & Delivery Partner: Phone Auth (OTP) via native Android SMS Retriever
  - Admin: Email + Password authentication
- **Cloud Firestore:** Realtime NoSQL database with strict security rules enforcing Asia/Kolkata ordering cutoff and role-based boundaries
- **Firebase Storage:** Asset storage for product photos, category icons, promo banners, and customer landmark photos
- **Firebase Cloud Messaging (FCM):** Push notifications for order status transitions (`order_placed`, `confirmed`, `out_for_delivery`, `delivered`, `failed`)
- **Cloud Functions:**
  - Atomic order placement and human-readable Order ID reservation
  - Sector + Block auto-assignment to mapped primary delivery partner
  - Purchase Requirement demand aggregation engine
  - FCM trigger dispatcher

*Note: Firebase implementation begins in Phase 1 backend / Phase 2 upon approval.*
