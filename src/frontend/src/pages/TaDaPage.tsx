import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Principal } from "@icp-sdk/core/principal";
import {
  Camera,
  CheckCircle,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Receipt,
  Upload,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Status__2 } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type T__3,
  useAllClaims,
  useApproveClaim,
  useIsAdmin,
  useMyClaims,
  useRejectClaim,
  useSubmitClaim,
} from "../hooks/useQueries";
import { dateInputToNs, formatDate, todayInputStr } from "../utils/dateUtils";

// ── Helper functions ─────────────────────────────────────────────────────────

function extractServiceReport(notes: string): string {
  const m = notes.match(/\[SR\]([\s\S]*?)\[\/SR\]/);
  return m ? m[1] : "";
}

function extractPhotoDataUrl(notes: string): string | null {
  const m = notes.match(/\[PHOTO:([^\]]+)\]/);
  return m ? m[1] : null;
}

function buildNotesString(
  serviceReport: string,
  photoDataUrl: string | null,
  extraNotes: string,
): string {
  let result = "";
  if (serviceReport) result += `[SR]${serviceReport}[/SR]`;
  if (photoDataUrl) result += `[PHOTO:${photoDataUrl}]`;
  if (extraNotes) result += extraNotes;
  return result;
}

const emptyForm = {
  date: todayInputStr(),
  travelAllowance: "",
  dailyAllowance: "",
  locationsVisited: "",
  notes: "",
  serviceReport: "",
  photoDataUrl: null as string | null,
  photoUploadProgress: 0,
};

