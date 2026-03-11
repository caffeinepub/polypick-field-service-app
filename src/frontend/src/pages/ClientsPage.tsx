import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  Database,
  Download,
  Eye,
  FileDown,
  Loader2,
  Plus,
  Search,
  Sheet,
  Smartphone,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type T__2,
  useAllVisits,
  useClients,
  useCreateClient,
  useDeleteClient,
} from "../hooks/useQueries";
import { decodeContacts } from "../utils/clientContacts";

// ── Industry type helpers ─────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "Steel Plant",
  "Cement Plant",
  "Mining",
  "Power Plant",
  "Pharmaceutical",
  "Textile",
  "Other",
];

const INDUSTRY_BADGE_CLASSES: Record<string, string> = {
  "Steel Plant": "bg-slate-50 text-slate-700 border-slate-200",
  "Cement Plant": "bg-stone-50 text-stone-700 border-stone-200",
  Mining: "bg-amber-50 text-amber-700 border-amber-200",
  "Power Plant": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Pharmaceutical: "bg-blue-50 text-blue-700 border-blue-200",
  Textile: "bg-purple-50 text-purple-700 border-purple-200",
  Other: "bg-muted text-muted-foreground border-border",
};

function encodeIndustry(notes: string, industry: string): string {
  const stripped = notes.replace(/\[IND:[^\]]*\]\s*/g, "");
  if (!industry || industry === "none") return stripped;
  return `[IND:${industry}]${stripped ? ` ${stripped}` : ""}`;
}

function extractIndustry(notes: string): string {
  const m = notes.match(/\[IND:([^\]]+)\]/);
  return m ? m[1] : "";
}

function stripIndustryTag(notes: string): string {
  return notes.replace(/\[IND:[^\]]*\]\s*/g, "").trim();
}

const emptyForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  industry: "none",
  notes: "",
};

const SAMPLE_CLIENTS = [
  {
    name: "Swapnil Sir",
    company: "BRPL Barbil",
    phone: "",
    email: "",
    address: "Barbil, Odisha",
    notes: "[IND:Steel Plant] Supply payment follow-up",
  },
  {
    name: "Aaksh Kumar",
    company: "PPL Pradeep",
    phone: "",
    email: "",
    address: "Pradeep, Odisha",
    notes: "[IND:Steel Plant] Supply & service payment follow-up",
  },
  {
    name: "Annant Kumar",
    company: "Jagnnath Steel RSP Rourkela",
    phone: "",
    email: "",
    address: "Rourkela, Odisha",
    notes: "[IND:Steel Plant] 300 MTR liner inquiry, April expected",
  },
  {
    name: "Uttam Poul",
    company: "Rashmi Metallic Unit 1",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Steel Plant] Ceramic liner + 200 UHMWPE roller inquiry",
  },
  {
    name: "Brijndan Mandal",
    company: "JSL Jajpur",
    phone: "",
    email: "",
    address: "Jajpur, Odisha",
    notes: "[IND:Steel Plant] Ceramic liner + pallet plant inquiry",
  },
  {
    name: "Contact",
    company: "Shyam Metallic Khargpur",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Steel Plant] Roller offer finalization next week",
  },
  {
    name: "Contact",
    company: "IMFA Steel Jajpur",
    phone: "",
    email: "",
    address: "Jajpur, Odisha",
    notes: "[IND:Steel Plant] New project inquiry this month",
  },
  {
    name: "Contact",
    company: "Gerawa Steel Barbil",
    phone: "",
    email: "",
    address: "Barbil, Odisha",
    notes: "[IND:Steel Plant] Belt scraper requirement, visit required",
  },
  {
    name: "Suni Giri",
    company: "Bengal Energy Khargpur",
    phone: "",
    email: "",
    address: "Khargpur, WB",
    notes: "[IND:Power Plant] Visit planned",
  },
  {
    name: "Anil Sahu",
    company: "Rungta Kalyani",
    phone: "",
    email: "",
    address: "Kalyani, WB",
    notes: "[IND:Mining] 3300 MTR order + belt scraper finalization",
  },
  {
    name: "Bhagat Ji",
    company: "Vedanta Bhadrak",
    phone: "",
    email: "",
    address: "Bhadrak, Odisha",
    notes: "[IND:Steel Plant] Rubber panel finalization this month",
  },
  {
    name: "Tapan",
    company: "MECON Dhanbad",
    phone: "",
    email: "",
    address: "Dhanbad, Jharkhand",
    notes: "[IND:Other] Ceramic discussion, visit planned",
  },
];

