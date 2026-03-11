# Polypick Engineers Field Service App

## Current State
App has: Dashboard, Clients, PPI/Interactions, TA DA, Visits, Daily Report, Reports, Staff, Marketing Report, Profile. BottomNav has 5 items. No personal assistant module exists.

## Requested Changes (Diff)

### Add
- New page: `/assistant` — Polypick Assistant (Smart Rule-Based)
  - **Daily Briefing card**: Today's date, visits planned today, pending TA DA claims, pending follow-ups count, pipeline stuck items
  - **Smart Reminders**: List of auto-generated reminders based on app data (e.g., visits not checked-in, claims pending >3 days)
  - **Pipeline Alerts**: Enquiries/offers stuck >30 days highlighted as action items
  - **Quick Commands**: Search box where user types commands like "add visit", "check TA DA", "add client" and gets shortcut buttons to navigate directly
  - **My To-Do List**: Add, check off, delete personal to-do items (stored in localStorage)
  - **Quick Notes**: A small notepad section (stored in localStorage)
  - **Follow-up Tracker**: List of follow-ups with due dates, add/complete/delete (localStorage)
  - **Monthly Performance Summary**: Stats for current month (visits done vs planned, claims submitted, PPI entries added)
- New bottom nav item: "Assistant" with Bot icon, replacing one of existing 5 items or adding as 6th (keep all 5, but replace "Report" with "More" linking to assistant + report)

### Modify
- `routeTree.tsx`: Add `/assistant` route
- `BottomNav.tsx`: Replace "Report" link with "Assistant" (Bot icon); move daily report access to assistant page or sidebar

### Remove
- Nothing removed

## Implementation Plan
1. Create `AssistantPage.tsx` with all sections: Daily Briefing, Smart Reminders, Pipeline Alerts, Quick Commands, To-Do List, Quick Notes, Follow-up Tracker, Monthly Summary
2. Use existing hooks (useMyVisits, useAllVisits, useMyClaims, useAllClaims, usePipelineStats, useIsAdmin) for real data
3. Store To-Do, Notes, Follow-ups in localStorage with typed helpers
4. Update `routeTree.tsx` to add `/assistant` lazy route
5. Update `BottomNav.tsx`: replace "Report" with "Assistant" (Bot icon)
6. Add a quick-access link to Daily Report from the Assistant page
