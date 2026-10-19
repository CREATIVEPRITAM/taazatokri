# TaazaTokari Customer App

## Overview
Customer-facing mobile application for the TaazaTokari farm-to-home fresh produce delivery platform.

## Technology Stack (Approved V1)
- **Framework:** React Native with Expo (Dev Client / Prebuild)
- **Language:** TypeScript
- **Backend SDK:** `@react-native-firebase` (Native Android Phone Auth with SMS Retriever, FCM Push Notifications, Cloud Firestore)
- **Styling:** React Native StyleSheet / Flexbox
- **Build Target:** Standalone Android APK (`.apk` via EAS Build profile `preview` with managed Keystore for sideload installation)

## Scope (Phase 3)
- Phone Number + OTP Authentication (SMS Retriever)
- Bottom Navigation (Home, Orders, Cart, Profile)
- Home (Banners, 6 Default Categories, "Is Mausam Mein Taaza", Voice/Text Search)
- Structured Address Selection (Sector + Block from master data, optional landmark photo)
- Cart & Checkout (Strict ₹50 minimum validation, deterministic ₹20 / free delivery fee, ordering window guard)
- Order Tracking & Self-Cancellation before 11:00 PM cutoff

*Note: UI implementation begins in Phase 3 after Phase 2 Admin setup.*
