# Polypick Field Service App

## Current State
Full-stack app with: Internet Identity login, Clients directory, PPI pipeline (Inquiry/Offer/Order), TA DA Claims, Visit Planner, Marketing Report, Reports, Staff management, Role-based access (Admin/Manager/Marketing/Service).

Backend has: createClient, getAllClients, createInteraction, getAllInteractions, createVisitLog, getAllVisits, submitClaim, getAllClaims, approveClaim, rejectClaim, user profiles, role management.

No Daily Report feature exists. No pre-loaded client data exists.

## Requested Changes (Diff)

### Add
1. **Daily Report Page** (`/daily-report`) -- A form where staff can submit a daily field report. Fields:
   - Report Date (date picker, defaults to today)
   - Staff Name (auto-filled from profile)
   - Report Text (large textarea -- free-form, multi-line, like the sample report pasted by user)
   - Linked Clients (multi-select from existing clients list -- optional)
   - Next Action / Pending Items (textarea)
   - Submit button

2. **Daily Report List for Admin/Manager** -- On the Daily Report page, admins/managers see all submitted reports from all staff in a list, grouped by date. Staff see only their own reports.

3. **Daily Report route** -- Add `/daily-report` route to routeTree.tsx

4. **Navigation link** -- Add "Daily Report" link to sidebar/nav

5. **Pre-seeded client data** -- On the ClientsPage, add a "Seed Sample Clients" button (visible only when client list is empty) that bulk-adds all 12 clients from Raju Singh's report:
   - BRPL Barbil (Steel Plant, Barbil)
   - PPL Pradeep (Steel Plant, Pradeep)
   - Jagnnath Steel RSP Rourkela (Steel Plant, Rourkela)
   - Rashmi Metallic Unit 1 (Steel Plant, Khargpur)
   - JSL Jajpur (Steel Plant, Jajpur)
   - Shyam Metallic (Steel Plant, Khargpur)
   - IMFA Steel (Steel Plant, Jajpur)
   - Gerawa Steel (Steel Plant, Barbil)
   - Bengal Energy (Power Plant, Khargpur)
   - Rungta Kalyani (Mining, Kalyani)
   - Vedanta Bhadrak (Steel Plant, Bhadrak)
   - MECON Dhanbad (Other, Dhanbad)

### Modify
- `routeTree.tsx` -- Add DailyReportPage route
- `RootLayout` sidebar/nav -- Add Daily Report nav link
- `ClientsPage` -- Add "Add Sample Clients" bulk-seed button (only when list is empty)

### Remove
- Nothing removed

## Implementation Plan
1. Create `DailyReportPage.tsx` -- form for submitting reports + list of reports (stored in localStorage since no backend schema for reports, using `notes` field encoding or local state; use localStorage keyed by user principal for persistence)
2. Add route `/daily-report` to `routeTree.tsx`
3. Add nav link in `RootLayout`
4. Add "Add Sample Clients" button in `ClientsPage` that calls `createClient` for each of the 12 clients in sequence
5. Validate and build
