import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, M as MapPin, C as Card, i as CardHeader, k as CardTitle, l as CardContent, B as Button, aX as LogOut, L as Label, I as Input, h as Badge, y as ue } from "./index-zYE3ieSM.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-D9sYaUqc.js";
import { E as ExternalLink } from "./external-link-CSbA6N7l.js";
import "./index-DZCkCVJa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode);
const STORAGE_KEY = "polypick_locations";
function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function StaffLocationPage() {
  const isAdmin = localStorage.getItem("polypick_is_admin") === "true";
  const staffName = localStorage.getItem("polypick_staff_name") ?? localStorage.getItem("polypick_profile_name") ?? "Staff";
  const [entries, setEntries] = reactExports.useState(loadEntries);
  const [locating, setLocating] = reactExports.useState(false);
  const [notes, setNotes] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const activeEntry = entries.find(
    (e) => e.staffName === staffName && !e.checkedOut
  );
  reactExports.useEffect(() => {
    setEntries(loadEntries());
  }, []);
  const handleCheckIn = () => {
    if (!navigator.geolocation) {
      ue.error("Geolocation not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const entry = {
          id: Date.now().toString(),
          staffName,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          notes: notes.trim(),
          checkedOut: false
        };
        const updated = [...loadEntries(), entry];
        saveEntries(updated);
        setEntries(updated);
        setNotes("");
        setDialogOpen(false);
        setLocating(false);
        ue.success("Check-in successful!");
      },
      (err) => {
        setLocating(false);
        ue.error(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15e3 }
    );
  };
  const handleCheckOut = () => {
    if (!activeEntry) return;
    const updated = entries.map(
      (e) => e.id === activeEntry.id ? { ...e, checkedOut: true, checkOutTime: (/* @__PURE__ */ new Date()).toISOString() } : e
    );
    saveEntries(updated);
    setEntries(updated);
    ue.success("Checked out!");
  };
  const grouped = entries.reduce(
    (acc, e) => {
      const date = new Date(e.timestamp).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(e);
      return acc;
    },
    {}
  );
  const myHistory = entries.filter((e) => e.staffName === staffName).slice().reverse();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 20, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Location Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isAdmin ? "All Staff Check-ins" : "Your Check-in / Check-out" })
      ] })
    ] }),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: activeEntry ? "Currently Checked In" : "Not Checked In" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: activeEntry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-green-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            activeEntry.lat.toFixed(5),
            ", ",
            activeEntry.lng.toFixed(5)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "Since ",
          formatDateTime(activeEntry.timestamp)
        ] }),
        activeEntry.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: activeEntry.notes }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => window.open(
                `https://maps.google.com/?q=${activeEntry.lat},${activeEntry.lng}`,
                "_blank"
              ),
              "data-ocid": "location.view_map.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13, className: "mr-1.5" }),
                "View Map"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: handleCheckOut,
              "data-ocid": "location.checkout.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 13, className: "mr-1.5" }),
                "Check Out"
              ]
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: 'Tap "Check In" to record your current location.' }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              "data-ocid": "location.checkin.open_modal_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 13, className: "mr-1.5" }),
                "Check In"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "location.checkin.dialog", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Check In" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Site name, purpose...",
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    "data-ocid": "location.checkin.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your current GPS location will be recorded." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleCheckIn,
                disabled: locating,
                "data-ocid": "location.checkin.submit_button",
                children: locating ? "Locating..." : "Check In Now"
              }
            ) })
          ] })
        ] })
      ] }) })
    ] }),
    isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Object.keys(grouped).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardContent,
      {
        className: "py-12 text-center",
        "data-ocid": "location.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MapPin,
            {
              size: 32,
              className: "mx-auto mb-3 text-muted-foreground/40"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No check-ins recorded yet." })
        ]
      }
    ) }) : Object.entries(grouped).reverse().map(([date, dayEntries]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-muted-foreground mb-2", children: date }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: dayEntries.map((e, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": `location.item.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: e.staffName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: e.checkedOut ? "secondary" : "default",
                className: "text-[10px] h-4",
                children: e.checkedOut ? "Checked Out" : "Active"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "In: ",
            formatDateTime(e.timestamp),
            e.checkedOut && e.checkOutTime && ` · Out: ${formatDateTime(e.checkOutTime)}`
          ] }),
          e.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: e.notes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-7 w-7 shrink-0",
            onClick: () => window.open(
              `https://maps.google.com/?q=${e.lat},${e.lng}`,
              "_blank"
            ),
            "data-ocid": `location.map_button.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 })
          }
        )
      ] }) }) }, e.id)) })
    ] }, date)) }) : (
      /* Staff history */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground", children: "Your History" }),
        myHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardContent,
          {
            className: "py-10 text-center",
            "data-ocid": "location.empty_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No previous check-ins." })
          }
        ) }) : myHistory.map((e, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": `location.item.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: e.checkedOut ? "secondary" : "default",
                  className: "text-[10px] h-4",
                  children: e.checkedOut ? "Checked Out" : "Active"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDateTime(e.timestamp) })
            ] }),
            e.checkedOut && e.checkOutTime && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Out: ",
              formatDateTime(e.checkOutTime)
            ] }),
            e.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: e.notes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "h-7 w-7 shrink-0",
              onClick: () => window.open(
                `https://maps.google.com/?q=${e.lat},${e.lng}`,
                "_blank"
              ),
              "data-ocid": `location.map_button.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 })
            }
          )
        ] }) }) }, e.id))
      ] })
    )
  ] });
}
export {
  StaffLocationPage as default
};
