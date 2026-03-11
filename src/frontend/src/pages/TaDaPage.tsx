import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Printer,
  Receipt,
  Upload,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
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

function extractTag(notes: string, tag: string): string {
  const m = notes.match(new RegExp(`\\[${tag}:([^\\]]*?)\\]`));
  return m ? m[1] : "";
}

function buildNotesString(
  serviceReport: string,
  photoDataUrl: string | null,
  billAmount: string,
  fromLocation: string,
  toLocation: string,
  distanceKm: string,
  transportType: string,
  expenseCategory: string,
  extraNotes: string,
): string {
  let result = "";
  if (serviceReport) result += `[SR]${serviceReport}[/SR]`;
  if (photoDataUrl) result += `[PHOTO:${photoDataUrl}]`;
  if (billAmount) result += `[BILL:${billAmount}]`;
  if (fromLocation) result += `[FROM:${fromLocation}]`;
  if (toLocation) result += `[TO:${toLocation}]`;
  if (distanceKm) result += `[DIST:${distanceKm}]`;
  if (transportType && transportType !== "none")
    result += `[TRANS:${transportType}]`;
  if (expenseCategory && expenseCategory !== "none")
    result += `[CAT:${expenseCategory}]`;
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
  billAmount: "",
  fromLocation: "",
  toLocation: "",
  distanceKm: "",
  transportType: "none",
  expenseCategory: "none",
};

// ── Camera Dialog Component ──────────────────────────────────────────────────

function CameraDialog({
  open,
  onClose,
  onCapture,
}: {
  open: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch {
      setCameraError(
        "Camera access denied or not available. Please use file upload instead.",
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    setStreaming(false);
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    stopCamera();
    onCapture(dataUrl);
    onClose();
  }, [stopCamera, onCapture, onClose]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Start camera when dialog opens
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        startCamera();
      } else {
        handleClose();
      }
    },
    [startCamera, handleClose],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg" data-ocid="tada.camera.dialog">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Camera size={18} className="text-primary" />
            Take Bill Photo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cameraError ? (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {cameraError}
            </div>
          ) : (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              {!streaming && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Starting camera...
                </div>
              )}
            </div>
          )}
          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            data-ocid="tada.camera.cancel_button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {!cameraError && (
            <Button
              type="button"
              data-ocid="tada.camera.capture_button"
              onClick={handleCapture}
              disabled={!streaming}
              className="gap-2"
            >
              <Camera size={16} />
              Capture
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Print helper ─────────────────────────────────────────────────────────────

