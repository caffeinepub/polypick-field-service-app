export interface ClientContact {
  id: string; // uuid-like: Date.now() + random
  name: string;
  department: string; // free text
  designation: string;
  phone: string;
  email: string;
}

// Encode contacts array into notes string (preserves existing content)
export function encodeContacts(
  notes: string,
  contacts: ClientContact[],
): string {
  const stripped = notes.replace(/\[CONTACTS:[^\]]*\]\s*/g, "").trim();
  if (contacts.length === 0) return stripped;
  const encoded = btoa(JSON.stringify(contacts));
  return `[CONTACTS:${encoded}]${stripped ? ` ${stripped}` : ""}`;
}

// Decode contacts array from notes string
export function decodeContacts(notes: string): ClientContact[] {
  const m = notes.match(/\[CONTACTS:([^\]]+)\]/);
  if (!m) return [];
  try {
    return JSON.parse(atob(m[1])) as ClientContact[];
  } catch {
    return [];
  }
}

// Strip contacts tag from notes (for display)
export function stripContactsTag(notes: string): string {
  return notes.replace(/\[CONTACTS:[^\]]*\]\s*/g, "").trim();
}

// Generate simple unique ID
export function genContactId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
