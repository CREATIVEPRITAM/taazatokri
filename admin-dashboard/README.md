# TaazaTokari Admin Dashboard

## Overview
Desktop operational control center for TaazaTokari: managing orders, auto-assignment, procurement requirements, catalog, partner accounts, and COD settlements.

## Technology Stack (Approved V1)
- **Framework:** React + Vite
- **Language:** TypeScript
- **Backend SDK:** Firebase Web SDK (v10 modular - Auth, Firestore, Storage)
- **Styling:** Vanilla CSS with unified Design Tokens (Green-accented operational UI)
- **Export & Print:** Native CSV exporter and print stylesheets for daily procurement lists

## Modules (Phase 2)
1. **Dashboard Home:** Daily summary counters, quick actions, attention required
2. **Orders:** Filtered orders table, partner manual override, attention required queue
3. **Purchase Requirements:** Date-based demand consolidation, category grouping, print/export
4. **Products / Inventory:** Fresh (no stock tracking) and Inventory items management
5. **Categories:** 6 default categories + custom management
6. **Customers:** Customer list and account activation/blocking
7. **Delivery Partners:** Partner accounts and Sector/Block area mappings
8. **COD & Partner Payment:** Mark COD as Settled, mark Partner Payment as Paid
9. **Notifications / Offers:** Promotional banners and manual customer alerts
10. **Settings:** Business rules, opening time, cutoff times, support channels, area management

*Note: UI implementation begins in Phase 2.*
