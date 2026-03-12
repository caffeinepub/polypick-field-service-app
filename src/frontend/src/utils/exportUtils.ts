/**
 * Simple CSV/Excel export utilities (no external dependencies)
 */

function csvEscape(val: unknown): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportCSV(
  rows: Record<string, unknown>[],
  filename: string,
): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAoACSV(data: unknown[][], filename: string): void {
  const lines = data.map((row) => row.map(csvEscape).join(","));
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseCSVFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      const rows = lines.map((line) => {
        const result: string[] = [];
        let inQuote = false;
        let cur = "";
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') {
            if (inQuote && line[i + 1] === '"') {
              cur += '"';
              i++;
            } else {
              inQuote = !inQuote;
            }
          } else if (ch === "," && !inQuote) {
            result.push(cur);
            cur = "";
          } else {
            cur += ch;
          }
        }
        result.push(cur);
        return result;
      });
      resolve(rows);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
