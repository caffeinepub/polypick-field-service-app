import { c as createLucideIcon, r as reactExports, A as useClients, D as useCreateClient, E as useDeleteClient, a as useNavigate, b as useInternetIdentity, j as jsxRuntimeExports, U as Users, B as Button, p as LoaderCircle, L as Label, I as Input, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem, S as Skeleton, h as Badge, y as ue } from "./index-DmVPSM7c.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CZpK8dUl.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BLjkFx7-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CAq1fw9T.js";
import { T as Textarea } from "./textarea-DOYIpxQo.js";
import { U as Upload } from "./upload-B8kFLQVr.js";
import { F as FileDown } from "./file-down-DfTYvJqp.js";
import { P as Plus } from "./plus-BusXn_27.js";
import { S as Search } from "./search-B-dtdjn3.js";
import { B as Building2 } from "./building-2-DsXurobZ.js";
import { T as Trash2 } from "./trash-2-BsSHN3TR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["line", { x1: "3", x2: "21", y1: "9", y2: "9", key: "1vqk6q" }],
  ["line", { x1: "3", x2: "21", y1: "15", y2: "15", key: "o2sbyz" }],
  ["line", { x1: "9", x2: "9", y1: "9", y2: "21", key: "1ib60c" }],
  ["line", { x1: "15", x2: "15", y1: "9", y2: "21", key: "1n26ft" }]
];
const Sheet = createLucideIcon("sheet", __iconNode);
function encodeContacts(notes, contacts) {
  const stripped = notes.replace(/\[CONTACTS:[^\]]*\]\s*/g, "").trim();
  if (contacts.length === 0) return stripped;
  const encoded = btoa(JSON.stringify(contacts));
  return `[CONTACTS:${encoded}]${stripped ? ` ${stripped}` : ""}`;
}
function decodeContacts(notes) {
  const m = notes.match(/\[CONTACTS:([^\]]+)\]/);
  if (!m) return [];
  try {
    return JSON.parse(atob(m[1]));
  } catch {
    return [];
  }
}
function stripContactsTag(notes) {
  return notes.replace(/\[CONTACTS:[^\]]*\]\s*/g, "").trim();
}
function genContactId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
const INDUSTRY_OPTIONS = [
  "Steel Plant",
  "Cement Plant",
  "Mining",
  "Power Plant",
  "Pharmaceutical",
  "Textile",
  "Other"
];
const INDUSTRY_BADGE_CLASSES = {
  "Steel Plant": "bg-slate-50 text-slate-700 border-slate-200",
  "Cement Plant": "bg-stone-50 text-stone-700 border-stone-200",
  Mining: "bg-amber-50 text-amber-700 border-amber-200",
  "Power Plant": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Pharmaceutical: "bg-blue-50 text-blue-700 border-blue-200",
  Textile: "bg-purple-50 text-purple-700 border-purple-200",
  Other: "bg-muted text-muted-foreground border-border"
};
function encodeIndustry(notes, industry) {
  const stripped = notes.replace(/\[IND:[^\]]*\]\s*/g, "");
  if (!industry || industry === "none") return stripped;
  return `[IND:${industry}]${stripped ? ` ${stripped}` : ""}`;
}
function extractIndustry(notes) {
  const m = notes.match(/\[IND:([^\]]+)\]/);
  return m ? m[1] : "";
}
function stripIndustryTag(notes) {
  return notes.replace(/\[IND:[^\]]*\]\s*/g, "").trim();
}
const emptyForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  industry: "none",
  notes: ""
};
const SAMPLE_CLIENTS = [
  {
    name: "Swapnil Sir",
    company: "BRPL Barbil",
    phone: "",
    email: "",
    address: "Barbil, Odisha",
    notes: "[IND:Steel Plant] Supply payment follow-up"
  },
  {
    name: "Aaksh Kumar",
    company: "PPL Pradeep",
    phone: "",
    email: "",
    address: "Pradeep, Odisha",
    notes: "[IND:Steel Plant] Supply & service payment follow-up"
  },
  {
    name: "Annant Kumar",
    company: "Jagnnath Steel RSP Rourkela",
    phone: "",
    email: "",
    address: "Rourkela, Odisha",
    notes: "[IND:Steel Plant] 300 MTR liner inquiry, April expected"
  },
  {
    name: "Uttam Poul",
    company: "Rashmi Metallic Unit 1",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Steel Plant] Ceramic liner + 200 UHMWPE roller inquiry"
  },
  {
    name: "Brijndan Mandal",
    company: "JSL Jajpur",
    phone: "",
    email: "",
    address: "Jajpur, Odisha",
    notes: "[IND:Steel Plant] Ceramic liner + pallet plant inquiry"
  },
  {
    name: "Contact",
    company: "Shyam Metallic Khargpur",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Steel Plant] Roller offer finalization next week"
  },
  {
    name: "Contact",
    company: "IMFA Steel Jajpur",
    phone: "",
    email: "",
    address: "Jajpur, Odisha",
    notes: "[IND:Steel Plant] New project inquiry this month"
  },
  {
    name: "Contact",
    company: "Gerawa Steel Barbil",
    phone: "",
    email: "",
    address: "Barbil, Odisha",
    notes: "[IND:Steel Plant] Belt scraper requirement, visit required"
  },
  {
    name: "Suni Giri",
    company: "Bengal Energy Khargpur",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Power Plant] Visit planned"
  },
  {
    name: "Anil Sahu",
    company: "Rungta Kalyani",
    phone: "",
    email: "",
    address: "Kalyani, WB",
    notes: "[IND:Mining] 3300 MTR order + belt scraper finalization"
  },
  {
    name: "Bhagat Ji",
    company: "Vedanta Bhadrak",
    phone: "",
    email: "",
    address: "Bhadrak, Odisha",
    notes: "[IND:Steel Plant] Rubber panel finalization this month"
  },
  {
    name: "Tapan",
    company: "MECON Dhanbad",
    phone: "",
    email: "",
    address: "Dhanbad, Jharkhand",
    notes: "[IND:Other] Ceramic discussion, visit planned"
  }
];
function printClientsPDF(clients) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const rows = clients.map(
    (c) => `
      <tr>
        <td>${c.name}</td>
        <td>${c.company}</td>
        <td>${extractIndustry(c.notes) || "—"}</td>
        <td>${c.phone || "—"}</td>
        <td>${c.email || "—"}</td>
        <td>${c.address || "—"}</td>
      </tr>`
  ).join("");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Client List – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background: #f0f0f0; padding: 8px 6px; text-align: left; font-size: 11px; border: 1px solid #ccc; }
        td { padding: 7px 6px; border: 1px solid #ddd; vertical-align: top; }
        tr:nth-child(even) td { background: #fafafa; }
        .count { color: #666; font-size: 11px; margin-bottom: 8px; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Client Directory</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total Clients: ${clients.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Industry</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
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
function downloadSampleCSV() {
  const csvContent = "Name,Company,Phone,Email,Address,Industry,Notes\nRaju Singh,BRPL Barbil,9876543210,raju@brpl.com,Barbil Odisha,Steel Plant,Payment follow-up";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sample_clients.csv";
  link.click();
  URL.revokeObjectURL(url);
}
function ClientsPage() {
  const [search, setSearch] = reactExports.useState("");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [phoneError, setPhoneError] = reactExports.useState("");
  const [isBulkAdding, setIsBulkAdding] = reactExports.useState(false);
  const [isImporting, setIsImporting] = reactExports.useState(false);
  const [isImportingExcel, setIsImportingExcel] = reactExports.useState(false);
  const csvInputRef = reactExports.useRef(null);
  const excelInputRef = reactExports.useRef(null);
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const filtered = (clients ?? []).filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );
  const validatePhone = (phone) => {
    if (!phone) return true;
    if (phone.replace(/\D/g, "").length !== 10) {
      setPhoneError("Phone must be exactly 10 digits");
      return false;
    }
    setPhoneError("");
    return true;
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!identity) return;
    if (!validatePhone(form.phone)) return;
    try {
      const notesWithIndustry = encodeIndustry(
        form.notes.trim(),
        form.industry
      );
      await createClient.mutateAsync({
        id: 0n,
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        notes: notesWithIndustry,
        createdAt: BigInt(Date.now()) * 1000000n,
        updatedAt: BigInt(Date.now()) * 1000000n,
        createdBy: identity.getPrincipal()
      });
      ue.success("Client added successfully");
      setForm(emptyForm);
      setPhoneError("");
      setAddOpen(false);
    } catch {
      ue.error("Failed to add client");
    }
  };
  const handleBulkAdd = async () => {
    if (!identity) return;
    setIsBulkAdding(true);
    try {
      for (const c of SAMPLE_CLIENTS) {
        await createClient.mutateAsync({
          id: 0n,
          name: c.name,
          company: c.company,
          phone: c.phone,
          email: c.email,
          address: c.address,
          notes: c.notes,
          createdAt: BigInt(Date.now()) * 1000000n,
          updatedAt: BigInt(Date.now()) * 1000000n,
          createdBy: identity.getPrincipal()
        });
      }
      ue.success("12 sample clients added!");
    } catch {
      ue.error("Failed to add some clients. Please try again.");
    } finally {
      setIsBulkAdding(false);
    }
  };
  const handleCSVImport = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !identity) return;
    e.target.value = "";
    setIsImporting(true);
    ue("Importing clients...");
    try {
      const text = await file.text();
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      const dataLines = lines.slice(1);
      let count = 0;
      for (const line of dataLines) {
        const cols = line.split(",");
        const name = (cols[0] ?? "").trim();
        if (!name) continue;
        const company = (cols[1] ?? "").trim();
        const phone = (cols[2] ?? "").trim();
        const email = (cols[3] ?? "").trim();
        const address = (cols[4] ?? "").trim();
        const industry = (cols[5] ?? "").trim();
        const rawNotes = (cols[6] ?? "").trim();
        const notes = encodeIndustry(rawNotes, industry);
        await createClient.mutateAsync({
          id: 0n,
          name,
          company,
          phone,
          email,
          address,
          notes,
          createdAt: BigInt(Date.now()) * 1000000n,
          updatedAt: BigInt(Date.now()) * 1000000n,
          createdBy: identity.getPrincipal()
        });
        count++;
      }
      ue.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
    } catch {
      ue.error("Import failed. Please check the CSV format.");
    } finally {
      setIsImporting(false);
    }
  };
  const handleExcelImport = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !identity) return;
    e.target.value = "";
    setIsImportingExcel(true);
    ue("Importing from CSV/Excel (save as CSV first)...");
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const dataLines = lines.slice(1);
      let count = 0;
      for (const line of dataLines) {
        const sep = line.includes("	") ? "	" : ",";
        const cols = line.split(sep);
        const name = (cols[0] ?? "").replace(/^"|"$/g, "").trim();
        if (!name) continue;
        const company = (cols[1] ?? "").replace(/^"|"$/g, "").trim();
        const phone = (cols[2] ?? "").replace(/^"|"$/g, "").trim();
        const email = (cols[3] ?? "").replace(/^"|"$/g, "").trim();
        const address = (cols[4] ?? "").replace(/^"|"$/g, "").trim();
        const industry = (cols[5] ?? "").replace(/^"|"$/g, "").trim();
        const rawNotes = (cols[6] ?? "").replace(/^"|"$/g, "").trim();
        const notes = encodeIndustry(rawNotes, industry);
        await createClient.mutateAsync({
          id: 0n,
          name,
          company,
          phone,
          email,
          address,
          notes,
          createdAt: BigInt(Date.now()) * 1000000n,
          updatedAt: BigInt(Date.now()) * 1000000n,
          createdBy: identity.getPrincipal()
        });
        count++;
      }
      ue.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
    } catch {
      ue.error("Import failed. Please save the Excel file as CSV first.");
    } finally {
      setIsImportingExcel(false);
    }
  };
  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteClient.mutateAsync(deleteId);
      ue.success("Client deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete client");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24, className: "text-primary" }),
          "Clients"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
          (clients == null ? void 0 : clients.length) ?? 0,
          " total clients"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: csvInputRef,
            type: "file",
            accept: ".csv",
            className: "hidden",
            onChange: handleCSVImport
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: excelInputRef,
            type: "file",
            accept: ".csv,.xlsx,.xls,.txt",
            className: "hidden",
            onChange: handleExcelImport
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.download_sample.button",
            onClick: downloadSampleCSV,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 15 }),
              "Sample CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.import.upload_button",
            onClick: () => {
              var _a;
              return (_a = csvInputRef.current) == null ? void 0 : _a.click();
            },
            disabled: isImporting || !identity,
            className: "gap-2",
            children: [
              isImporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 15 }),
              isImporting ? "Importing..." : "Import CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.import_excel.upload_button",
            onClick: () => {
              var _a;
              return (_a = excelInputRef.current) == null ? void 0 : _a.click();
            },
            disabled: isImportingExcel || !identity,
            className: "gap-2",
            children: [
              isImportingExcel ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { size: 15 }),
              isImportingExcel ? "Importing..." : "Import Excel"
            ]
          }
        ),
        !isLoading && (clients ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "clients.pdf.button",
            onClick: () => printClientsPDF(clients ?? []),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 15 }),
              "Export PDF"
            ]
          }
        ),
        !isLoading && (clients ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            "data-ocid": "clients.sample.primary_button",
            onClick: handleBulkAdd,
            disabled: isBulkAdding || !identity,
            className: "gap-2",
            children: [
              isBulkAdding ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 16 }),
              isBulkAdding ? "Adding..." : "Add Sample Clients"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dialog,
          {
            open: addOpen,
            onOpenChange: (o) => {
              setAddOpen(o);
              if (!o) {
                setForm(emptyForm);
                setPhoneError("");
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-ocid": "clients.add_button", className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                "Add Client"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "client.dialog", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add New Client" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, className: "space-y-4 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "name",
                          "data-ocid": "client.name.input",
                          value: form.name,
                          onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
                          placeholder: "Contact name",
                          required: true
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company", children: "Company *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "company",
                          "data-ocid": "client.company.input",
                          value: form.company,
                          onChange: (e) => setForm((p) => ({ ...p, company: e.target.value })),
                          placeholder: "Company name",
                          required: true
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "phone",
                          "data-ocid": "client.phone.input",
                          value: form.phone,
                          onChange: (e) => {
                            setForm((p) => ({ ...p, phone: e.target.value }));
                            if (phoneError) validatePhone(e.target.value);
                          },
                          onBlur: (e) => validatePhone(e.target.value),
                          placeholder: "10-digit mobile number",
                          inputMode: "numeric"
                        }
                      ),
                      phoneError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          "data-ocid": "client.phone.error_state",
                          className: "text-xs text-destructive mt-1",
                          children: phoneError
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "email",
                          "data-ocid": "client.email.input",
                          type: "email",
                          value: form.email,
                          onChange: (e) => setForm((p) => ({ ...p, email: e.target.value })),
                          placeholder: "email@company.com"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Address" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "address",
                          "data-ocid": "client.address.input",
                          value: form.address,
                          onChange: (e) => setForm((p) => ({ ...p, address: e.target.value })),
                          placeholder: "Full address"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "industry", children: "Industry Type" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: form.industry,
                          onValueChange: (v) => setForm((p) => ({ ...p, industry: v })),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                id: "industry",
                                "data-ocid": "client.industry.select",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select industry" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Select industry —" }),
                              INDUSTRY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt, children: opt }, opt))
                            ] })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", children: "Notes" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "notes",
                        "data-ocid": "client.notes.textarea",
                        value: form.notes,
                        onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })),
                        placeholder: "Any additional notes...",
                        rows: 3
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        "data-ocid": "client.cancel_button",
                        onClick: () => {
                          setAddOpen(false);
                          setForm(emptyForm);
                          setPhoneError("");
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "submit",
                        "data-ocid": "client.save_button",
                        disabled: createClient.isPending || !!phoneError,
                        children: [
                          createClient.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                          "Save Client"
                        ]
                      }
                    )
                  ] })
                ] })
              ] })
            ]
          }
        )
      ] })
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
          "data-ocid": "clients.search_input",
          type: "text",
          placeholder: "Search clients...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "clients.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Industry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden lg:table-cell", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24 text-right font-semibold", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 ml-auto" }) })
        ] }, `skeleton-${i}`)
      )) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableCell,
        {
          colSpan: 6,
          "data-ocid": "clients.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 36, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? "No clients match your search" : "No clients yet. Add your first client!" })
          ]
        }
      ) }) : filtered.map((client, idx) => {
        const industry = extractIndustry(client.notes);
        const industryClass = INDUSTRY_BADGE_CLASSES[industry] ?? "bg-muted text-muted-foreground border-border";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `clients.item.${idx + 1}`,
            className: "hover:bg-muted/30 cursor-pointer",
            onClick: () => navigate({ to: `/clients/${client.id.toString()}` }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                client.name,
                (() => {
                  const cnt = decodeContacts(client.notes).length;
                  return cnt > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-xs px-1.5 py-0 h-4 font-normal",
                      title: `${cnt} contact${cnt !== 1 ? "s" : ""}`,
                      children: [
                        "👥 ",
                        cnt
                      ]
                    }
                  ) : null;
                })()
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: client.company }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: industry ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${industryClass}`,
                  children: industry
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-muted-foreground", children: client.phone || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-muted-foreground", children: client.email || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-end gap-1",
                  onClick: (e) => e.stopPropagation(),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        "data-ocid": `client.view_button.${idx + 1}`,
                        onClick: () => navigate({
                          to: `/clients/${client.id.toString()}`
                        }),
                        className: "h-7 w-7",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        "data-ocid": `client.delete_button.${idx + 1}`,
                        onClick: () => setDeleteId(client.id),
                        className: "h-7 w-7 text-destructive hover:text-destructive",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                      }
                    )
                  ]
                }
              ) })
            ]
          },
          client.id.toString()
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteId !== null,
        onOpenChange: (o) => !o && setDeleteId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "client.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Client" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this client? This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "client.delete.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                "data-ocid": "client.delete.confirm_button",
                onClick: handleDelete,
                className: "bg-destructive hover:bg-destructive/90",
                children: [
                  deleteClient.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
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
const ClientsPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ClientsPage,
  extractIndustry,
  stripIndustryTag
}, Symbol.toStringTag, { value: "Module" }));
export {
  ClientsPage$1 as C,
  stripContactsTag as a,
  decodeContacts as d,
  encodeContacts as e,
  genContactId as g,
  stripIndustryTag as s
};
