# TaazaTokari Delivery Partner App

## Overview
Delivery partner operations mobile application for assigned deliveries, navigation, cash collection (COD), and earnings tracking.

## Technology Stack (Approved V1)
- **Framework:** React Native with Expo (Dev Client / Prebuild)
- **Language:** TypeScript
- **Backend SDK:** `@react-native-firebase` (Native Phone Auth, FCM Push Notifications, Cloud Firestore)
- **Build Target:** Standalone Android APK (`.apk` via EAS Build profile `preview` with managed Keystore for sideload installation)

## Scope (Phase 4)
- Registered Mobile + OTP Login (Restricted to Admin-created partner accounts)
- 3 Tabs: Assigned Orders, History, Profile
- Assigned Orders: Priority sorted, View Order, Direct Customer Call (`tel:` Intent), Google Maps Navigation (`geo:` Intent)
- Landmark Photo: Read-only preview of customer-uploaded landmark image (NO camera permissions required in V1)
- Delivery Actions: "Payment received and order delivered" confirmation or "Unable to Deliver" with mandatory reason dropdown
- Cash & Earnings: COD Collected Today, COD Pending to Submit, and Partner Payable Deliveries (`count × rate`)

*Note: UI implementation begins in Phase 4 after Customer App setup.*
