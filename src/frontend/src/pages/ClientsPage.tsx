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
  Database,
  Eye,
  Loader2,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type T__2,
  useClients,
  useCreateClient,
  useDeleteClient,
} from "../hooks/useQueries";

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

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();
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
                    <TableCell className="font-medium">{client.name}</TableCell>
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
