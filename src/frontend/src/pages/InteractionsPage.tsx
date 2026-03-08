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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import {
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type T__1,
  useClients,
  useCreateInteraction,
  useDeleteInteraction,
  useInteractions,
  usePipelineStats,
  useUpdateInteraction,
} from "../hooks/useQueries";
import {
  dateInputToNs,
  formatDate,
  nsToDateInput,
  todayInputStr,
} from "../utils/dateUtils";

const TYPES = ["all", "inquiry", "offer", "order", "followup"];

const emptyForm = {
  clientId: "",
  type: "inquiry",
  title: "",
  description: "",
  status: "open",
  amount: "",
  date: todayInputStr(),
};

export default function InteractionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<bigint | null>(null);

  const { data: interactions, isLoading } = useInteractions();
  const { data: clients } = useClients();
  const { data: pipelineStats } = usePipelineStats();
  const createInteraction = useCreateInteraction();
  const updateInteraction = useUpdateInteraction();
  const deleteInteraction = useDeleteInteraction();
  const { identity } = useInternetIdentity();

  const getClientName = (id: bigint) =>
    clients?.find((c) => c.id === id)?.name ?? `Client #${id}`;

  const filtered = (interactions ?? []).filter(
    (i) => activeTab === "all" || i.type === activeTab,
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !form.clientId) return;
    try {
      await createInteraction.mutateAsync({
        id: 0n,
        clientId: BigInt(form.clientId),
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status as T__1["status"],
        amount: form.amount ? BigInt(form.amount) : undefined,
        date: dateInputToNs(form.date),
        createdBy: identity.getPrincipal() as Principal,
        updatedAt: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Interaction added");
      setForm(emptyForm);
      setAddOpen(false);
    } catch {
      toast.error("Failed to add interaction");
    }
  };

  const handleEditOpen = (int: T__1) => {
    setEditingId(int.id);
    setForm({
      clientId: int.clientId.toString(),
      type: int.type,
      title: int.title,
      description: int.description,
      status: int.status,
      amount: int.amount !== undefined ? int.amount.toString() : "",
      date: nsToDateInput(int.date),
    });
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !identity) return;
    const orig = interactions?.find((i) => i.id === editingId);
    if (!orig) return;
    try {
      await updateInteraction.mutateAsync({
        id: editingId,
        interaction: {
          ...orig,
          clientId: BigInt(form.clientId),
          type: form.type,
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status as T__1["status"],
          amount: form.amount ? BigInt(form.amount) : undefined,
          date: dateInputToNs(form.date),
          updatedAt: BigInt(Date.now()) * 1_000_000n,
        },
      });
      toast.success("Interaction updated");
      setEditOpen(false);
      setEditingId(null);
    } catch {
      toast.error("Failed to update interaction");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteInteraction.mutateAsync(deleteId);
      toast.success("Interaction deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const InteractionForm = ({
    onSubmit,
    submitting,
  }: { onSubmit: (e: React.FormEvent) => void; submitting: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Client *</Label>
          <Select
            value={form.clientId}
            onValueChange={(v) => setForm((p) => ({ ...p, clientId: v }))}
          >
            <SelectTrigger data-ocid="interaction.client.select">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {(clients ?? []).map((c) => (
                <SelectItem key={c.id.toString()} value={c.id.toString()}>
                  {c.name} – {c.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
          >
            <SelectTrigger data-ocid="interaction.type.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inquiry">Inquiry</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="followup">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Title *</Label>
        <Input
          data-ocid="interaction.title.input"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
          placeholder="e.g. Pump supply inquiry"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          data-ocid="interaction.description.textarea"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          rows={3}
          placeholder="Details..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
          >
            <SelectTrigger data-ocid="interaction.status.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Amount (₹)</Label>
          <Input
            data-ocid="interaction.amount.input"
            type="number"
            min="0"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input
            data-ocid="interaction.date.input"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          data-ocid="interactions.cancel_button"
          onClick={() => {
            setAddOpen(false);
            setEditOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="interactions.save_button"
          disabled={submitting || !form.clientId}
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            Interactions & Pipeline
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Track inquiries, offers, orders, and follow-ups
          </p>
        </div>
        <Button
          data-ocid="interactions.add_button"
          onClick={() => {
            setForm(emptyForm);
            setAddOpen(true);
          }}
          className="gap-2"
        >
          <Plus size={16} />
          Add Interaction
        </Button>
      </div>

      {/* Pipeline Summary */}
      {pipelineStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Inquiries",
              value: pipelineStats.inquiry,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Offers",
              value: pipelineStats.offer,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Orders",
              value: pipelineStats.order,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Follow-ups",
              value: pipelineStats.followup,
              color: "text-purple-600 bg-purple-50",
            },
          ].map((s) => (
            <Card key={s.label} className="overflow-hidden">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {s.label}
                    </p>
                    <p className="font-display text-2xl font-bold mt-0.5">
                      {Number(s.value)}
                    </p>
                  </div>
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}
                  >
                    <TrendingUp size={18} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs + Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-ocid="interactions.tab">
          {TYPES.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t === "followup"
                ? "Follow-up"
                : t === "all"
                  ? "All"
                  : t.charAt(0).toUpperCase() + t.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {TYPES.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="rounded-lg border border-border overflow-hidden shadow-xs mt-4">
              <Table data-ocid="interactions.table">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="w-24 text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                      <TableRow key={`skeleton-${i}`}>
                        {Array.from({ length: 7 }).map((__, j) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                          <TableCell key={`cell-${j}`}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        data-ocid="interactions.empty_state"
                        className="text-center py-12 text-muted-foreground"
                      >
                        <MessageSquare
                          size={36}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p className="text-sm">No interactions found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((int, idx) => (
                      <TableRow
                        key={int.id.toString()}
                        data-ocid={`interactions.item.${idx + 1}`}
                        className="hover:bg-muted/20"
                      >
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {int.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getClientName(int.clientId)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {int.type === "followup" ? "Follow-up" : int.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={int.status} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {int.amount !== undefined
                            ? `₹${Number(int.amount).toLocaleString("en-IN")}`
                            : "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {formatDate(int.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              data-ocid={`interactions.edit_button.${idx + 1}`}
                              onClick={() => handleEditOpen(int)}
                              className="h-7 w-7"
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-ocid={`interactions.delete_button.${idx + 1}`}
                              onClick={() => setDeleteId(int.id)}
                              className="h-7 w-7 text-destructive hover:text-destructive"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg" data-ocid="interactions.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Add Interaction</DialogTitle>
          </DialogHeader>
          <InteractionForm
            onSubmit={handleAdd}
            submitting={createInteraction.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="max-w-lg"
          data-ocid="interactions.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Edit Interaction</DialogTitle>
          </DialogHeader>
          <InteractionForm
            onSubmit={handleEdit}
            submitting={updateInteraction.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="interactions.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interaction</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="interactions.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="interactions.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteInteraction.isPending ? (
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
