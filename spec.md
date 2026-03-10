# Polypick Field Service App

## Current State
Full-stack field service app with:
- Visit Planner (VisitsPage.tsx) with single-visit add dialog, travel matrix, tabs (all/planned/completed/cancelled)
- Visits can be added one at a time via "Plan Visit" button
- CSV/Excel import already exists for Clients page
- Backend supports createVisit, useMyVisits, useAllVisits

## Requested Changes (Diff)

### Add
- **Bulk Visit Upload** feature on VisitsPage:
  - "Bulk Upload" button next to existing "Plan Visit" button
  - A dialog with two tabs: (1) Download Sample CSV template, (2) Upload CSV/Excel file
  - Sample CSV columns: Date (YYYY-MM-DD), Client Name, From, To, Distance (km), Purpose
  - On upload: parse the file, match client names to existing clients list (case-insensitive), show a preview table of parsed rows with validation errors highlighted (e.g. unknown client name, missing date)
  - User can confirm the preview → all valid rows are submitted as visits in bulk using createVisit mutation
  - Show success count and skip count after import

### Modify
- VisitsPage.tsx: add Bulk Upload button and dialog (do not remove any existing features)

### Remove
- Nothing

## Implementation Plan
1. Add a "Bulk Upload" button in the header section of VisitsPage next to "Plan Visit"
2. Create a bulk upload dialog with:
   - Tab 1: "Download Template" -- button to download a sample CSV with headers and 2-3 example rows
   - Tab 2: "Upload File" -- file input accepting .csv and .xlsx files
3. CSV parsing: use PapaParse (already available or add as inline logic) for CSV; for XLSX use SheetJS (xlsx library) if available, else CSV only
4. After parsing, show a preview table: Date | Client | Route | Purpose | Status (Valid/Error)
5. "Import All Valid" button -- loop through valid rows, call createVisit.mutateAsync for each, show loading state
6. Show toast: "X visits planned, Y skipped (client not found)"
7. Sample CSV download: dynamically generate and trigger browser download of a CSV string with example data
