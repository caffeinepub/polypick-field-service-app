import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type T__1,
  type T__2,
  useClient,
  useCreateInteraction,
  useInteractions,
  useUpdateClient,
} from "../hooks/useQueries";
import { dateInputToNs, formatDate, todayInputStr } from "../utils/dateUtils";

export default function ClientDetailPage() {
  const { id } = useParams({ from: "/layout/clients/$id" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const clientId = BigInt(id);
  const { data: client, isLoading: clientLoading } = useClient(clientId);
  const { data: allInteractions } = useInteractions();
  const updateClient = useUpdateClient();
  const createInteraction = useCreateInteraction();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<T__2>>({});
  const [addInteractionOpen, setAddInteractionOpen] = useState(false);
  const [intForm, setIntForm] = useState({
    type: "inquiry",
    title: "",
    description: "",
    status: "open",
    amount: "",
    date: todayInputStr(),
  });

  const clientInteractions = (allInteractions ?? []).filter(
    (i) => i.clientId === clientId,
  );

  const handleEditOpen = () => {
    if (!client) return;
    setEditForm({ ...client });
    setEditOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    try {
      await updateClient.mutateAsync({
        id: clientId,
        client: {
          ...client,
          ...editForm,
          updatedAt: BigInt(Date.now()) * 1_000_000n,
        } as T__2,
      });
      toast.success("Client updated");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update client");
    }
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    try {
      await createInteraction.mutateAsync({
        id: 0n,
        clientId,
        type: intForm.type,
        title: intForm.title.trim(),
        description: intForm.description.trim(),
        status: intForm.status as T__1["status"],
        amount: intForm.amount ? BigInt(intForm.amount) : undefined,
        date: dateInputToNs(intForm.date),
        createdBy: identity.getPrincipal() as Principal,
        updatedAt: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Interaction added");
      setIntForm({
        type: "inquiry",
        title: "",
        description: "",
        status: "open",
        amount: "",
        date: todayInputStr(),
      });
      setAddInteractionOpen(false);
    } catch {
      toast.error("Failed to add interaction");
    }
  };

  if (clientLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 md:p-8 text-center">
        <p className="text-muted-foreground">Client not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: "/clients" })}
        >
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => navigate({ to: "/clients" })}
        >
          <ArrowLeft size={16} />
          Clients
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{client.name}</span>
      </div>

      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {client.name}
          </h1>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Building2 size={14} />
            {client.company}
          </p>
        </div>
        <Button
          variant="outline"
          data-ocid="client.edit_button"
          onClick={handleEditOpen}
          className="gap-2 shrink-0"
        >
          <Pencil size={14} />
          Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-base">
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone size={14} className="text-muted-foreground shrink-0" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail size={14} className="text-muted-foreground shrink-0" />
                <span className="break-all">{client.email}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin
                  size={14}
                  className="text-muted-foreground shrink-0 mt-0.5"
                />
                <span>{client.address}</span>
              </div>
            )}
            {client.notes && (
              <div className="flex items-start gap-3 text-sm">
                <FileText
                  size={14}
                  className="text-muted-foreground shrink-0 mt-0.5"
                />
                <span className="text-muted-foreground">{client.notes}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Added {formatDate(client.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Interactions ({clientInteractions.length})
            </h2>
            <Button
              size="sm"
              data-ocid="interactions.add_button"
              onClick={() => setAddInteractionOpen(true)}
              className="gap-2"
            >
              <Plus size={14} />
              Add
            </Button>
          </div>

          {clientInteractions.length === 0 ? (
            <Card>
              <CardContent
                data-ocid="interactions.empty_state"
                className="py-12 text-center text-muted-foreground"
              >
                <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No interactions yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {clientInteractions.map((int, idx) => (
                <Card
                  key={int.id.toString()}
                  data-ocid={`interactions.item.${idx + 1}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {int.title}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {int.type}
                          </Badge>
                        </div>
                        {int.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {int.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{formatDate(int.date)}</span>
                          {int.amount !== undefined && (
                            <span>
                              ₹{Number(int.amount).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={int.status} className="shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg" data-ocid="client.edit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input
                  data-ocid="client.edit.name.input"
                  value={editForm.name ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Company *</Label>
                <Input
                  data-ocid="client.edit.company.input"
                  value={editForm.company ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, company: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  data-ocid="client.edit.phone.input"
                  value={editForm.phone ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  data-ocid="client.edit.email.input"
                  type="email"
                  value={editForm.email ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input
                data-ocid="client.edit.address.input"
                value={editForm.address ?? ""}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                data-ocid="client.edit.notes.textarea"
                value={editForm.notes ?? ""}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, notes: e.target.value }))
                }
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="client.edit.cancel_button"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="client.edit.save_button"
                disabled={updateClient.isPending}
              >
                {updateClient.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Interaction Dialog */}
      <Dialog open={addInteractionOpen} onOpenChange={setAddInteractionOpen}>
        <DialogContent className="max-w-lg" data-ocid="interaction.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Add Interaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddInteraction} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={intForm.type}
                  onValueChange={(v) => setIntForm((p) => ({ ...p, type: v }))}
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
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={intForm.status}
                  onValueChange={(v) =>
                    setIntForm((p) => ({ ...p, status: v }))
                  }
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
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                data-ocid="interaction.title.input"
                value={intForm.title}
                onChange={(e) =>
                  setIntForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Initial inquiry for pumps"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                data-ocid="interaction.description.textarea"
                value={intForm.description}
                onChange={(e) =>
                  setIntForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                placeholder="Details..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  data-ocid="interaction.date.input"
                  type="date"
                  value={intForm.date}
                  onChange={(e) =>
                    setIntForm((p) => ({ ...p, date: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Amount (₹)</Label>
                <Input
                  data-ocid="interaction.amount.input"
                  type="number"
                  min="0"
                  value={intForm.amount}
                  onChange={(e) =>
                    setIntForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="interaction.add.cancel_button"
                onClick={() => setAddInteractionOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="interaction.add.save_button"
                disabled={createInteraction.isPending}
              >
                {createInteraction.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add Interaction
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
