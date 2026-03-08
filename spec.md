# Polypick Field Service App

## Current State
Full-stack app with Motoko backend and React frontend. Client module has basic fields: name, company, phone, email, address, notes, industry (encoded in notes). ClientDetailPage shows contact details and interactions. No support for multiple contacts per client or department tracking.

## Requested Changes (Diff)

### Add
- **Multiple Contacts per Client**: Each client can have multiple contact persons, each with: Name, Phone, Email, Designation, Department (free text, manually entered)
- **Contacts Tab in ClientDetailPage**: A dedicated "Contacts" tab alongside "Interactions" in the client detail view
- **Add/Edit/Delete Contact UI**: Form to add new contacts, edit existing, and remove them
- **Contact storage**: Contacts stored as JSON in the client's `notes` field (encoded alongside existing industry tag), since backend schema cannot be changed

### Modify
- **ClientDetailPage**: Add tabbed layout -- "Contacts" tab and "Interactions" tab. Contacts tab shows all contacts for this client with add/edit/delete actions.
- **ClientsPage**: Show contact count badge on client rows (e.g. "3 contacts")

### Remove
- Nothing removed

## Implementation Plan
1. Create a `clientContacts` utility module (`src/utils/clientContacts.ts`) to encode/decode contact list JSON in the client's notes field (alongside `[IND:...]` tag)
2. Update `ClientDetailPage.tsx`:
   - Add tabs (Contacts / Interactions)
   - Contacts tab: list all contacts with name, department, designation, phone, email
   - Add Contact dialog: fields for name, department (free text), designation, phone, email
   - Edit Contact inline or via dialog
   - Delete Contact with confirmation
3. Update `ClientsPage.tsx`: show contact count in table rows
4. Validate and deploy
