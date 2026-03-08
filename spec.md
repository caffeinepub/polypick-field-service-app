# Polypick Engineers Field Service App

## Current State

The app is fully scaffolded with:
- Internet Identity authentication, profile setup, first-user-becomes-admin pattern
- Clients management (create/read/update/delete with company, phone, email, address, notes)
- Client interactions pipeline: Inquiry, Offer, Order, Follow-up with status tracking
- TA DA Claims: staff submit travel/daily allowance claims; admin approves/rejects with remarks
- Visit Planner: plan visits to clients, mark complete with notes
- Reports page: charts for pipeline, interaction status, visits/claims per staff
- Staff Management: admin assigns roles (admin/user) by principal ID
- Sidebar navigation with all pages linked

Backend APIs (main.mo): createClient, updateClient, deleteClient, getAllClients, createInteraction, updateInteraction, deleteInteraction, getAllInteractions, submitClaim, approveClaim, rejectClaim, getAllClaims, getClaimsForCaller, createVisitLog, updateVisitLog, deleteVisitLog, getAllVisits, getVisitsForCaller, user profile, stats, reports.

## Requested Changes (Diff)

### Add

1. **Live Location capture on Visit check-in** -- When a user plans or completes a visit, the app should request GPS coordinates via `navigator.geolocation`. Captured lat/lng stored in the `purpose` or `completionNotes` field as a prefixed string (e.g. `[GPS: 18.5204,73.8567] <actual notes>`). Display the coordinates as a clickable Google Maps link in the visit table.

2. **Service Report field on TA DA Claims** -- Add a "Service Report / Daily Work" textarea to the TA DA claim submission form. Store it in the existing `notes` field, prefixed with `[SR]` so it's identifiable. Display it as a "Service Report" section in the claims table row detail.

3. **Bill Photo Upload on TA DA Claims** -- Add a bill photo upload button (camera icon) on the claim submission form. Use browser `FileReader` to convert image to base64, store as a data URL appended to `notes` with prefix `[PHOTO_B64]`. Display a thumbnail icon in the claims table; clicking opens the image in a lightbox/modal. (blob-storage component will be selected for future proper storage but frontend can use inline base64 for now.)

4. **Travel Matrix panel on Visit Planner** -- Below the visits table, add a "Travel Matrix" summary card showing: list of unique clients visited this month, visit count per client, and total visits this month. Display as a simple table or card grid.

5. **Marketing Monthly Report page** -- New page at `/marketing-report`. Shows:
   - Monthly summary: total visits this month, unique clients visited, breakdown by client
   - Daily visit log grouped by date
   - A "Monthly Report" export-ready card layout (print-friendly)
   - Staff can only see their own; admin sees all.
   Route added to routeTree and Sidebar.

6. **Daily Morning Visit Plan enhancements** -- On the Visits page, add a "Today's Plan" section at the top showing only today's planned visits in card format with client name, purpose, and a "Check In" button that captures live location before marking as in-progress.

### Modify

- **TA DA Claims table**: Show a "Report" column with a snippet of service report text; show a photo thumbnail if photo is attached.
- **Visit complete dialog**: Add a location capture step ("Capture Location" button) that fills a read-only lat/lng field before user can submit. Show GPS coordinates in visit row in the table.
- **Sidebar**: Add "Marketing Report" link (visible to all) between Visits and Reports.
- **Dashboard**: Update quick actions to include "Marketing Report".

### Remove

Nothing removed.

## Implementation Plan

1. **LiveLocation utility** (`utils/locationUtils.ts`): `captureLocation(): Promise<{lat, lng} | null>` wrapper around `navigator.geolocation.getCurrentPosition`.

2. **TA DA form updates** (`TaDaPage.tsx`):
   - Add "Service Report / Daily Work" textarea.
   - Add bill photo file input with preview thumbnail.
   - Serialize service report into `notes` as `[SR]<text>[/SR]` prefix.
   - Serialize photo as `[PHOTO_B64]<dataURL>[/PHOTO_B64]` appended to notes.
   - Parse and display service report snippet and photo thumbnail in claim table rows.
   - Photo click opens a Dialog with full-size preview.

3. **Visit complete dialog update** (`VisitsPage.tsx`):
   - Add "Capture Location" button in complete dialog that calls `captureLocation()`.
   - Shows lat/lng as read-only text once captured.
   - Prepend `[GPS:lat,lng]` to `completionNotes`.
   - In the visits table, parse GPS prefix from completionNotes and render as a Google Maps link.
   - Also add location capture to the "Plan Visit" dialog (capture at time of planning).

4. **Travel Matrix** (`VisitsPage.tsx`):
   - Below the tab table, add a "This Month's Travel Matrix" card.
   - Aggregate visits by clientId for current month, show client name + visit count.

5. **Marketing Report page** (`pages/MarketingReportPage.tsx`):
   - New page with monthly summary stats, daily grouped visit log table.
   - Staff sees own visits; admin sees all.
   - Register route `/marketing-report` in routeTree and Sidebar.

6. **Sidebar update** (`components/Sidebar.tsx`):
   - Add "Marketing Report" nav item with `TrendingUp` icon.

7. **Dashboard update** (`DashboardPage.tsx`):
   - Add "Marketing Report" to quick actions grid.
