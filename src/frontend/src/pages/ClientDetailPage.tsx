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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  type ClientContact,
  decodeContacts,
  encodeContacts,
  genContactId,
  stripContactsTag,
} from "../utils/clientContacts";
import { dateInputToNs, formatDate, todayInputStr } from "../utils/dateUtils";
import { stripIndustryTag } from "./ClientsPage";

// Dept badge color map (cycles for unknown departments)
const DEPT_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-cyan-50 text-cyan-700 border-cyan-200",
];

const deptColorClass = (dept: string) => {
  let hash = 0;
  for (let i = 0; i < dept.length; i++) hash += dept.charCodeAt(i);
  return DEPT_COLORS[hash % DEPT_COLORS.length];
};

const emptyContactForm = {
  name: "",
  department: "",
  designation: "",
  phone: "",
  email: "",
};

export default function ClientDetailPage() {
  const { id } = useParams({ from: "/layout/clients/$id" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const clientId = BigInt(id);
  const { data: client, isLoading: clientLoading } = useClient(clientId);
  const { data: allInteractions } = useInteractions();
  const updateClient = useUpdateClient();
  const createInteraction = useCreateInteraction();

  // ── Edit client dialog ─────────────────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<T__2>>({});

  // ── Interaction dialog ─────────────────────────────────────────────────────
  const [addInteractionOpen, setAddInteractionOpen] = useState(false);
  const [intForm, setIntForm] = useState({
    type: "inquiry",
    title: "",
    description: "",
    status: "open",
    amount: "",
    date: todayInputStr(),
  });

  // ── Contacts state ─────────────────────────────────────────────────────────
  const [contacts, setContacts] = useState<ClientContact[]>([]);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [editContact, setEditContact] = useState<ClientContact | null>(null);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [isSavingContact, setIsSavingContact] = useState(false);

  // Sync contacts from client notes whenever client loads/changes
  useEffect(() => {
    if (client) {
      setContacts(decodeContacts(client.notes));
    }
  }, [client]);

  const clientInteractions = (allInteractions ?? []).filter(
    (i) => i.clientId === clientId,
  );

  // ── Edit client handlers ───────────────────────────────────────────────────
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

  // ── Interaction handler ────────────────────────────────────────────────────
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

  // ── Contact CRUD helpers ───────────────────────────────────────────────────
  const saveContactsToBackend = async (
    newContacts: ClientContact[],
  ): Promise<void> => {
    if (!client) return;
    const updatedNotes = encodeContacts(client.notes, newContacts);
    await updateClient.mutateAsync({
      id: clientId,
      client: {
        ...client,
        notes: updatedNotes,
        updatedAt: BigInt(Date.now()) * 1_000_000n,
      } as T__2,
    });
    setContacts(newContacts);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      const newContact: ClientContact = {
        id: genContactId(),
        name: contactForm.name.trim(),
        department: contactForm.department.trim(),
        designation: contactForm.designation.trim(),
        phone: contactForm.phone.trim(),
        email: contactForm.email.trim(),
      };
      const updated = [...contacts, newContact];
      await saveContactsToBackend(updated);
      toast.success("Contact added");
      setContactForm(emptyContactForm);
      setAddContactOpen(false);
    } catch {
      toast.error("Failed to add contact");
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleEditContactSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContact) return;
    setIsSavingContact(true);
    try {
      const updated = contacts.map((c) =>
        c.id === editContact.id
          ? {
              ...c,
              name: contactForm.name.trim(),
              department: contactForm.department.trim(),
              designation: contactForm.designation.trim(),
              phone: contactForm.phone.trim(),
              email: contactForm.email.trim(),
            }
          : c,
      );
      await saveContactsToBackend(updated);
      toast.success("Contact updated");
      setEditContact(null);
      setContactForm(emptyContactForm);
    } catch {
      toast.error("Failed to update contact");
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!deleteContactId) return;
    setIsSavingContact(true);
    try {
      const updated = contacts.filter((c) => c.id !== deleteContactId);
      await saveContactsToBackend(updated);
      toast.success("Contact removed");
      setDeleteContactId(null);
    } catch {
      toast.error("Failed to remove contact");
    } finally {
      setIsSavingContact(false);
    }
  };

  // Open edit contact dialog with prefilled form
  const openEditContact = (contact: ClientContact) => {
    setEditContact(contact);
    setContactForm({
      name: contact.name,
      department: contact.department,
      designation: contact.designation,
      phone: contact.phone,
      email: contact.email,
    });
  };

  // ── Loading / not found ────────────────────────────────────────────────────
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

  const visibleNotes = stripIndustryTag(stripContactsTag(client.notes));

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

      {/* Tabbed Layout */}
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger
            value="contacts"
            data-ocid="client.contacts.tab"
            className="gap-2"
          >
            <Users size={14} />
            Contacts
            {contacts.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-5 px-1 text-xs"
              >
                {contacts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="interactions"
            data-ocid="client.interactions.tab"
            className="gap-2"
          >
            <MessageSquare size={14} />
            Interactions
            {clientInteractions.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-5 px-1 text-xs"
              >
                {clientInteractions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Contacts Tab ──────────────────────────────────────────────────── */}
        <TabsContent value="contacts" className="space-y-4">
          {/* Client Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Client Info
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
              {visibleNotes && (
                <div className="flex items-start gap-3 text-sm">
                  <FileText
                    size={14}
                    className="text-muted-foreground shrink-0 mt-0.5"
                  />
                  <span className="text-muted-foreground">{visibleNotes}</span>
                </div>
              )}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Added {formatDate(client.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Persons Section */}
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Contact Persons ({contacts.length})
            </h2>
            <Button
              size="sm"
              data-ocid="contact.add_button"
              onClick={() => {
                setContactForm(emptyContactForm);
                setAddContactOpen(true);
              }}
              className="gap-2"
            >
              <Plus size={14} />
              Add Contact
            </Button>
          </div>

          {contacts.length === 0 ? (
            <Card>
              <CardContent
                data-ocid="contact.empty_state"
                className="py-12 text-center text-muted-foreground"
              >
                <User size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">
                  No contacts yet. Add the first contact person.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contacts.map((contact, idx) => (
                <Card
                  key={contact.id}
                  data-ocid={`contact.item.${idx + 1}`}
                  className="relative group"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-2 flex-1">
                        {/* Name + Dept */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-foreground">
                            {contact.name}
                          </span>
                          {contact.department && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${deptColorClass(contact.department)}`}
                            >
                              {contact.department}
                            </Badge>
                          )}
                        </div>

                        {/* Designation */}
                        {contact.designation && (
                          <p className="text-xs text-muted-foreground">
                            {contact.designation}
                          </p>
                        )}

                        {/* Phone */}
                        {contact.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone size={11} />
                            <span>{contact.phone}</span>
                          </div>
                        )}

                        {/* Email */}
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail size={11} />
                            <span className="break-all">{contact.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          data-ocid={`contact.edit_button.${idx + 1}`}
                          onClick={() => openEditContact(contact)}
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          data-ocid={`contact.delete_button.${idx + 1}`}
                          onClick={() => setDeleteContactId(contact.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Interactions Tab ──────────────────────────────────────────────── */}
        <TabsContent value="interactions" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      {/* ── Edit Client Dialog ─────────────────────────────────────────────── */}
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

      {/* ── Add Interaction Dialog ─────────────────────────────────────────── */}
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

      {/* ── Add Contact Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={addContactOpen}
        onOpenChange={(o) => {
          setAddContactOpen(o);
          if (!o) setContactForm(emptyContactForm);
        }}
      >
        <DialogContent className="max-w-lg" data-ocid="contact.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Add Contact Person
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddContact} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                data-ocid="contact.name.input"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Full name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Department *</Label>
                <Input
                  data-ocid="contact.department.input"
                  value={contactForm.department}
                  onChange={(e) =>
                    setContactForm((p) => ({
                      ...p,
                      department: e.target.value,
                    }))
                  }
                  placeholder="e.g. Purchase, Maintenance"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input
                  data-ocid="contact.designation.input"
                  value={contactForm.designation}
                  onChange={(e) =>
                    setContactForm((p) => ({
                      ...p,
                      designation: e.target.value,
                    }))
                  }
                  placeholder="e.g. Manager"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  data-ocid="contact.phone.input"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="Mobile number"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  data-ocid="contact.email.input"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="email@company.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="contact.add.cancel_button"
                onClick={() => {
                  setAddContactOpen(false);
                  setContactForm(emptyContactForm);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="contact.add.save_button"
                disabled={isSavingContact}
              >
                {isSavingContact ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Contact Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={editContact !== null}
        onOpenChange={(o) => {
          if (!o) {
            setEditContact(null);
            setContactForm(emptyContactForm);
          }
        }}
      >
        <DialogContent className="max-w-lg" data-ocid="contact.edit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Edit Contact Person
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditContactSave} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                data-ocid="contact.edit.name.input"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Full name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Department *</Label>
                <Input
                  data-ocid="contact.edit.department.input"
                  value={contactForm.department}
                  onChange={(e) =>
                    setContactForm((p) => ({
                      ...p,
                      department: e.target.value,
                    }))
                  }
                  placeholder="e.g. Purchase, Maintenance"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input
                  data-ocid="contact.edit.designation.input"
                  value={contactForm.designation}
                  onChange={(e) =>
                    setContactForm((p) => ({
                      ...p,
                      designation: e.target.value,
                    }))
                  }
                  placeholder="e.g. Manager"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  data-ocid="contact.edit.phone.input"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="Mobile number"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  data-ocid="contact.edit.email.input"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="email@company.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="contact.edit.cancel_button"
                onClick={() => {
                  setEditContact(null);
                  setContactForm(emptyContactForm);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="contact.edit.save_button"
                disabled={isSavingContact}
              >
                {isSavingContact ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Contact AlertDialog ─────────────────────────────────────── */}
      <AlertDialog
        open={deleteContactId !== null}
        onOpenChange={(o) => !o && setDeleteContactId(null)}
      >
        <AlertDialogContent data-ocid="contact.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this contact person? This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="contact.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="contact.delete.confirm_button"
              onClick={handleDeleteContact}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isSavingContact}
            >
              {isSavingContact ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