function printClaim(claim: T__3) {
  const billAmount = extractTag(claim.notes, "BILL");
  const fromLoc = extractTag(claim.notes, "FROM");
  const toLoc = extractTag(claim.notes, "TO");
  const dist = extractTag(claim.notes, "DIST");
  const trans = extractTag(claim.notes, "TRANS");
  const cat = extractTag(claim.notes, "CAT");
  const srText = extractServiceReport(claim.notes);
  const photoUrl = extractPhotoDataUrl(claim.notes);
  const totalAmount =
    Number(claim.travelAllowance) +
    Number(claim.dailyAllowance) +
    (billAmount ? Number(billAmount) : 0);

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TA DA Claim Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 4px 0; color: #555; font-size: 13px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .row label { color: #666; font-size: 13px; }
        .row span { font-weight: 600; }
        .total { background: #f0f0f0; padding: 12px 16px; border-radius: 6px; margin-top: 16px; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
        .section { margin-top: 20px; }
        .section h3 { font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .sr { background: #f9f9f9; padding: 12px; border-left: 3px solid #333; white-space: pre-wrap; font-size: 13px; }
        .photo { margin-top: 16px; }
        .photo img { max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }
        .sign-line { margin-top: 40px; border-top: 1px solid #555; width: 200px; text-align: center; padding-top: 6px; font-size: 12px; color: #666; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>TA DA Claim Receipt</p>
        <p>Claim Date: ${new Date(Number(claim.date / 1_000_000n)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
        <p>Status: ${String(claim.status).toUpperCase()} ${claim.adminRemarks ? `— ${claim.adminRemarks}` : ""}</p>
      </div>

      ${fromLoc || toLoc ? `<div class="row"><label>Route</label><span>${fromLoc || "—"} → ${toLoc || "—"}${dist ? ` (${dist} km)` : ""}</span></div>` : ""}
      ${trans && trans !== "none" ? `<div class="row"><label>Transport</label><span>${trans}</span></div>` : ""}
      ${cat && cat !== "none" ? `<div class="row"><label>Category</label><span>${cat}</span></div>` : ""}
      <div class="row"><label>Locations Visited</label><span>${claim.locationsVisited || "—"}</span></div>
      <div class="row"><label>Travel Allowance</label><span>₹${Number(claim.travelAllowance).toLocaleString("en-IN")}</span></div>
      <div class="row"><label>Daily Allowance</label><span>₹${Number(claim.dailyAllowance).toLocaleString("en-IN")}</span></div>
      ${billAmount ? `<div class="row"><label>Bill Amount</label><span>₹${Number(billAmount).toLocaleString("en-IN")}</span></div>` : ""}
      <div class="total"><span>TOTAL CLAIM</span><span>₹${totalAmount.toLocaleString("en-IN")}</span></div>

      ${srText ? `<div class="section"><h3>Service Report</h3><div class="sr">${srText}</div></div>` : ""}
      ${photoUrl ? `<div class="photo section"><h3>Bill Photo</h3><img src="${photoUrl}" alt="Bill" /></div>` : ""}

      <div style="margin-top:40px; display:flex; justify-content:space-between;">
        <div class="sign-line">Staff Signature</div>
        <div class="sign-line">Admin Approval</div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function TaDaPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
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

  const handleCameraCapture = (dataUrl: string) => {
    setForm((p) => ({
      ...p,
      photoDataUrl: dataUrl,
      photoUploadProgress: 100,
    }));
    toast.success("Photo captured!");
  };

  const autoTotal =
    (Number(form.travelAllowance) || 0) +
    (Number(form.dailyAllowance) || 0) +
    (Number(form.billAmount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    try {
      const notesStr = buildNotesString(
        form.serviceReport,
        form.photoDataUrl,
        form.billAmount,
        form.fromLocation,
        form.toLocation,
        form.distanceKm,
        form.transportType,
        form.expenseCategory,
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

  // Monthly limit alert: total claims in current month
  const MONTHLY_LIMIT = 5000;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyTotal = claims
    .filter((c) => {
      const d = new Date(Number(c.date / 1_000_000n));
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce(
      (acc, c) => acc + Number(c.travelAllowance) + Number(c.dailyAllowance),
      0,
    );
  const overMonthlyLimit = !isAdmin && monthlyTotal > MONTHLY_LIMIT;

  const renderClaimRow = (claim: T__3, idx: number) => {
    const srText = extractServiceReport(claim.notes);
    const photoUrl = extractPhotoDataUrl(claim.notes);
    const billAmount = extractTag(claim.notes, "BILL");
    const fromLoc = extractTag(claim.notes, "FROM");
    const toLoc = extractTag(claim.notes, "TO");
    const trans = extractTag(claim.notes, "TRANS");
    const showRoute = fromLoc || toLoc;

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
          <div className="max-w-[200px] space-y-0.5">
            {showRoute && (
              <p className="text-xs font-medium text-foreground">
                {fromLoc || "—"} → {toLoc || "—"}
              </p>
            )}
            <p className="text-muted-foreground truncate text-xs">
              {claim.locationsVisited || "—"}
            </p>
            {srText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-primary/70 truncate cursor-help flex items-center gap-1">
                      <FileText size={10} />
                      {srText.slice(0, 35)}
                      {srText.length > 35 ? "…" : ""}
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
        <TableCell className="hidden md:table-cell text-sm">
          {trans && trans !== "none" ? (
            <Badge variant="outline" className="text-xs">
              {trans}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell className="text-sm">
          {Number(claim.travelAllowance).toLocaleString("en-IN")}
        </TableCell>
        <TableCell className="hidden md:table-cell text-sm">
          {Number(claim.dailyAllowance).toLocaleString("en-IN")}
        </TableCell>
        <TableCell className="hidden lg:table-cell text-sm font-medium">
          {billAmount ? `₹${Number(billAmount).toLocaleString("en-IN")}` : "—"}
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
            {claim.status === "approved" && (
              <button
                type="button"
                data-ocid={`tada.print_button.${idx + 1}`}
                onClick={() => printClaim(claim)}
                className="h-6 w-6 rounded bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                title="Print claim receipt"
              >
                <Printer size={12} className="text-primary" />
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

      {/* Monthly Limit Alert */}
      {overMonthlyLimit && (
        <div
          data-ocid="tada.monthly_limit.card"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-medium"
        >
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>
            Monthly claim total ₹{monthlyTotal.toLocaleString("en-IN")} exceeds
            ₹{MONTHLY_LIMIT.toLocaleString("en-IN")} limit — please review
            before submitting more claims.
          </span>
        </div>
      )}

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
      <div className="rounded-lg border border-border overflow-x-auto shadow-xs">
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
                Route / Locations
              </TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                Transport
              </TableHead>
              <TableHead className="font-semibold">TA (₹)</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                DA (₹)
              </TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">
                Bill Amt
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
                  {Array.from({ length: isAdmin ? 9 : 7 }).map((__, j) => (
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
                  colSpan={isAdmin ? 9 : 7}
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
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="tada.submit.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Submit TA DA Claim
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {/* Date */}
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

            {/* Expense Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Expense Category</Label>
                <Select
                  value={form.expenseCategory}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, expenseCategory: v }))
                  }
                >
                  <SelectTrigger data-ocid="tada.category.select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Select —</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Accommodation">Accommodation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Transport Type</Label>
                <Select
                  value={form.transportType}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, transportType: v }))
                  }
                >
                  <SelectTrigger data-ocid="tada.transport.select">
                    <SelectValue placeholder="Select transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Select —</SelectItem>
                    <SelectItem value="Flight">✈️ Flight</SelectItem>
                    <SelectItem value="Train">🚂 Train</SelectItem>
                    <SelectItem value="Bus">🚌 Bus</SelectItem>
                    <SelectItem value="Auto">🛺 Auto</SelectItem>
                    <SelectItem value="Own Vehicle">🚗 Own Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* From / To / Distance */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>From</Label>
                <Input
                  data-ocid="tada.from.input"
                  value={form.fromLocation}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fromLocation: e.target.value }))
                  }
                  placeholder="Departure city"
                />
              </div>
              <div className="space-y-1.5">
                <Label>To</Label>
                <Input
                  data-ocid="tada.to.input"
                  value={form.toLocation}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, toLocation: e.target.value }))
                  }
                  placeholder="Destination city"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Distance (km)</Label>
                <Input
                  data-ocid="tada.distance.input"
                  type="number"
                  min="0"
                  value={form.distanceKm}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, distanceKm: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            {/* Allowances + Bill Amount */}
            <div className="grid grid-cols-3 gap-3">
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
              <div className="space-y-1.5">
                <Label>Bill Amount (₹)</Label>
                <Input
                  data-ocid="tada.bill_amount.input"
                  type="number"
                  min="0"
                  value={form.billAmount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, billAmount: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            {/* Auto Total */}
            {autoTotal > 0 && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Claim Amount
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  ₹{autoTotal.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Locations Visited */}
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
                rows={3}
                placeholder="Describe services performed, work completed..."
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
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="tada.photo.upload_button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center gap-1.5 text-muted-foreground hover:border-primary/50 hover:text-primary/70 transition-colors cursor-pointer"
                  >
                    <Upload size={18} />
                    <span className="text-xs font-medium">
                      Upload from Gallery
                    </span>
                    <span className="text-[10px]">Max 2MB</span>
                  </button>
                  <button
                    type="button"
                    data-ocid="tada.camera.open_modal_button"
                    onClick={() => setCameraOpen(true)}
                    className="flex-1 border-2 border-dashed border-primary/30 rounded-lg p-3 flex flex-col items-center gap-1.5 text-primary/70 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-primary/5"
                  >
                    <Camera size={18} />
                    <span className="text-xs font-medium">Take Photo</span>
                    <span className="text-[10px]">Use Camera</span>
                  </button>
                </div>
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

            {/* Additional Notes */}
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

      {/* Camera Dialog */}
      <CameraDialog
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

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
