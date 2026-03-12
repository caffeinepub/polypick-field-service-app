function csvEscape(val) {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
function exportCSV(rows, filename) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(","))
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function exportAoACSV(data, filename) {
  const lines = data.map((row) => row.map(csvEscape).join(","));
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export {
  exportAoACSV as a,
  exportCSV as e
};
