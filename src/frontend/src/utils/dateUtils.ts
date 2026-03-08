/**
 * Convert a nanosecond bigint timestamp to a JS Date
 */
export function nsToDate(ns: bigint): Date {
  return new Date(Number(ns / 1_000_000n));
}

/**
 * Convert a JS Date to nanosecond bigint timestamp
 */
export function dateToNs(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

/**
 * Format a nanosecond timestamp for display
 */
export function formatDate(ns: bigint): string {
  return nsToDate(ns).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a nanosecond timestamp to ISO date string (for input[type=date])
 */
export function nsToDateInput(ns: bigint): string {
  const d = nsToDate(ns);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parse an input date string (YYYY-MM-DD) to ns bigint
 */
export function dateInputToNs(dateStr: string): bigint {
  if (!dateStr) return BigInt(Date.now()) * 1_000_000n;
  return BigInt(new Date(dateStr).getTime()) * 1_000_000n;
}

/**
 * Get today as YYYY-MM-DD
 */
export function todayInputStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Format amount stored as bigint
 */
export function formatAmount(amount: bigint | undefined): string {
  if (amount === undefined || amount === null) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}
