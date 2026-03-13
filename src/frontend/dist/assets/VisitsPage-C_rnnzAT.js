import { c as createLucideIcon, r as reactExports, ae as useIsAdmin, W as useAllVisits, an as useMyVisits, R as useClients, ao as useCreateVisit, ap as useUpdateVisit, aq as useDeleteVisit, b as useInternetIdentity, j as jsxRuntimeExports, ar as CalendarCheck, B as Button, n as Plus, C as Card, l as CardContent, X as Search, I as Input, S as Skeleton, m as formatDate, as as ArrowRight, h as Badge, p as StatusBadge, M as MapPin, at as Clock, au as CircleCheck, i as CardHeader, k as CardTitle, L as Label, q as LoaderCircle, z as ue, A as dateInputToNs, t as todayInputStr, a2 as Check } from "./index-DbjPUQDs.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-7AuvVhc2.js";
import { P as Popover, a as PopoverTrigger, C as ChevronsUpDown, b as PopoverContent, c as Command, d as CommandInput, e as CommandEmpty, f as CommandGroup, g as CommandItem } from "./popover-CEJwHijh.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-x_F93RN-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CpdBFqUb.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DqYZgDD1.js";
import { T as Textarea } from "./textarea-k-DTS19z.js";
import { a as Status } from "./backend.d-Ws4C8wFG.js";
import { e as exportCSV } from "./exportUtils-DtpCHa8s.js";
import { p as parseGPS, g as gpsToMapsURL, c as captureLocation, f as formatGPS } from "./locationUtils-C2fIUMVr.js";
import { F as FileDown } from "./file-down-BOOmYtoZ.js";
import { F as FileSpreadsheet } from "./file-spreadsheet-Ckmi8Sgt.js";
import { C as CalendarDays } from "./calendar-days-C_UUvtag.js";
import { T as Trash2 } from "./trash-2-AM3OX5RE.js";
import { A as ArrowLeft } from "./arrow-left-BifkhYrz.js";
import "./index-CzBemFCv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
];
const Ban = createLucideIcon("ban", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M12 12v6", key: "3ahymv" }],
  ["path", { d: "m15 15-3-3-3 3", key: "15xj92" }]
];
const FileUp = createLucideIcon("file-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12.75 7.09a3 3 0 0 1 2.16 2.16", key: "1d4wjd" }],
  [
    "path",
    {
      d: "M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568",
      key: "12yil7"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533", key: "lhrkcz" }],
  ["path", { d: "M9.13 9.13a3 3 0 0 0 3.74 3.74", key: "13wojd" }]
];
const MapPinOff = createLucideIcon("map-pin-off", __iconNode);
const STATUS_TABS = ["all", "planned", "completed", "cancelled"];
function printVisitsPDF(visits, tabLabel, getClientName) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const rows = visits.map((v) => {
    const meta = decodeTravelMeta(v.purpose);
    const route = meta.from || meta.to ? `${meta.from || "—"} → ${meta.to || "—"}${meta.dist ? ` (${meta.dist} km)` : ""}` : meta.purpose || "—";
    const statusDate = new Date(
      Number(v.plannedDate / 1000000n)
    ).toLocaleDateString("en-IN");
    return `
      <tr>
        <td>${statusDate}</td>
        <td>${getClientName(v.clientId)}</td>
        <td>${route}</td>
        <td style="text-transform:capitalize">${v.status}</td>
      </tr>`;
  }).join("");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Visit Report – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f0f0f0; padding: 8px 6px; text-align: left; font-size: 11px; border: 1px solid #ccc; }
        td { padding: 7px 6px; border: 1px solid #ddd; }
        tr:nth-child(even) td { background: #fafafa; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Visit Report – ${tabLabel}</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total: ${visits.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Route / Purpose</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
function printMonthlyVisitsPDF(visits, monthYear, getClientName) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const genDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const byDate = /* @__PURE__ */ new Map();
  for (const v of visits) {
    const d = new Date(Number(v.plannedDate / 1000000n));
    const key = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(v);
  }
  const sortedDates = Array.from(byDate.keys()).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  const sections = sortedDates.map((dateKey) => {
    const dayVisits = byDate.get(dateKey);
    const rows = dayVisits.map((v) => {
      const meta = decodeTravelMeta(v.purpose);
      const route = meta.from || meta.to ? `${meta.from || "—"} → ${meta.to || "—"}${meta.dist ? ` (${meta.dist} km)` : ""}` : "—";
      return `<tr>
            <td>${getClientName(v.clientId)}</td>
            <td>${route}</td>
            <td>${meta.dist ? `${meta.dist} km` : "—"}</td>
            <td style="text-transform:capitalize">${v.status}</td>
            <td>${meta.purpose || "—"}</td>
          </tr>`;
    }).join("");
    return `
      <div class="date-section">
        <h3>${dateKey}</h3>
        <table>
          <thead>
            <tr><th>Client</th><th>Route</th><th>Distance</th><th>Status</th><th>Purpose</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join("");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monthly Visit Plan – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        .date-section { margin-bottom: 20px; page-break-inside: avoid; }
        .date-section h3 { background: #f0f0f0; padding: 6px 10px; margin: 0 0 4px 0; font-size: 13px; border-left: 3px solid #222; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8f8f8; padding: 6px 5px; text-align: left; font-size: 11px; border: 1px solid #ccc; }
        td { padding: 5px; border: 1px solid #ddd; font-size: 11px; }
        tr:nth-child(even) td { background: #fafafa; }
        @media print { body { margin: 10px; } .date-section { page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Monthly Visit Plan – ${monthYear}</p>
        <p>Total Visits: ${visits.length} &nbsp;|&nbsp; Generated: ${genDate}</p>
      </div>
      ${sections || "<p style='text-align:center;color:#888'>No visits for this month.</p>"}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
function encodeTravelMeta(from, to, dist, purpose) {
  let prefix = "";
  if (from) prefix += `[FROM:${from}]`;
  if (to) prefix += `[TO:${to}]`;
  if (dist) prefix += `[DIST:${dist}]`;
  return prefix ? `${prefix} ${purpose}` : purpose;
}
function decodeTravelMeta(purposeStr) {
  const fromM = purposeStr.match(/\[FROM:([^\]]*)\]/);
  const toM = purposeStr.match(/\[TO:([^\]]*)\]/);
  const distM = purposeStr.match(/\[DIST:([^\]]*)\]/);
  const stripped = purposeStr.replace(/\[FROM:[^\]]*\]/g, "").replace(/\[TO:[^\]]*\]/g, "").replace(/\[DIST:[^\]]*\]/g, "").replace(/\[GPS:[^\]]+\]\s*/g, "").trim();
  return {
    from: fromM ? fromM[1] : "",
    to: toM ? toM[1] : "",
    dist: distM ? distM[1] : "",
    purpose: stripped
  };
}
function parseCSV(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => {
    const fields = [];
    let inQuotes = false;
    let current = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  });
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function getVisitsForDay(visits, year, month, day) {
  return visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1000000n));
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const emptyForm = {
  clientId: "",
  plannedDate: todayInputStr(),
  purpose: "",
  fromLocation: "",
  toLocation: "",
  distanceKm: "",
  capturedGps: null,
  capturingGps: false
};
function AddVisitForm({
  clients,
  isPending,
  onSubmit,
  onCancel
}) {
  const [form, setForm] = reactExports.useState({
    ...emptyForm,
    plannedDate: todayInputStr()
  });
  const [clientDropOpen, setClientDropOpen] = reactExports.useState(false);
  const [clientSearch, setClientSearch] = reactExports.useState("");
  const handleCaptureGps = async () => {
    setForm((p) => ({ ...p, capturingGps: true }));
    const loc = await captureLocation();
    setForm((p) => ({ ...p, capturingGps: false }));
    if (loc) {
      setForm((p) => ({ ...p, capturedGps: loc }));
      ue.success(
        `Location captured: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
      );
    } else {
      ue.error("Could not capture location");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientId) return;
    onSubmit({
      clientId: form.clientId,
      plannedDate: form.plannedDate,
      purpose: form.purpose,
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      distanceKm: form.distanceKm,
      capturedGps: form.capturedGps
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: clientDropOpen, onOpenChange: setClientDropOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              "data-ocid": "visits.client.select",
              className: "w-full justify-between font-normal",
              children: [
                form.clientId ? (() => {
                  const c = (clients ?? []).find(
                    (c2) => c2.id.toString() === form.clientId
                  );
                  return c ? `${c.name} – ${c.company}` : "Select client";
                })() : "Select client",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-[320px] p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { shouldFilter: false, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CommandInput,
              {
                placeholder: "Search client...",
                value: clientSearch,
                onValueChange: setClientSearch
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No client found." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { className: "max-h-60 overflow-y-auto", children: (clients ?? []).filter(
              (c) => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.company.toLowerCase().includes(clientSearch.toLowerCase())
            ).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              CommandItem,
              {
                value: c.id.toString(),
                onSelect: (v) => {
                  setForm((p) => ({ ...p, clientId: v }));
                  setClientSearch("");
                  setClientDropOpen(false);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Check,
                    {
                      className: `mr-2 h-4 w-4 ${form.clientId === c.id.toString() ? "opacity-100" : "opacity-0"}`
                    }
                  ),
                  c.name,
                  " – ",
                  c.company
                ]
              },
              c.id.toString()
            )) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Planned Date *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "visits.date.input",
            type: "date",
            value: form.plannedDate,
            onChange: (e) => setForm((p) => ({ ...p, plannedDate: e.target.value })),
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "From (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "visits.from.input",
            value: form.fromLocation,
            onChange: (e) => setForm((p) => ({ ...p, fromLocation: e.target.value })),
            placeholder: "Departure"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "To (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "visits.to.input",
            value: form.toLocation,
            onChange: (e) => setForm((p) => ({ ...p, toLocation: e.target.value })),
            placeholder: "Destination"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Distance (km)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "visits.distance.input",
            type: "number",
            min: "0",
            value: form.distanceKm,
            onChange: (e) => setForm((p) => ({ ...p, distanceKm: e.target.value })),
            placeholder: "0"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Purpose *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          "data-ocid": "visits.purpose.textarea",
          value: form.purpose,
          onChange: (e) => setForm((p) => ({ ...p, purpose: e.target.value })),
          rows: 3,
          placeholder: "Purpose of this visit...",
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current Location (optional)" }),
      form.capturedGps ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-emerald-600 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-700 font-mono text-xs flex-1", children: [
          "📍 ",
          form.capturedGps.lat.toFixed(5),
          ",",
          " ",
          form.capturedGps.lng.toFixed(5)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setForm((p) => ({ ...p, capturedGps: null })),
            className: "text-emerald-600 hover:text-emerald-800",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPinOff, { size: 13 })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "visits.capture_location.button",
          onClick: handleCaptureGps,
          disabled: form.capturingGps,
          className: "w-full gap-2 text-xs",
          children: [
            form.capturingGps ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13 }),
            form.capturingGps ? "Capturing…" : "Capture Current Location"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          "data-ocid": "visits.add.cancel_button",
          onClick: onCancel,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          "data-ocid": "visits.add.save_button",
          disabled: isPending || !form.clientId,
          children: [
            isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
            "Plan Visit"
          ]
        }
      )
    ] })
  ] });
}
function VisitsPage() {
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [visitSearch, setVisitSearch] = reactExports.useState("");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [completeOpen, setCompleteOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [completingVisit, setCompletingVisit] = reactExports.useState(null);
  const [completionNotes, setCompletionNotes] = reactExports.useState("");
  const [capturedCompleteGps, setCapturedCompleteGps] = reactExports.useState(null);
  const [capturingCompleteGps, setCapturingCompleteGps] = reactExports.useState(false);
  const [checkInMap, setCheckInMap] = reactExports.useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("polypick_visit_checkins") ?? "{}"
      );
    } catch {
      return {};
    }
  });
  const [checkOutMap, setCheckOutMap] = reactExports.useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("polypick_visit_checkouts") ?? "{}"
      );
    } catch {
      return {};
    }
  });
  const handleCheckIn = (visitId) => {
    const now2 = (/* @__PURE__ */ new Date()).toISOString();
    const updated = { ...checkInMap, [visitId]: now2 };
    setCheckInMap(updated);
    localStorage.setItem("polypick_visit_checkins", JSON.stringify(updated));
    ue.success("Checked in!");
  };
  const handleCheckOut = (visitId) => {
    const now2 = (/* @__PURE__ */ new Date()).toISOString();
    const updated = { ...checkOutMap, [visitId]: now2 };
    setCheckOutMap(updated);
    localStorage.setItem("polypick_visit_checkouts", JSON.stringify(updated));
    ue.success("Checked out!");
  };
  const formatDuration = (checkIn, checkOut) => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    if (diff <= 0) return "—";
    const h = Math.floor(diff / (1e3 * 60 * 60));
    const m = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };
  const [cancelOpen, setCancelOpen] = reactExports.useState(false);
  const [cancellingVisit, setCancellingVisit] = reactExports.useState(null);
  const [cancelReason, setCancelReason] = reactExports.useState("");
  const [copyOpen, setCopyOpen] = reactExports.useState(false);
  const [isCopying, setIsCopying] = reactExports.useState(false);
  const now = /* @__PURE__ */ new Date();
  const [calYear, setCalYear] = reactExports.useState(now.getFullYear());
  const [calMonth, setCalMonth] = reactExports.useState(now.getMonth());
  const [calSelectedDay, setCalSelectedDay] = reactExports.useState(null);
  const [bulkOpen, setBulkOpen] = reactExports.useState(false);
  const [bulkRows, setBulkRows] = reactExports.useState([]);
  const [bulkImporting, setBulkImporting] = reactExports.useState(false);
  const [bulkProgress, setBulkProgress] = reactExports.useState(null);
  const bulkFileRef = reactExports.useRef(null);
  const { data: isAdmin } = useIsAdmin();
  const { data: allVisits, isLoading: allLoading } = useAllVisits();
  const { data: myVisits, isLoading: myLoading } = useMyVisits();
  const { data: clients } = useClients();
  const createVisit = useCreateVisit();
  const updateVisit = useUpdateVisit();
  const deleteVisit = useDeleteVisit();
  const { identity } = useInternetIdentity();
  const visits = isAdmin ? allVisits ?? [] : myVisits ?? [];
  const isLoading = isAdmin ? allLoading : myLoading;
  const getClientName = (id) => {
    var _a;
    return ((_a = clients == null ? void 0 : clients.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? `Client #${id}`;
  };
  const filtered = visits.filter((v) => {
    const matchTab = activeTab === "all" || v.status === activeTab;
    if (!matchTab) return false;
    if (!visitSearch.trim()) return true;
    const q = visitSearch.toLowerCase();
    return getClientName(v.clientId).toLowerCase().includes(q) || (v.purpose ?? "").toLowerCase().includes(q);
  });
  const plannedCount = visits.filter((v) => v.status === "planned").length;
  const completedCount = visits.filter((v) => v.status === "completed").length;
  const todayCount = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1000000n));
    const today = /* @__PURE__ */ new Date();
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }).length;
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthVisits = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1000000n));
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const travelMatrix = (() => {
    const map = /* @__PURE__ */ new Map();
    for (const v of thisMonthVisits) {
      const key = v.clientId.toString();
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          clientId: v.clientId,
          count: 1,
          lastVisit: v.plannedDate
        });
      } else {
        existing.count += 1;
        if (v.plannedDate > existing.lastVisit) {
          existing.lastVisit = v.plannedDate;
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  })();
  const calMonthVisits = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1000000n));
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  });
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthName = MONTH_NAMES[lastMonthDate.getMonth()];
  const lastMonthYear = lastMonthDate.getFullYear();
  const currentMonthName = MONTH_NAMES[currentMonth];
  const lastMonthPlannedVisits = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1000000n));
    return d.getFullYear() === lastMonthYear && d.getMonth() === lastMonthDate.getMonth() && v.status === "planned";
  });
  const handleCaptureGpsForComplete = async () => {
    setCapturingCompleteGps(true);
    const loc = await captureLocation();
    setCapturingCompleteGps(false);
    if (loc) {
      setCapturedCompleteGps(loc);
      ue.success(
        `Location captured: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
      );
    } else {
      ue.error("Could not capture location");
    }
  };
  const handleAdd = async (values) => {
    if (!identity || !values.clientId) return;
    try {
      const travelPurpose = encodeTravelMeta(
        values.fromLocation,
        values.toLocation,
        values.distanceKm,
        values.purpose.trim()
      );
      const purposeWithGps = values.capturedGps ? `${formatGPS(values.capturedGps.lat, values.capturedGps.lng)} ${travelPurpose}` : travelPurpose;
      await createVisit.mutateAsync({
        id: 0n,
        userId: identity.getPrincipal(),
        clientId: BigInt(values.clientId),
        plannedDate: dateInputToNs(values.plannedDate),
        purpose: purposeWithGps,
        status: Status.planned,
        completionNotes: "",
        completedAt: 0n
      });
      ue.success("Visit planned");
      setAddOpen(false);
    } catch {
      ue.error("Failed to plan visit");
    }
  };
  const handleCompleteOpen = (visit) => {
    setCompletingVisit(visit);
    setCompletionNotes("");
    setCapturedCompleteGps(null);
    setCompleteOpen(true);
  };
  const handleComplete = async (e) => {
    e.preventDefault();
    if (!completingVisit) return;
    try {
      const notesWithGps = capturedCompleteGps ? `${formatGPS(capturedCompleteGps.lat, capturedCompleteGps.lng)} ${completionNotes.trim()}` : completionNotes.trim();
      await updateVisit.mutateAsync({
        id: completingVisit.id,
        visit: {
          ...completingVisit,
          status: Status.completed,
          completionNotes: notesWithGps,
          completedAt: BigInt(Date.now()) * 1000000n
        }
      });
      ue.success("Visit marked as completed");
      setCompleteOpen(false);
      setCompletingVisit(null);
    } catch {
      ue.error("Failed to update visit");
    }
  };
  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteVisit.mutateAsync(deleteId);
      ue.success("Visit deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete visit");
    }
  };
  const handleCancelOpen = (visit) => {
    setCancellingVisit(visit);
    setCancelReason("");
    setCancelOpen(true);
  };
  const handleCancelConfirm = async () => {
    if (!cancellingVisit) return;
    try {
      await updateVisit.mutateAsync({
        id: cancellingVisit.id,
        visit: {
          ...cancellingVisit,
          status: Status.cancelled,
          completionNotes: cancelReason.trim() ? `Cancelled: ${cancelReason.trim()}` : "Cancelled"
        }
      });
      ue.success("Visit cancelled");
      setCancelOpen(false);
      setCancellingVisit(null);
    } catch {
      ue.error("Failed to cancel visit");
    }
  };
  const handleCopyLastMonth = async () => {
    if (!identity || lastMonthPlannedVisits.length === 0) return;
    setIsCopying(true);
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    let copied = 0;
    let skipped = 0;
    for (const v of lastMonthPlannedVisits) {
      const lastD = new Date(Number(v.plannedDate / 1000000n));
      const dayOfMonth = lastD.getDate();
      if (dayOfMonth > daysInCurrentMonth) {
        skipped++;
        continue;
      }
      const newDate = new Date(currentYear, currentMonth, dayOfMonth);
      const yyyy = newDate.getFullYear();
      const mm = String(newDate.getMonth() + 1).padStart(2, "0");
      const dd = String(newDate.getDate()).padStart(2, "0");
      try {
        await createVisit.mutateAsync({
          id: 0n,
          userId: identity.getPrincipal(),
          clientId: v.clientId,
          plannedDate: dateInputToNs(`${yyyy}-${mm}-${dd}`),
          purpose: v.purpose,
          status: Status.planned,
          completionNotes: "",
          completedAt: 0n
        });
        copied++;
      } catch {
        skipped++;
      }
    }
    setIsCopying(false);
    setCopyOpen(false);
    ue.success(
      `${copied} visit${copied !== 1 ? "s" : ""} copied from ${lastMonthName} to ${currentMonthName}${skipped > 0 ? ` (${skipped} skipped)` : ""}`
    );
  };
  const handleExportMonthlyExcel = () => {
    const monthVisits = visits.filter((v) => {
      const d = new Date(Number(v.plannedDate / 1000000n));
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    const rows = monthVisits.map((v) => {
      const meta = decodeTravelMeta(v.purpose);
      const d = new Date(Number(v.plannedDate / 1000000n));
      return {
        Date: d.toLocaleDateString("en-CA"),
        // YYYY-MM-DD
        Client: getClientName(v.clientId),
        From: meta.from || "",
        To: meta.to || "",
        "Distance (km)": meta.dist || "",
        Purpose: meta.purpose || "",
        Status: v.status
      };
    });
    const monthStr = `${MONTH_NAMES[currentMonth]}${currentYear}`;
    exportCSV(rows, `visit_plan_${monthStr}.csv`);
    ue.success("Excel exported");
  };
  const handleDownloadSampleCSV = () => {
    const header = "Date,Client Name,From,To,Distance (km),Purpose";
    const rows = [
      "2026-03-10,BRPL Barbil,Kolkata,Barbil,320,Payment follow-up discussion",
      "2026-03-11,JSL Jajpur,Barbil,Jajpur,180,Ceramic liner inquiry",
      "2026-03-12,Rashmi Metallic,Jajpur,Kharagpur,210,Roller offer presentation"
    ];
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visit_plan_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const parseBulkRows = (data, clientList) => {
    const dataRows = data.slice(1);
    return dataRows.map((cols) => {
      const [
        date = "",
        clientName = "",
        from = "",
        to = "",
        dist = "",
        ...purposeParts
      ] = cols;
      const purpose = purposeParts.join(",").trim();
      const row = {
        date: date.trim(),
        clientName: clientName.trim(),
        from: from.trim(),
        to: to.trim(),
        distanceKm: dist.trim(),
        purpose,
        valid: false
      };
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
        row.error = "Invalid date (use YYYY-MM-DD)";
        return row;
      }
      const matched = clientList.find(
        (c) => c.name.toLowerCase() === row.clientName.toLowerCase() || c.company && c.company.toLowerCase() === row.clientName.toLowerCase()
      );
      if (!matched) {
        row.error = `Client not found: "${row.clientName}"`;
        return row;
      }
      row.clientId = matched.id;
      row.valid = true;
      return row;
    });
  };
  const handleBulkFileChange = (e) => {
    var _a, _b;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const clientList = clients ?? [];
    const ext = (_b = file.name.split(".").pop()) == null ? void 0 : _b.toLowerCase();
    if (ext === "xlsx" || ext === "xls") {
      ue.error(
        "Excel import not available. Please save as CSV and re-upload."
      );
      return;
    }
    {
      const reader = new FileReader();
      reader.onload = (ev) => {
        var _a2;
        const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
        const parsed = parseCSV(text);
        if (parsed.length < 2) {
          ue.error("CSV file is empty or has no data rows");
          return;
        }
        setBulkRows(parseBulkRows(parsed, clientList));
      };
      reader.readAsText(file);
    }
  };
  const handleBulkImport = async () => {
    if (!identity) return;
    const validRows = bulkRows.filter(
      (r) => r.valid && r.clientId !== void 0
    );
    setBulkImporting(true);
    setBulkProgress({ done: 0, total: validRows.length });
    let succeeded = 0;
    let skipped = 0;
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        const purposeEncoded = encodeTravelMeta(
          row.from,
          row.to,
          row.distanceKm,
          row.purpose
        );
        await createVisit.mutateAsync({
          id: 0n,
          userId: identity.getPrincipal(),
          clientId: row.clientId,
          plannedDate: dateInputToNs(row.date),
          purpose: purposeEncoded,
          status: Status.planned,
          completionNotes: "",
          completedAt: 0n
        });
        succeeded++;
      } catch {
        skipped++;
      }
      setBulkProgress({ done: i + 1, total: validRows.length });
    }
    setBulkImporting(false);
    setBulkProgress(null);
    ue.success(
      `${succeeded} visit${succeeded !== 1 ? "s" : ""} planned successfully${skipped > 0 ? `, ${skipped} skipped` : ""}`
    );
    setBulkOpen(false);
    setBulkRows([]);
    if (bulkFileRef.current) bulkFileRef.current.value = "";
  };
  const validBulkCount = bulkRows.filter((r) => r.valid).length;
  const handleCalPrev = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
    setCalSelectedDay(null);
  };
  const handleCalNext = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
    setCalSelectedDay(null);
  };
  const selectedDayVisits = calSelectedDay !== null ? getVisitsForDay(visits, calYear, calMonth, calSelectedDay) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in pb-20 md:pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { size: 24, className: "text-primary" }),
          "Visit Planner"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: isAdmin ? "All staff visits" : "Plan and track your client visits" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        filtered.length > 0 && activeTab !== "calendar" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "visits.pdf.button",
            onClick: () => {
              const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
              printVisitsPDF(filtered, tabLabel, getClientName);
            },
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 15 }),
              "Export PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "visits.monthly_pdf.button",
            onClick: () => {
              const monthVisits = visits.filter((v) => {
                const d = new Date(Number(v.plannedDate / 1000000n));
                return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
              });
              printMonthlyVisitsPDF(
                monthVisits,
                `${MONTH_NAMES[currentMonth]} ${currentYear}`,
                getClientName
              );
            },
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 15 }),
              "Monthly PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "visits.export_excel.button",
            onClick: handleExportMonthlyExcel,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 15 }),
              "Export Excel"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "visits.copy_last_month.button",
            onClick: () => setCopyOpen(true),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 15 }),
              "Copy Last Month"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "visits.bulk_upload.button",
            onClick: () => {
              setBulkRows([]);
              if (bulkFileRef.current) bulkFileRef.current.value = "";
              setBulkOpen(true);
            },
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { size: 15 }),
              "Bulk Upload"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "visits.add_button",
            onClick: () => setAddOpen(true),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
              "Plan Visit"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-blue-600 mt-1", children: todayCount })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Planned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-amber-600 mt-1", children: plannedCount })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Completed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-emerald-600 mt-1", children: completedCount })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 16,
          className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "visits.search_input",
          placeholder: "Client ya purpose search karein...",
          value: visitSearch,
          onChange: (e) => setVisitSearch(e.target.value),
          className: "pl-9"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        STATUS_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: tab,
            "data-ocid": "visits.filter.tab",
            className: "capitalize",
            children: tab
          },
          tab
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "calendar",
            "data-ocid": "visits.calendar.tab",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 14 }),
              "Calendar"
            ]
          }
        )
      ] }),
      STATUS_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: tab, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden shadow-xs mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "visits.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Route / Purpose" }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden lg:table-cell", children: "Staff" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right w-40", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: Array.from({ length: 6 }).map((__, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `cell-${j}`)
          )) }, `skeleton-${i}`)
        )) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableCell,
          {
            colSpan: 6,
            "data-ocid": "visits.empty_state",
            className: "text-center py-12 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CalendarCheck,
                {
                  size: 36,
                  className: "mx-auto mb-2 opacity-30"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No visits in this category" })
            ]
          }
        ) }) : filtered.map((visit, idx) => {
          const gps = parseGPS(
            visit.completionNotes || visit.purpose
          );
          const meta = decodeTravelMeta(visit.purpose);
          const showRoute = meta.from || meta.to;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              "data-ocid": `visits.item.${idx + 1}`,
              className: "hover:bg-muted/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: formatDate(visit.plannedDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: getClientName(visit.clientId) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-muted-foreground max-w-[220px]", children: showRoute ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs font-medium text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meta.from || "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 10 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meta.to || "—" }),
                    meta.dist && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[10px] px-1 py-0",
                        children: [
                          meta.dist,
                          " km"
                        ]
                      }
                    )
                  ] }),
                  meta.purpose && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: meta.purpose })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: meta.purpose || "—" }) }),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "hidden lg:table-cell text-xs font-mono text-muted-foreground", children: [
                  visit.userId.toString().slice(0, 12),
                  "…"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: visit.status }),
                  gps && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: gpsToMapsURL(gps.lat, gps.lng),
                      target: "_blank",
                      rel: "noopener noreferrer",
                      title: `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`,
                      className: "text-primary hover:text-primary/70 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13 })
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                  visit.status === "planned" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    !checkInMap[visit.id.toString()] ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        "data-ocid": `visits.checkin_button.${idx + 1}`,
                        onClick: () => handleCheckIn(visit.id.toString()),
                        className: "h-7 text-xs gap-1 text-blue-700 border-blue-200 hover:bg-blue-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                          "Check In"
                        ]
                      }
                    ) : !checkOutMap[visit.id.toString()] ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        "data-ocid": "visits.checkout_button",
                        onClick: () => handleCheckOut(visit.id.toString()),
                        className: "h-7 text-xs gap-1 text-indigo-700 border-indigo-200 hover:bg-indigo-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                          "Check Out"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-700 font-medium flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                      formatDuration(
                        checkInMap[visit.id.toString()],
                        checkOutMap[visit.id.toString()]
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        "data-ocid": `visits.complete_button.${idx + 1}`,
                        onClick: () => handleCompleteOpen(visit),
                        className: "h-7 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
                          "Complete"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        "data-ocid": `visits.cancel_button.${idx + 1}`,
                        onClick: () => handleCancelOpen(visit),
                        className: "h-7 text-xs gap-1 text-red-700 border-red-200 hover:bg-red-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 12 }),
                          "Cancel"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      "data-ocid": `visits.delete_button.${idx + 1}`,
                      onClick: () => setDeleteId(visit.id),
                      className: "h-7 w-7 text-destructive hover:text-destructive",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                    }
                  )
                ] }) })
              ]
            },
            visit.id.toString()
          );
        }) })
      ] }) }) }, tab)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "calendar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                "data-ocid": "visits.calendar.prev_button",
                onClick: handleCalPrev,
                className: "h-8 w-8",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base", children: [
              MONTH_NAMES[calMonth],
              " ",
              calYear
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                "data-ocid": "visits.calendar.next_button",
                onClick: handleCalNext,
                className: "h-8 w-8",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 mb-1", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-center text-xs font-semibold text-muted-foreground py-1",
                  children: d
                },
                d
              )
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CalendarGrid,
              {
                year: calYear,
                month: calMonth,
                visits: calMonthVisits,
                selectedDay: calSelectedDay,
                onSelectDay: (day) => setCalSelectedDay((prev) => prev === day ? null : day)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2.5 w-2.5 rounded-full bg-blue-500" }),
                "Planned"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" }),
                "Completed"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2.5 w-2.5 rounded-full bg-red-500" }),
                "Cancelled"
              ] })
            ] })
          ] })
        ] }),
        calSelectedDay !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "visits.calendar.panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { size: 15, className: "text-primary" }),
            calSelectedDay,
            " ",
            MONTH_NAMES[calMonth],
            " ",
            calYear,
            " —",
            " ",
            selectedDayVisits.length,
            " visit",
            selectedDayVisits.length !== 1 ? "s" : ""
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: selectedDayVisits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-muted-foreground py-4 text-center",
              "data-ocid": "visits.calendar.empty_state",
              children: "No visits on this day"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: selectedDayVisits.map((v, i) => {
            const meta = decodeTravelMeta(v.purpose);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                "data-ocid": `visits.calendar.item.${i + 1}`,
                className: "flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: v.status }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: getClientName(v.clientId) }),
                    (meta.from || meta.to) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                      meta.from || "—",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 10 }),
                      meta.to || "—",
                      meta.dist && ` (${meta.dist} km)`
                    ] }),
                    meta.purpose && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: meta.purpose })
                  ] })
                ]
              },
              v.id.toString()
            );
          }) }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "text-primary" }),
          "This Month's Travel Matrix"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: [
          thisMonthVisits.length,
          " visit",
          thisMonthVisits.length !== 1 ? "s" : "",
          " in",
          " ",
          now.toLocaleString("en-IN", { month: "long", year: "numeric" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: travelMatrix.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "travel.empty_state",
          className: "text-center py-8 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPinOff, { size: 28, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No visits this month yet" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "travel.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-center", children: "Visits This Month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right", children: "Last Visit" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: travelMatrix.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `travel.item.${idx + 1}`,
            className: "hover:bg-muted/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: getClientName(row.clientId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold", children: row.count }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-muted-foreground text-sm", children: formatDate(row.lastVisit) })
            ]
          },
          row.clientId.toString()
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "visits.add.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Plan New Visit" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AddVisitForm,
        {
          clients,
          isPending: createVisit.isPending,
          onSubmit: handleAdd,
          onCancel: () => setAddOpen(false)
        },
        addOpen ? "open" : "closed"
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: completeOpen,
        onOpenChange: (o) => {
          setCompleteOpen(o);
          if (!o) setCapturedCompleteGps(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "visits.complete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Mark Visit as Completed" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleComplete, className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Live Location" }),
              capturedCompleteGps ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MapPin,
                  {
                    size: 14,
                    className: "text-emerald-600 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-700 font-mono text-xs flex-1", children: [
                  "📍 ",
                  capturedCompleteGps.lat.toFixed(5),
                  ",",
                  " ",
                  capturedCompleteGps.lng.toFixed(5)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: gpsToMapsURL(
                      capturedCompleteGps.lat,
                      capturedCompleteGps.lng
                    ),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-emerald-600 hover:text-emerald-800 text-xs underline",
                    children: "View"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  "data-ocid": "visits.capture_complete_location.button",
                  onClick: handleCaptureGpsForComplete,
                  disabled: capturingCompleteGps,
                  className: "w-full gap-2 text-xs",
                  children: [
                    capturingCompleteGps ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13 }),
                    capturingCompleteGps ? "Capturing…" : "Capture Live Location"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Completion Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  "data-ocid": "visits.completion.textarea",
                  value: completionNotes,
                  onChange: (e) => setCompletionNotes(e.target.value),
                  rows: 4,
                  placeholder: "What was discussed, achieved, or noted during the visit..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  "data-ocid": "visits.complete.cancel_button",
                  onClick: () => {
                    setCompleteOpen(false);
                    setCapturedCompleteGps(null);
                  },
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  "data-ocid": "visits.complete.confirm_button",
                  disabled: updateVisit.isPending,
                  className: "bg-emerald-600 hover:bg-emerald-700",
                  children: [
                    updateVisit.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                    "Mark Completed"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: cancelOpen,
        onOpenChange: (o) => {
          if (!updateVisit.isPending) {
            setCancelOpen(o);
            if (!o) setCancellingVisit(null);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "visits.cancel.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 18, className: "text-destructive" }),
            "Cancel Visit"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            cancellingVisit && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Cancel visit to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: getClientName(cancellingVisit.clientId) }),
              " ",
              "on",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatDate(cancellingVisit.plannedDate) }),
              "?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  "data-ocid": "visits.cancel.textarea",
                  value: cancelReason,
                  onChange: (e) => setCancelReason(e.target.value),
                  rows: 3,
                  placeholder: "Why is this visit being cancelled?"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "visits.cancel.cancel_button",
                onClick: () => {
                  setCancelOpen(false);
                  setCancellingVisit(null);
                },
                disabled: updateVisit.isPending,
                children: "Keep Visit"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "destructive",
                "data-ocid": "visits.cancel.confirm_button",
                onClick: handleCancelConfirm,
                disabled: updateVisit.isPending,
                className: "gap-2",
                children: [
                  updateVisit.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 14 }),
                  "Cancel Visit"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: copyOpen,
        onOpenChange: (o) => {
          if (!isCopying) setCopyOpen(o);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "visits.copy.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 18, className: "text-primary" }),
            "Copy Last Month's Plan"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Copy all",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                lastMonthPlannedVisits.length,
                " planned visit",
                lastMonthPlannedVisits.length !== 1 ? "s" : ""
              ] }),
              " ",
              "from",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                lastMonthName,
                " ",
                lastMonthYear
              ] }),
              " ",
              "to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                currentMonthName,
                " ",
                currentYear
              ] }),
              "?"
            ] }),
            lastMonthPlannedVisits.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2", children: [
              "No planned visits found in ",
              lastMonthName,
              " ",
              lastMonthYear,
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "visits.copy.cancel_button",
                onClick: () => setCopyOpen(false),
                disabled: isCopying,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                "data-ocid": "visits.copy.confirm_button",
                onClick: handleCopyLastMonth,
                disabled: isCopying || lastMonthPlannedVisits.length === 0,
                className: "gap-2",
                children: [
                  isCopying ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 }),
                  isCopying ? "Copying…" : "Copy Visits"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: bulkOpen,
        onOpenChange: (o) => {
          if (!bulkImporting) {
            setBulkOpen(o);
            if (!o) {
              setBulkRows([]);
              if (bulkFileRef.current) bulkFileRef.current.value = "";
            }
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-2xl w-full",
            "data-ocid": "visits.bulk_upload.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { size: 18, className: "text-primary" }),
                "Bulk Upload Visit Plan"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-4 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Step 1: Download Template" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Download the sample CSV, fill in your visit plan, then upload it below." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "gap-2",
                      onClick: handleDownloadSampleCSV,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 14 }),
                        "Download Sample CSV"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Step 2: Upload Filled CSV or Excel File" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: "bulk-csv-input",
                      className: "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer p-6 text-center",
                      "data-ocid": "visits.bulk_upload.dropzone",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { size: 24, className: "text-muted-foreground" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Click to select CSV or Excel file" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/70", children: "Supported: .csv, .xlsx" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "bulk-csv-input",
                            ref: bulkFileRef,
                            type: "file",
                            accept: ".csv,.xlsx,.xls",
                            className: "hidden",
                            "data-ocid": "visits.bulk_upload.upload_button",
                            onChange: handleBulkFileChange,
                            disabled: bulkImporting
                          }
                        )
                      ]
                    }
                  )
                ] }),
                bulkRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                      "Preview (",
                      bulkRows.length,
                      " rows)"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 font-medium", children: [
                        validBulkCount,
                        " valid"
                      ] }),
                      bulkRows.length - validBulkCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-medium", children: [
                        bulkRows.length - validBulkCount,
                        " errors"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden max-h-60 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold py-2", children: "Date" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold py-2", children: "Client" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold py-2 hidden sm:table-cell", children: "From→To" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold py-2 hidden sm:table-cell", children: "Purpose" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold py-2", children: "Status" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: bulkRows.map((row, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: bulk preview list
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-muted/10", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs py-1.5", children: row.date || "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs py-1.5 max-w-[100px] truncate", children: row.clientName || "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs py-1.5 hidden sm:table-cell", children: row.from || row.to ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.from || "—" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 10 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.to || "—" }),
                          row.distanceKm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Badge,
                            {
                              variant: "outline",
                              className: "text-[9px] px-1 py-0",
                              children: [
                                row.distanceKm,
                                " km"
                              ]
                            }
                          )
                        ] }) : "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs py-1.5 hidden sm:table-cell max-w-[140px] truncate text-muted-foreground", children: row.purpose || "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-1.5", children: row.valid ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0", children: "Valid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "destructive",
                            className: "text-[10px] px-1.5 py-0 whitespace-nowrap",
                            title: row.error,
                            children: row.error ?? "Error"
                          }
                        ) })
                      ] }, idx)
                    )) })
                  ] }) })
                ] }),
                bulkProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "visits.bulk_upload.loading_state",
                    className: "space-y-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
                        "Importing ",
                        bulkProgress.done,
                        "/",
                        bulkProgress.total,
                        "…"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "bg-primary h-2 rounded-full transition-all duration-300",
                          style: {
                            width: `${bulkProgress.done / bulkProgress.total * 100}%`
                          }
                        }
                      ) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "visits.bulk_upload.cancel_button",
                    onClick: () => {
                      setBulkOpen(false);
                      setBulkRows([]);
                      if (bulkFileRef.current) bulkFileRef.current.value = "";
                    },
                    disabled: bulkImporting,
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "visits.bulk_upload.import_button",
                    disabled: validBulkCount === 0 || bulkImporting || !identity,
                    onClick: handleBulkImport,
                    className: "gap-2",
                    children: [
                      bulkImporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { size: 14 }),
                      bulkImporting ? "Importing…" : `Import ${validBulkCount} Valid Visit${validBulkCount !== 1 ? "s" : ""}`
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteId !== null,
        onOpenChange: (o) => !o && setDeleteId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "visits.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Visit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this visit log?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "visits.delete.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                "data-ocid": "visits.delete.confirm_button",
                onClick: handleDelete,
                className: "bg-destructive hover:bg-destructive/90",
                children: [
                  deleteVisit.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                  "Delete"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function CalendarGrid({
  year,
  month,
  visits,
  selectedDay,
  onSelectDay
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = /* @__PURE__ */ new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-0.5", children: cells.map((day, i) => {
    if (day === null) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: calendar grid
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 rounded-md" }, `empty-${i}`)
      );
    }
    const dayVisits = getVisitsForDay(visits, year, month, day);
    const isToday = isCurrentMonth && today.getDate() === day;
    const isSelected = selectedDay === day;
    const plannedVisits = dayVisits.filter((v) => v.status === "planned");
    const completedVisits = dayVisits.filter(
      (v) => v.status === "completed"
    );
    const cancelledVisits = dayVisits.filter(
      (v) => v.status === "cancelled"
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "visits.calendar.toggle",
        onClick: () => onSelectDay(day),
        className: [
          "h-12 rounded-md flex flex-col items-center justify-start pt-1 text-xs transition-colors relative cursor-pointer",
          isSelected ? "bg-primary text-primary-foreground" : isToday ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted/50"
        ].join(" "),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: [
                "text-xs font-medium",
                isSelected ? "text-primary-foreground" : ""
              ].join(" "),
              children: day
            }
          ),
          dayVisits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5 mt-0.5 flex-wrap justify-center px-0.5", children: [
            plannedVisits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-blue-500" }),
            completedVisits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" }),
            cancelledVisits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-red-500" })
          ] })
        ]
      },
      day
    );
  }) });
}
export {
  VisitsPage as default
};