// ── PDF print helper ─────────────────────────────────────────────────────────

function printClientsPDF(clients: T__2[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const rows = clients
    .map(
      (c) => `
      <tr>
        <td>${c.name}</td>
        <td>${c.company}</td>
        <td>${extractIndustry(c.notes) || "—"}</td>
        <td>${c.phone || "—"}</td>
        <td>${c.email || "—"}</td>
        <td>${c.address || "—"}</td>
      </tr>`,
    )
    .join("");

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

// ── Sample CSV download ───────────────────────────────────────────────────────

function downloadSampleCSV() {
  const csvContent =
    "Name,Company,Phone,Email,Address,Industry,Notes\nRaju Singh,BRPL Barbil,9876543210,raju@brpl.com,Barbil Odisha,Steel Plant,Payment follow-up";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sample_clients.csv";
  link.click();
  URL.revokeObjectURL(url);
}

// ── Phone contact helpers ─────────────────────────────────────────────────────

/** Title-case a single word */
function toTitleCase(word: string): string {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Detect business contact: 3+ words in name.
 * e.g. "RAJU singh jk cement nimbahera" → business
 *      "Raju Singh" → personal
 */
function detectBusiness(rawName: string): {
  isBusiness: boolean;
  personName: string;
  companyName: string;
} {
  const words = rawName.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 3) {
    const personName = words.slice(0, 2).map(toTitleCase).join(" ");
    const companyName = words.slice(2).map(toTitleCase).join(" ");
    return { isBusiness: true, personName, companyName };
  }
  return {
    isBusiness: false,
    personName: words.map(toTitleCase).join(" "),
    companyName: "",
  };
}

type PhoneContactEntry = {
  name: string;
  company: string;
  phone: string;
  isBusiness: boolean;
  include: boolean;
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isImportingExcel, setIsImportingExcel] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  // ── Phone import state ────────────────────────────────────────────────────
  const [phoneContacts, setPhoneContacts] = useState<PhoneContactEntry[]>([]);
  const [phoneImportOpen, setPhoneImportOpen] = useState(false);
  const [isPhoneImporting, setIsPhoneImporting] = useState(false);

  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();
  const { data: allVisits } = useAllVisits();

  // Compute last visit date per client
  const lastVisitMap = new Map<string, bigint>();
  for (const v of allVisits ?? []) {
    const key = v.clientId.toString();
    const existing = lastVisitMap.get(key);
    if (!existing || v.plannedDate > existing) {
      lastVisitMap.set(key, v.plannedDate);
    }
  }
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const filtered = (clients ?? []).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // optional
    if (phone.replace(/\D/g, "").length !== 10) {
      setPhoneError("Phone must be exactly 10 digits");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    if (!validatePhone(form.phone)) return;
    try {
      const notesWithIndustry = encodeIndustry(
        form.notes.trim(),
        form.industry,
      );
      await createClient.mutateAsync({
        id: 0n,
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        notes: notesWithIndustry,
        createdAt: BigInt(Date.now()) * 1_000_000n,
        updatedAt: BigInt(Date.now()) * 1_000_000n,
        createdBy: identity.getPrincipal() as Principal,
      });
      toast.success("Client added successfully");
      setForm(emptyForm);
      setPhoneError("");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add client");
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
          createdAt: BigInt(Date.now()) * 1_000_000n,
          updatedAt: BigInt(Date.now()) * 1_000_000n,
          createdBy: identity.getPrincipal() as Principal,
        });
      }
      toast.success("12 sample clients added!");
    } catch {
      toast.error("Failed to add some clients. Please try again.");
    } finally {
      setIsBulkAdding(false);
    }
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !identity) return;
    e.target.value = ""; // reset so same file can be re-selected
    setIsImporting(true);
    toast("Importing clients...");
    try {
      const text = await file.text();
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      // Skip header row
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
          createdAt: BigInt(Date.now()) * 1_000_000n,
          updatedAt: BigInt(Date.now()) * 1_000_000n,
          createdBy: identity.getPrincipal() as Principal,
        });
        count++;
      }
      toast.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
    } catch {
      toast.error("Import failed. Please check the CSV format.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !identity) return;
    e.target.value = "";
    setIsImportingExcel(true);
    toast("Importing from CSV/Excel (save as CSV first)...");
    try {
      const text = await file.text();
      // Support both comma and tab separated
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const dataLines = lines.slice(1);
      let count = 0;
      for (const line of dataLines) {
        const sep = line.includes("\t") ? "\t" : ",";
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
          createdAt: BigInt(Date.now()) * 1_000_000n,
          updatedAt: BigInt(Date.now()) * 1_000_000n,
          createdBy: identity.getPrincipal() as Principal,
        });
        count++;
      }
      toast.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
    } catch {
      toast.error("Import failed. Please save the Excel file as CSV first.");
    } finally {
      setIsImportingExcel(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteClient.mutateAsync(deleteId);
      toast.success("Client deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete client");
    }
  };

  // ── Phone Contact Picker ──────────────────────────────────────────────────

  const handlePhoneImport = async () => {
    if (!(navigator as any).contacts) {
      toast.error("Ye feature sirf Chrome Android mein kaam karta hai");
      return;
    }
    try {
      const selected = await (navigator as any).contacts.select(
        ["name", "tel"],
        { multiple: true },
      );
      if (!selected || selected.length === 0) return;

      const parsed: PhoneContactEntry[] = selected.map(
        (contact: { name?: string[]; tel?: string[] }) => {
          const rawName = (contact.name?.[0] ?? "").trim();
          const phone = (contact.tel?.[0] ?? "").replace(/\s+/g, "").trim();
          const { isBusiness, personName, companyName } =
            detectBusiness(rawName);
          return {
            name: personName,
            company: companyName,
            phone,
            isBusiness,
            include: isBusiness, // auto-check business, uncheck personal
          };
        },
      );

      setPhoneContacts(parsed);
      setPhoneImportOpen(true);
    } catch {
      toast.error("Contact access cancelled or not supported.");
    }
  };

  const handlePhoneImportSubmit = async () => {
    if (!identity) return;
    const toImport = phoneContacts.filter((c) => c.include);
    if (toImport.length === 0) {
      toast.error("Koi bhi contact select nahi kiya.");
      return;
    }
    // Validate: personal contacts that are manually included must have a company
    const missingCompany = toImport.filter(
      (c) => !c.isBusiness && !c.company.trim(),
    );
    if (missingCompany.length > 0) {
      toast.error(
        `${missingCompany.length} personal contact(s) mein company name bharein.`,
      );
      return;
    }
    setIsPhoneImporting(true);
    toast(`Importing ${toImport.length} contacts...`);
    try {
      let count = 0;
      for (const c of toImport) {
        await createClient.mutateAsync({
          id: 0n,
          name: c.name.trim(),
          company: c.company.trim(),
          phone: c.phone,
          email: "",
          address: "",
          notes: "",
          createdAt: BigInt(Date.now()) * 1_000_000n,
          updatedAt: BigInt(Date.now()) * 1_000_000n,
          createdBy: identity.getPrincipal() as Principal,
        });
        count++;
      }
      toast.success(`${count} client${count !== 1 ? "s" : ""} imported!`);
      setPhoneImportOpen(false);
      setPhoneContacts([]);
    } catch {
      toast.error("Kuch contacts import nahi hue. Please try again.");
    } finally {
      setIsPhoneImporting(false);
    }
  };

  const selectedCount = phoneContacts.filter((c) => c.include).length;
  const businessContacts = phoneContacts.filter((c) => c.isBusiness);
  const personalContacts = phoneContacts.filter((c) => !c.isBusiness);

  const updatePhoneContact = (
    idx: number,
    patch: Partial<PhoneContactEntry>,
  ) => {
    setPhoneContacts((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Users size={24} className="text-primary" />
            Clients
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {clients?.length ?? 0} total clients
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Hidden CSV file input */}
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCSVImport}
          />

          {/* Hidden Excel file input */}
          <input
            ref={excelInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.txt"
            className="hidden"
            onChange={handleExcelImport}
          />

          {/* Download Sample CSV */}
          <Button
            variant="outline"
            size="sm"
            data-ocid="clients.download_sample.button"
            onClick={downloadSampleCSV}
            className="gap-2"
          >
            <Download size={15} />
            Sample CSV
          </Button>

          {/* Import CSV */}
          <Button
            variant="outline"
            size="sm"
            data-ocid="clients.import.upload_button"
            onClick={() => csvInputRef.current?.click()}
            disabled={isImporting || !identity}
            className="gap-2"
          >
            {isImporting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            {isImporting ? "Importing..." : "Import CSV"}
          </Button>

          {/* Import Excel */}
          <Button
            variant="outline"
            size="sm"
            data-ocid="clients.import_excel.upload_button"
            onClick={() => excelInputRef.current?.click()}
            disabled={isImportingExcel || !identity}
            className="gap-2"
          >
            {isImportingExcel ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Sheet size={15} />
            )}
            {isImportingExcel ? "Importing..." : "Import Excel"}
          </Button>

          {/* Import from Phone */}
          <Button
            variant="outline"
            size="sm"
            data-ocid="clients.phone_import.button"
            onClick={handlePhoneImport}
            disabled={!identity}
            className="gap-2"
          >
            <Smartphone size={15} />
            Import from Phone
          </Button>

          {/* Export PDF */}
          {!isLoading && (clients ?? []).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              data-ocid="clients.pdf.button"
              onClick={() => printClientsPDF(clients ?? [])}
              className="gap-2"
            >
              <FileDown size={15} />
              Export PDF
            </Button>
          )}

          {!isLoading && (clients ?? []).length === 0 && (
            <Button
              variant="outline"
              data-ocid="clients.sample.primary_button"
              onClick={handleBulkAdd}
              disabled={isBulkAdding || !identity}
              className="gap-2"
            >
              {isBulkAdding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Database size={16} />
              )}
              {isBulkAdding ? "Adding..." : "Add Sample Clients"}
            </Button>
          )}

          <Dialog
            open={addOpen}
            onOpenChange={(o) => {
              setAddOpen(o);
              if (!o) {
                setForm(emptyForm);
                setPhoneError("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button data-ocid="clients.add_button" className="gap-2">
                <Plus size={16} />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" data-ocid="client.dialog">
              <DialogHeader>
                <DialogTitle className="font-display">
                  Add New Client
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      data-ocid="client.name.input"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Contact name"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      data-ocid="client.company.input"
                      value={form.company}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, company: e.target.value }))
                      }
                      placeholder="Company name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      data-ocid="client.phone.input"
                      value={form.phone}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, phone: e.target.value }));
                        if (phoneError) validatePhone(e.target.value);
                      }}
                      onBlur={(e) => validatePhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      inputMode="numeric"
                    />
                    {phoneError && (
                      <p
                        data-ocid="client.phone.error_state"
                        className="text-xs text-destructive mt-1"
                      >
                        {phoneError}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      data-ocid="client.email.input"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="email@company.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      data-ocid="client.address.input"
                      value={form.address}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, address: e.target.value }))
                      }
                      placeholder="Full address"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="industry">Industry Type</Label>
                    <Select
                      value={form.industry}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, industry: v }))
                      }
                    >
                      <SelectTrigger
                        id="industry"
                        data-ocid="client.industry.select"
                      >
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          — Select industry —
                        </SelectItem>
                        {INDUSTRY_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    data-ocid="client.notes.textarea"
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="client.cancel_button"
                    onClick={() => {
                      setAddOpen(false);
                      setForm(emptyForm);
                      setPhoneError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    data-ocid="client.save_button"
                    disabled={createClient.isPending || !!phoneError}
                  >
                    {createClient.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save Client
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Phone Import Review Modal */}
      <Dialog
        open={phoneImportOpen}
        onOpenChange={(o) => {
          if (!isPhoneImporting) {
            setPhoneImportOpen(o);
            if (!o) setPhoneContacts([]);
          }
        }}
      >
        <DialogContent
          className="max-w-2xl w-full"
          data-ocid="clients.phone_import.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Smartphone size={18} className="text-primary" />
              Phone Contacts Import
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Business contacts (3+ words) auto-detected. Review and select
              which to import.
            </p>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-1">
            <div className="space-y-5">
              {/* Business contacts section */}
              {businessContacts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                      ✅ Business Contacts — {businessContacts.length} detected
                    </span>
                  </div>
                  <div className="space-y-2">
                    {phoneContacts.map((contact, idx) => {
                      if (!contact.isBusiness) return null;
                      const displayIdx = idx + 1;
                      return (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: phone contact list is temporary, no stable ID available
                          key={`phone-${idx}`}
                          data-ocid={`clients.phone_contact.item.${displayIdx}`}
                          className="flex items-start gap-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/40"
                        >
                          <Checkbox
                            id={`pc-include-${idx}`}
                            data-ocid={`clients.phone_contact.checkbox.${displayIdx}`}
                            checked={contact.include}
                            onCheckedChange={(checked) =>
                              updatePhoneContact(idx, {
                                include: Boolean(checked),
                              })
                            }
                            className="mt-1 shrink-0"
                          />
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Person Name
                              </Label>
                              <Input
                                data-ocid={`clients.phone_contact.input.${displayIdx}`}
                                value={contact.name}
                                onChange={(e) =>
                                  updatePhoneContact(idx, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Person name"
                                className="h-8 text-sm"
                                disabled={!contact.include}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Company Name
                              </Label>
                              <Input
                                value={contact.company}
                                onChange={(e) =>
                                  updatePhoneContact(idx, {
                                    company: e.target.value,
                                  })
                                }
                                placeholder="Company name"
                                className="h-8 text-sm"
                                disabled={!contact.include}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Phone
                              </Label>
                              <Input
                                value={contact.phone}
                                readOnly
                                className="h-8 text-sm bg-muted/40"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Personal contacts section */}
              {personalContacts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border">
                      👤 Personal Contacts — {personalContacts.length} (will be
                      skipped by default)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {phoneContacts.map((contact, idx) => {
                      if (contact.isBusiness) return null;
                      const displayIdx = idx + 1;
                      return (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: phone contact list is temporary, no stable ID available
                          key={`phone-p-${idx}`}
                          data-ocid={`clients.phone_contact.item.${displayIdx}`}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20"
                        >
                          <Checkbox
                            id={`pc-personal-${idx}`}
                            data-ocid={`clients.phone_contact.checkbox.${displayIdx}`}
                            checked={contact.include}
                            onCheckedChange={(checked) =>
                              updatePhoneContact(idx, {
                                include: Boolean(checked),
                              })
                            }
                            className="mt-1 shrink-0"
                          />
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Name
                              </Label>
                              <Input
                                value={contact.name}
                                readOnly
                                className="h-8 text-sm bg-muted/40"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Company Name{" "}
                                {contact.include && (
                                  <span className="text-destructive">*</span>
                                )}
                              </Label>
                              <Input
                                value={contact.company}
                                onChange={(e) =>
                                  updatePhoneContact(idx, {
                                    company: e.target.value,
                                  })
                                }
                                placeholder={
                                  contact.include ? "Required" : "Optional"
                                }
                                className="h-8 text-sm"
                                disabled={!contact.include}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Phone
                              </Label>
                              <Input
                                value={contact.phone}
                                readOnly
                                className="h-8 text-sm bg-muted/40"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {phoneContacts.length === 0 && (
                <div
                  data-ocid="clients.phone_import.empty_state"
                  className="text-center py-8 text-muted-foreground"
                >
                  <Smartphone size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Koi contact nahi mila.</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground sm:mr-auto">
              <span className="font-semibold text-foreground">
                {selectedCount}
              </span>{" "}
              contact{selectedCount !== 1 ? "s" : ""} will be imported
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                data-ocid="clients.phone_import.cancel_button"
                onClick={() => {
                  setPhoneImportOpen(false);
                  setPhoneContacts([]);
                }}
                disabled={isPhoneImporting}
              >
                Cancel
              </Button>
              <Button
                data-ocid="clients.phone_import.submit_button"
                onClick={handlePhoneImportSubmit}
                disabled={isPhoneImporting || selectedCount === 0 || !identity}
              >
                {isPhoneImporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPhoneImporting
                  ? "Importing..."
                  : `Import ${selectedCount} Client${selectedCount !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          data-ocid="clients.search_input"
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden shadow-xs">
        <Table data-ocid="clients.table">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                Industry
              </TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                Phone
              </TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">
                Email
              </TableHead>
              <TableHead className="w-24 text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  data-ocid="clients.empty_state"
                  className="text-center py-12 text-muted-foreground"
                >
                  <Building2 size={36} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    {search
                      ? "No clients match your search"
                      : "No clients yet. Add your first client!"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((client, idx) => {
                const industry = extractIndustry(client.notes);
                const industryClass =
                  INDUSTRY_BADGE_CLASSES[industry] ??
                  "bg-muted text-muted-foreground border-border";
                return (
                  <TableRow
                    key={client.id.toString()}
                    data-ocid={`clients.item.${idx + 1}`}
                    className="hover:bg-muted/30 cursor-pointer"
                    onClick={() =>
                      navigate({ to: `/clients/${client.id.toString()}` })
                    }
                  >
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-1.5">
                        {client.name}
                        {(() => {
                          const cnt = decodeContacts(client.notes).length;
                          return cnt > 0 ? (
                            <Badge
                              variant="secondary"
                              className="text-xs px-1.5 py-0 h-4 font-normal"
                              title={`${cnt} contact${cnt !== 1 ? "s" : ""}`}
                            >
                              👥 {cnt}
                            </Badge>
                          ) : null;
                        })()}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.company}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {industry ? (
                        <Badge
                          variant="outline"
                          className={`text-xs ${industryClass}`}
                        >
                          {industry}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {client.phone || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {client.email || "—"}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {(() => {
                        const lastDate = lastVisitMap.get(client.id.toString());
                        if (!lastDate)
                          return (
                            <span className="text-muted-foreground text-xs">
                              Never visited
                            </span>
                          );
                        const d = new Date(Number(lastDate / 1_000_000n));
                        return (
                          <span className="text-xs text-emerald-700 flex items-center gap-1">
                            <Calendar size={11} />
                            {d.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {/* biome-ignore lint/a11y/useKeyWithClickEvents: action cell stop-propagation wrapper */}
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          data-ocid={`client.view_button.${idx + 1}`}
                          onClick={() =>
                            navigate({
                              to: `/clients/${client.id.toString()}`,
                            })
                          }
                          className="h-7 w-7"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-ocid={`client.delete_button.${idx + 1}`}
                          onClick={() => setDeleteId(client.id)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="client.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="client.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="client.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteClient.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Re-export helpers for ClientDetailPage if needed
export { extractIndustry, stripIndustryTag };
