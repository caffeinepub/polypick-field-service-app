# Polypick Engineers Field Service App

## Current State
Full-featured field service app with: Clients, PPI, TA DA, Visit Planner, Daily Report, Marketing Report, Liner Installation, Service Tickets, Targets, Activity Tracker, Reports, Staff, Settings, Polypick Assistant pages. Sidebar navigation with admin-only links. Mobile-first layout with bottom nav.

## Requested Changes (Diff)

### Add
1. **Staff Location Tracker Page** (`/location-tracker`) -- Admin-only page showing field staff GPS check-in locations. Staff can check-in with GPS (browser geolocation API), check-out, add visit notes. Admin sees all staff locations on a simple list/card view with map link (opens Google Maps). Data stored in localStorage per staff.
2. **Weekly Report Page** (`/weekly-report`) -- Auto-generates weekly summary: visits count, PPI entries, TA DA claims, top clients, daily activity. "Download PDF" button for the report. Accessible via Sidebar.
3. **Outlook Web Link Button** -- On ClientDetailPage contacts section, add a mail icon button that opens `https://outlook.live.com/mail/0/new?to={email}` in new tab. Already have Email Compose button but this specifically opens Outlook Web.
4. **Email Log Tab** -- Add "Email Log" tab in ClientDetailPage (alongside existing tabs). Users can add manual email log entries (subject, date, direction Sent/Received, summary). Stored in localStorage.
5. **Offline Mode Indicator** -- Small banner/pill in the app header/top area showing online/offline status using browser `navigator.onLine` + `online`/`offline` events. When offline, show amber "Offline" badge. When back online, show brief "Back Online" toast.

### Modify
- **Sidebar.tsx** -- Add "Location Tracker" (MapPin icon, adminOnly) and "Weekly Report" (FileBarChart icon) nav items.
- **routeTree.tsx** -- Add routes for `/location-tracker` and `/weekly-report`.
- **RootLayout.tsx** -- Add offline indicator component.

### Remove
Nothing removed.

## Implementation Plan
1. Create `StaffLocationPage.tsx` -- GPS check-in/out, staff location list, Google Maps link.
2. Create `WeeklyReportPage.tsx` -- Reads localStorage data to compute weekly stats, renders summary, PDF export via window.print().
3. Create `OfflineIndicator.tsx` -- useOnlineStatus hook, show banner when offline.
4. Modify `ClientDetailPage.tsx` -- Add Email Log tab with add/list entries.
5. Modify `Sidebar.tsx` -- Add 2 new nav items.
6. Modify `routeTree.tsx` -- Register 2 new routes.
7. Modify `RootLayout.tsx` -- Include OfflineIndicator.
