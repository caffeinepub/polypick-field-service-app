import { r as reactExports, j as jsxRuntimeExports, h as Badge, L as Label, I as Input, B as Button, C as Card, l as CardContent, ar as CalendarCheck, s as Select, v as SelectTrigger, w as SelectValue, x as SelectContent, y as SelectItem, i as CardHeader, k as CardTitle, n as Plus, z as ue } from "./index-DbjPUQDs.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DqYZgDD1.js";
import { D as Download } from "./download-CPqjANUi.js";
import { T as Trash2 } from "./trash-2-AM3OX5RE.js";
import "./index-CzBemFCv.js";
const STORAGE_KEY_STAFF = "polypick_attendance_staff";
const STORAGE_KEY_RECORDS = "polypick_attendance_records";
const STATUS_COLORS = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  "Half Day": "bg-amber-100 text-amber-700",
  WFH: "bg-blue-100 text-blue-700",
  "On Leave": "bg-purple-100 text-purple-700"
};
const STATUS_SHORT = {
  Present: "P",
  Absent: "A",
  "Half Day": "H",
  WFH: "W",
  "On Leave": "L"
};
function loadStaff() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_STAFF) ?? "[]");
  } catch {
    return [];
  }
}
function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) ?? "[]");
  } catch {
    return [];
  }
}
function StaffAttendancePage() {
  const [staff, setStaff] = reactExports.useState(loadStaff);
  const [records, setRecords] = reactExports.useState(loadRecords);
  const [selectedDate, setSelectedDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const [newName, setNewName] = reactExports.useState("");
  const [newRole, setNewRole] = reactExports.useState("");
  const [monthView, setMonthView] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().slice(0, 7)
  );
  const persistStaff = reactExports.useCallback((updated) => {
    setStaff(updated);
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));
  }, []);
  const persistRecords = reactExports.useCallback((updated) => {
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
  }, []);
  const addStaff = () => {
    if (!newName.trim()) {
      ue.error("Name required");
      return;
    }
    persistStaff([
      ...staff,
      { id: Date.now().toString(), name: newName.trim(), role: newRole.trim() }
    ]);
    setNewName("");
    setNewRole("");
    ue.success("Staff member added");
  };
  const removeStaff = (id) => {
    persistStaff(staff.filter((s) => s.id !== id));
    persistRecords(records.filter((r) => r.staffId !== id));
  };
  const getRecord = (staffId, date) => {
    var _a;
    return ((_a = records.find((r) => r.staffId === staffId && r.date === date)) == null ? void 0 : _a.status) ?? "";
  };
  const setRecord = (staffId, date, status) => {
    const existing = records.findIndex(
      (r) => r.staffId === staffId && r.date === date
    );
    let updated;
    if (existing >= 0) {
      updated = records.map((r, i) => i === existing ? { ...r, status } : r);
    } else {
      updated = [...records, { staffId, date, status }];
    }
    persistRecords(updated);
  };
  const saveDay = () => {
    ue.success(`Attendance saved for ${selectedDate}`);
  };
  const monthDays = reactExports.useMemo(() => {
    const [year, month] = monthView.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      return `${monthView}-${String(d).padStart(2, "0")}`;
    });
  }, [monthView]);
  const exportCSV = () => {
    const [year, month] = monthView.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const header = ["Staff", "Role", ...days.map((d) => String(d))].join(",");
    const rows = staff.map((s) => {
      const cells = days.map((d) => {
        const date = `${monthView}-${String(d).padStart(2, "0")}`;
        const rec = getRecord(s.id, date);
        return rec ? STATUS_SHORT[rec] : "";
      });
      return [s.name, s.role, ...cells].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${monthView}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("CSV exported");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-24 max-w-4xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "Staff Attendance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Daily attendance track karein" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-sm", children: [
        staff.length,
        " Staff"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "daily", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { "data-ocid": "attendance.tab", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "daily", children: "Daily Entry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "monthly", children: "Monthly View" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "manage", children: "Manage Staff" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "daily", className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "attendance.input",
                type: "date",
                value: selectedDate,
                onChange: (e) => setSelectedDate(e.target.value),
                className: "w-40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "attendance.save_button",
              onClick: saveDay,
              className: "mt-5",
              children: "Save"
            }
          )
        ] }),
        staff.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "attendance.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CalendarCheck,
            {
              size: 32,
              className: "mx-auto mb-3 text-muted-foreground/40"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: 'Pehle "Manage Staff" tab mein staff members add karein.' })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: staff.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": `attendance.row.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: s.name }),
            s.role && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: getRecord(s.id, selectedDate) || "",
              onValueChange: (v) => setRecord(s.id, selectedDate, v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": `attendance.select.${idx + 1}`,
                    className: "w-36",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [
                  "Present",
                  "Absent",
                  "Half Day",
                  "WFH",
                  "On Leave"
                ].map((st) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: st, children: st }, st)) })
              ]
            }
          )
        ] }) }, s.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "monthly", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "month",
                value: monthView,
                onChange: (e) => setMonthView(e.target.value),
                className: "w-40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "attendance.primary_button",
              variant: "outline",
              size: "sm",
              className: "mt-5",
              onClick: exportCSV,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14, className: "mr-1" }),
                " Export CSV"
              ]
            }
          )
        ] }),
        staff.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No staff members yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border-collapse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 text-left font-semibold sticky left-0 bg-muted", children: "Staff" }),
            monthDays.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-1 text-center font-medium w-8", children: d.split("-")[2] }, d))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: staff.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 font-medium sticky left-0 bg-background", children: s.name }),
            monthDays.map((date) => {
              const status = getRecord(s.id, date);
              return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-1 text-center", children: status ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-block w-6 h-6 rounded text-[10px] font-bold leading-6 ${STATUS_COLORS[status]}`,
                  children: STATUS_SHORT[status]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }, date);
            })
          ] }, s.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "manage", className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Add Staff Member" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "attendance.input",
                placeholder: "Name",
                value: newName,
                onChange: (e) => setNewName(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Role (e.g. Fitter)",
                value: newRole,
                onChange: (e) => setNewRole(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "attendance.primary_button",
                onClick: addStaff,
                className: "flex-shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 })
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: staff.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": `attendance.item.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: s.name }),
            s.role && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": `attendance.delete_button.${idx + 1}`,
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 text-destructive hover:text-destructive",
              onClick: () => removeStaff(s.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
            }
          )
        ] }) }, s.id)) })
      ] })
    ] })
  ] });
}
export {
  StaffAttendancePage as default
};