export default function TaDaPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [remarksText, setRemarksText] = useState("");
  const [actionClaimId, setActionClaimId] = useState<bigint | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: isAdmin } = useIsAdmin();
  const { data: allClaims, isLoading: allLoading } = useAllClaims();
  const { data: myClaims, isLoading: myLoading } = useMyClaims();
  const submitClaim = useSubmitClaim();
  const approveClaim = useApproveClaim();
  const rejectClaim = useRejectClaim();
  const { identity } = useInternetIdentity();

  const claims = isAdmin ? (allClaims ?? []) : (myClaims ?? []);
  const isLoading = isAdmin ? allLoading : myLoading;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB");
      return;
    }
    setForm((p) => ({ ...p, photoUploadProgress: 0 }));
    const reader = new FileReader();
    // Simulate progress via interval
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setForm((p) => ({ ...p, photoUploadProgress: Math.min(progress, 90) }));
      if (progress >= 90) clearInterval(interval);
    }, 80);
    reader.onload = () => {
      clearInterval(interval);
      setForm((p) => ({
        ...p,
        photoDataUrl: reader.result as string,
        photoUploadProgress: 100,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    try {
      const notesStr = buildNotesString(
        form.serviceReport,
        form.photoDataUrl,
        form.notes,
      );
      await submitClaim.mutateAsync({
        id: 0n,
        userId: identity.getPrincipal() as Principal,
        date: dateInputToNs(form.date),
        travelAllowance: BigInt(form.travelAllowance || "0"),
        dailyAllowance: BigInt(form.dailyAllowance || "0"),
        locationsVisited: form.locationsVisited.trim(),
        notes: notesStr,
        adminRemarks: "",
        status: Status__2.pending,
        submittedAt: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Claim submitted successfully");
      setForm(emptyForm);
      setAddOpen(false);
    } catch {
      toast.error("Failed to submit claim");
    }
  };

  const openAction = (id: bigint, type: "approve" | "reject") => {
    setActionClaimId(id);
    setActionType(type);
    setRemarksText("");
    setRemarksOpen(true);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionClaimId === null) return;
    try {
      if (actionType === "approve") {
        await approveClaim.mutateAsync({
          id: actionClaimId,
          remarks: remarksText,
        });
        toast.success("Claim approved");
      } else {
        await rejectClaim.mutateAsync({
          id: actionClaimId,
          remarks: remarksText,
        });
        toast.success("Claim rejected");
      }
      setRemarksOpen(false);
      setActionClaimId(null);
    } catch {
      toast.error("Action failed");
    }
  };

  const totalPending = claims.filter((c) => c.status === "pending").length;
  const totalApproved = claims
    .filter((c) => c.status === "approved")
    .reduce(
      (acc, c) => acc + Number(c.travelAllowance) + Number(c.dailyAllowance),
      0,
    );

  const renderClaimRow = (claim: T__3, idx: number) => {
    const srText = extractServiceReport(claim.notes);
    const photoUrl = extractPhotoDataUrl(claim.notes);

    return (
      <TableRow
        key={claim.id.toString()}
        data-ocid={`tada.item.${idx + 1}`}
        className="hover:bg-muted/20"
      >
        <TableCell className="font-medium">{formatDate(claim.date)}</TableCell>
        {isAdmin && (
          <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-mono">
            {claim.userId.toString().slice(0, 12)}…
          </TableCell>
        )}
        <TableCell className="hidden sm:table-cell">
          <div className="max-w-[180px]">
            <p className="text-muted-foreground truncate text-sm">
              {claim.locationsVisited || "—"}
            </p>
            {srText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-primary/70 truncate mt-0.5 cursor-help flex items-center gap-1">
                      <FileText size={10} />
                      {srText.slice(0, 40)}
                      {srText.length > 40 ? "…" : ""}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs whitespace-pre-wrap">
                    <strong>Service Report:</strong>
                    <br />
                    {srText}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </TableCell>
        <TableCell>
          {Number(claim.travelAllowance).toLocaleString("en-IN")}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {Number(claim.dailyAllowance).toLocaleString("en-IN")}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={claim.status} />
            {photoUrl && (
              <button
                type="button"
                data-ocid={`tada.photo_button.${idx + 1}`}
                onClick={() => setLightboxUrl(photoUrl)}
                className="h-6 w-6 rounded bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                title="View bill photo"
              >
                <Camera size={12} className="text-primary" />
              </button>
            )}
          </div>
        </TableCell>
        {isAdmin && (
          <TableCell>
            {claim.status === "pending" && (
              <div className="flex items-center justify-end gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`tada.approve_button.${idx + 1}`}
                  onClick={() => openAction(claim.id, "approve")}
                  className="h-7 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  <CheckCircle size={12} />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`tada.reject_button.${idx + 1}`}
                  onClick={() => openAction(claim.id, "reject")}
                  className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <XCircle size={12} />
                  Reject
                </Button>
              </div>
            )}
            {claim.status !== "pending" && claim.adminRemarks && (
              <p className="text-xs text-muted-foreground text-right truncate max-w-[120px]">
                {claim.adminRemarks}
              </p>
            )}
          </TableCell>
        )}
      </TableRow>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt size={24} className="text-primary" />
            TA DA Claims
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isAdmin
              ? "Manage all staff travel and daily allowance claims"
              : "Your travel and daily allowance claims"}
          </p>
        </div>
        {!isAdmin && (
          <Button
            data-ocid="tada.submit_button"
            onClick={() => setAddOpen(true)}
            className="gap-2"
          >
            <Plus size={16} />
            Submit Claim
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium">Pending</p>
            <p className="font-display text-2xl font-bold text-amber-600 mt-1">
              {totalPending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium">
              Total Claims
            </p>
            <p className="font-display text-2xl font-bold mt-1">
              {claims.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium">
              Approved Amount
            </p>
            <p className="font-display text-xl font-bold text-emerald-600 mt-1">
              ₹{totalApproved.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden shadow-xs">
        <Table data-ocid="tada.claims_table">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Date</TableHead>
              {isAdmin && (
                <TableHead className="font-semibold hidden md:table-cell">
                  Staff
                </TableHead>
              )}
              <TableHead className="font-semibold hidden sm:table-cell">
                Locations / Report
              </TableHead>
              <TableHead className="font-semibold">TA (₹)</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                DA (₹)
              </TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              {isAdmin && (
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: isAdmin ? 7 : 5 }).map((__, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                    <TableCell key={`cell-${j}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : claims.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 5}
                  data-ocid="tada.empty_state"
                  className="text-center py-12 text-muted-foreground"
                >
                  <FileText size={36} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No claims found</p>
                </TableCell>
              </TableRow>
            ) : (
              claims.map((claim, idx) => renderClaimRow(claim, idx))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Submit Claim Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          setAddOpen(o);
          if (!o) setForm(emptyForm);
        }}
      >
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="tada.submit.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Submit TA DA Claim
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Date *</Label>
              <Input
                data-ocid="tada.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Travel Allowance (₹)</Label>
                <Input
                  data-ocid="tada.travel.input"
                  type="number"
                  min="0"
                  value={form.travelAllowance}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, travelAllowance: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Daily Allowance (₹)</Label>
                <Input
                  data-ocid="tada.daily.input"
                  type="number"
                  min="0"
                  value={form.dailyAllowance}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dailyAllowance: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Locations Visited *</Label>
              <Input
                data-ocid="tada.locations.input"
                value={form.locationsVisited}
                onChange={(e) =>
                  setForm((p) => ({ ...p, locationsVisited: e.target.value }))
                }
                placeholder="e.g. Pune, Nashik, Mumbai"
                required
              />
            </div>
            {/* Service Report */}
            <div className="space-y-1.5">
              <Label>Service Report / Daily Work</Label>
              <Textarea
                data-ocid="tada.service_report.textarea"
                value={form.serviceReport}
                onChange={(e) =>
                  setForm((p) => ({ ...p, serviceReport: e.target.value }))
                }
                rows={4}
                placeholder="Describe services performed, work completed, or issues resolved today..."
              />
            </div>
            {/* Bill Photo Upload */}
            <div className="space-y-2">
              <Label>Bill Photo</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {!form.photoDataUrl ? (
                <button
                  type="button"
                  data-ocid="tada.photo.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors cursor-pointer"
                >
                  <Upload size={20} />
                  <span className="text-sm">Click to upload bill photo</span>
                  <span className="text-xs">Max 2MB · JPG, PNG, WEBP</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <img
                    src={form.photoDataUrl}
                    alt="Bill preview thumbnail"
                    className="h-14 w-14 object-cover rounded cursor-pointer border border-border"
                    onClick={() => setLightboxUrl(form.photoDataUrl)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setLightboxUrl(form.photoDataUrl)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground flex items-center gap-1">
                      <ImageIcon size={14} className="text-primary" />
                      Photo attached
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click image to preview
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        photoDataUrl: null,
                        photoUploadProgress: 0,
                      }))
                    }
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    title="Remove photo"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              )}
              {form.photoUploadProgress > 0 &&
                form.photoUploadProgress < 100 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Loading… {form.photoUploadProgress}%
                    </p>
                    <Progress
                      value={form.photoUploadProgress}
                      className="h-1.5"
                    />
                  </div>
                )}
            </div>
            <div className="space-y-1.5">
              <Label>Additional Notes</Label>
              <Textarea
                data-ocid="tada.notes.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                rows={2}
                placeholder="Any additional details..."
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="tada.cancel_button"
                onClick={() => {
                  setForm(emptyForm);
                  setAddOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="tada.confirm_submit_button"
                disabled={submitClaim.isPending}
              >
                {submitClaim.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit Claim
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Remarks Dialog */}
      <Dialog open={remarksOpen} onOpenChange={setRemarksOpen}>
        <DialogContent className="max-w-sm" data-ocid="tada.action.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {actionType === "approve" ? "Approve Claim" : "Reject Claim"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAction} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Remarks</Label>
              <Textarea
                data-ocid="tada.remarks.textarea"
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                rows={3}
                placeholder="Add remarks (optional)..."
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="tada.action.cancel_button"
                onClick={() => setRemarksOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="tada.action.confirm_button"
                disabled={approveClaim.isPending || rejectClaim.isPending}
                className={
                  actionType === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-destructive hover:bg-destructive/90"
                }
              >
                {approveClaim.isPending || rejectClaim.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {actionType === "approve"
                  ? "Confirm Approve"
                  : "Confirm Reject"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Photo Lightbox */}
      <Dialog
        open={!!lightboxUrl}
        onOpenChange={(o) => !o && setLightboxUrl(null)}
      >
        <DialogContent className="max-w-2xl p-2" data-ocid="tada.photo.dialog">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="font-display text-base flex items-center gap-2">
              <Camera size={16} className="text-primary" />
              Bill Photo
            </DialogTitle>
          </DialogHeader>
          {lightboxUrl && (
            <img
              src={lightboxUrl}
              alt="Bill receipt"
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
