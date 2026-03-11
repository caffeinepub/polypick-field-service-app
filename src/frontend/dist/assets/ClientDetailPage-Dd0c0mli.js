import { c as createLucideIcon, u as useParams, a as useNavigate, b as useInternetIdentity, d as useClient, e as useInteractions, f as useUpdateClient, g as useCreateInteraction, r as reactExports, t as todayInputStr, j as jsxRuntimeExports, S as Skeleton, B as Button, U as Users, h as Badge, C as Card, i as CardHeader, k as CardTitle, l as CardContent, P as Phone, F as FileText, m as formatDate, n as User, o as StatusBadge, L as Label, I as Input, p as LoaderCircle, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem, y as ue, z as dateInputToNs } from "./index-B35ZsBaz.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dx5L2af-.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-By5XpH_Y.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DB99EWwg.js";
import { T as Textarea } from "./textarea-BSm-TJHQ.js";
import { d as decodeContacts, s as stripIndustryTag, a as stripContactsTag, S as Smartphone, g as genContactId, e as encodeContacts } from "./ClientsPage-CnWp-4qn.js";
import { A as ArrowLeft } from "./arrow-left-BK_O0NO2.js";
import { B as Building2 } from "./building-2-Bc-1Jyoz.js";
import { P as Pencil } from "./pencil-fOaQNNIL.js";
import { M as Mail } from "./mail-DYWRfUZJ.js";
import { M as MapPin } from "./map-pin-BFud0hEC.js";
import { P as Plus } from "./plus-CePg9O6D.js";
import { T as Trash2 } from "./trash-2-y2naHm-4.js";
import "./index-D9TW8sPI.js";
import "./checkbox-3sZKEVxp.js";
import "./table-DrCVGfIm.js";
import "./download-DfhWrGN8.js";
import "./upload-DnyTotmE.js";
import "./file-down-Dg8soP5s.js";
import "./calendar-BTmADWLM.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5", key: "1hfsw2" }],
  ["line", { x1: "13", x2: "19", y1: "19", y2: "13", key: "1vrmhu" }],
  ["line", { x1: "16", x2: "20", y1: "16", y2: "20", key: "1bron3" }],
  ["line", { x1: "19", x2: "21", y1: "21", y2: "19", key: "13pww6" }],
  ["polyline", { points: "14.5 6.5 18 3 21 3 21 6 17.5 9.5", key: "hbey2j" }],
  ["line", { x1: "5", x2: "9", y1: "14", y2: "18", key: "1hf58s" }],
  ["line", { x1: "7", x2: "4", y1: "17", y2: "20", key: "pidxm4" }],
  ["line", { x1: "3", x2: "5", y1: "19", y2: "21", key: "1pehsh" }]
];
const Swords = createLucideIcon("swords", __iconNode);
const DEPT_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-cyan-50 text-cyan-700 border-cyan-200"
];
const deptColorClass = (dept) => {
  let hash = 0;
  for (let i = 0; i < dept.length; i++) hash += dept.charCodeAt(i);
  return DEPT_COLORS[hash % DEPT_COLORS.length];
};
const SENIORITY_OPTIONS = ["Senior", "Junior", "Manager", "Director", "Other"];
const SENIORITY_BADGE_CLASSES = {
  Senior: "bg-green-50 text-green-700 border-green-200",
  Manager: "bg-purple-50 text-purple-700 border-purple-200",
  Director: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Junior: "bg-orange-50 text-orange-700 border-orange-200",
  Other: "bg-muted text-muted-foreground border-border"
};
const emptyContactForm = {
  name: "",
  department: "",
  designation: "",
  seniority: "",
  phone: "",
  email: ""
};
function useCompetitors(clientId) {
  const key = `polypick_competitors_${clientId}`;
  const [competitors, setCompetitors] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "[]");
    } catch {
      return [];
    }
  });
  const save = (next) => {
    setCompetitors(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  const add = (c) => {
    save([...competitors, { ...c, id: String(Date.now()) }]);
  };
  const remove = (id) => save(competitors.filter((c) => c.id !== id));
  return { competitors, add, remove };
}
function ClientDetailPage() {
  const { id } = useParams({ from: "/layout/clients/$id" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const clientId = BigInt(id);
  const { data: client, isLoading: clientLoading } = useClient(clientId);
  const { data: allInteractions } = useInteractions();
  const updateClient = useUpdateClient();
  const createInteraction = useCreateInteraction();
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [editForm, setEditForm] = reactExports.useState({});
  const [addInteractionOpen, setAddInteractionOpen] = reactExports.useState(false);
  const [intForm, setIntForm] = reactExports.useState({
    type: "inquiry",
    title: "",
    description: "",
    status: "open",
    amount: "",
    date: todayInputStr()
  });
  const [contacts, setContacts] = reactExports.useState([]);
  const [addContactOpen, setAddContactOpen] = reactExports.useState(false);
  const [editContact, setEditContact] = reactExports.useState(null);
  const [deleteContactId, setDeleteContactId] = reactExports.useState(null);
  const [contactForm, setContactForm] = reactExports.useState(emptyContactForm);
  const [isSavingContact, setIsSavingContact] = reactExports.useState(false);
  const [phoneImportOpen, setPhoneImportOpen] = reactExports.useState(false);
  const [stagedPhoneContacts, setStagedPhoneContacts] = reactExports.useState([]);
  const {
    competitors,
    add: addCompetitor,
    remove: removeCompetitor
  } = useCompetitors(id);
  const [addCompetitorOpen, setAddCompetitorOpen] = reactExports.useState(false);
  const [competitorForm, setCompetitorForm] = reactExports.useState({
    companyName: "",
    product: "",
    notes: "",
    dateAdded: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
  const handleAddCompetitor = () => {
    if (!competitorForm.companyName.trim()) return;
    addCompetitor(competitorForm);
    setCompetitorForm({
      companyName: "",
      product: "",
      notes: "",
      dateAdded: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    });
    setAddCompetitorOpen(false);
    ue.success("Competitor added!");
  };
  reactExports.useEffect(() => {
    if (client) {
      setContacts(decodeContacts(client.notes));
    }
  }, [client]);
  const clientInteractions = (allInteractions ?? []).filter(
    (i) => i.clientId === clientId
  );
  const handleEditOpen = () => {
    if (!client) return;
    setEditForm({ ...client });
    setEditOpen(true);
  };
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!client) return;
    try {
      await updateClient.mutateAsync({
        id: clientId,
        client: {
          ...client,
          ...editForm,
          updatedAt: BigInt(Date.now()) * 1000000n
        }
      });
      ue.success("Client updated");
      setEditOpen(false);
    } catch {
      ue.error("Failed to update client");
    }
  };
  const handleAddInteraction = async (e) => {
    e.preventDefault();
    if (!identity) return;
    try {
      await createInteraction.mutateAsync({
        id: 0n,
        clientId,
        type: intForm.type,
        title: intForm.title.trim(),
        description: intForm.description.trim(),
        status: intForm.status,
        amount: intForm.amount ? BigInt(intForm.amount) : void 0,
        date: dateInputToNs(intForm.date),
        createdBy: identity.getPrincipal(),
        updatedAt: BigInt(Date.now()) * 1000000n
      });
      ue.success("Interaction added");
      setIntForm({
        type: "inquiry",
        title: "",
        description: "",
        status: "open",
        amount: "",
        date: todayInputStr()
      });
      setAddInteractionOpen(false);
    } catch {
      ue.error("Failed to add interaction");
    }
  };
  const saveContactsToBackend = async (newContacts) => {
    if (!client) return;
    const updatedNotes = encodeContacts(client.notes, newContacts);
    await updateClient.mutateAsync({
      id: clientId,
      client: {
        ...client,
        notes: updatedNotes,
        updatedAt: BigInt(Date.now()) * 1000000n
      }
    });
    setContacts(newContacts);
  };
  const handleAddContact = async (e) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      const newContact = {
        id: genContactId(),
        name: contactForm.name.trim(),
        department: contactForm.department.trim(),
        designation: contactForm.designation.trim(),
        seniority: contactForm.seniority.trim(),
        phone: contactForm.phone.trim(),
        email: contactForm.email.trim()
      };
      const updated = [...contacts, newContact];
      await saveContactsToBackend(updated);
      ue.success("Contact added");
      setContactForm(emptyContactForm);
      setAddContactOpen(false);
    } catch {
      ue.error("Failed to add contact");
    } finally {
      setIsSavingContact(false);
    }
  };
  const handleEditContactSave = async (e) => {
    e.preventDefault();
    if (!editContact) return;
    setIsSavingContact(true);
    try {
      const updated = contacts.map(
        (c) => c.id === editContact.id ? {
          ...c,
          name: contactForm.name.trim(),
          department: contactForm.department.trim(),
          designation: contactForm.designation.trim(),
          seniority: contactForm.seniority.trim(),
          phone: contactForm.phone.trim(),
          email: contactForm.email.trim()
        } : c
      );
      await saveContactsToBackend(updated);
      ue.success("Contact updated");
      setEditContact(null);
      setContactForm(emptyContactForm);
    } catch {
      ue.error("Failed to update contact");
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
      ue.success("Contact removed");
      setDeleteContactId(null);
    } catch {
      ue.error("Failed to remove contact");
    } finally {
      setIsSavingContact(false);
    }
  };
  const openEditContact = (contact) => {
    setEditContact(contact);
    setContactForm({
      name: contact.name,
      department: contact.department,
      designation: contact.designation,
      seniority: contact.seniority ?? "",
      phone: contact.phone,
      email: contact.email
    });
  };
  const handleImportFromPhone = async () => {
    if (!("contacts" in navigator) || !navigator.contacts) {
      ue.error(
        "Phone contact import is only available on supported mobile browsers (Chrome on Android, Safari on iOS)"
      );
      return;
    }
    try {
      const props = ["name", "tel", "email"];
      const navContacts = navigator.contacts;
      const selected = await navContacts.select(props, { multiple: true });
      if (!selected || selected.length === 0) return;
      const staged = selected.map((c) => {
        var _a, _b, _c;
        return {
          tempId: genContactId(),
          name: (((_a = c.name) == null ? void 0 : _a[0]) ?? "").trim(),
          phone: (((_b = c.tel) == null ? void 0 : _b[0]) ?? "").trim(),
          email: (((_c = c.email) == null ? void 0 : _c[0]) ?? "").trim(),
          department: "",
          seniority: ""
        };
      });
      setStagedPhoneContacts(staged);
      setPhoneImportOpen(true);
    } catch {
      ue.error("Could not access contacts");
    }
  };
  const handlePhoneImportConfirm = async () => {
    setIsSavingContact(true);
    try {
      const newContacts = stagedPhoneContacts.map((c) => ({
        id: genContactId(),
        name: c.name,
        department: c.department,
        designation: "",
        seniority: c.seniority,
        phone: c.phone,
        email: c.email
      }));
      const updated = [...contacts, ...newContacts];
      await saveContactsToBackend(updated);
      ue.success(
        `${newContacts.length} contact${newContacts.length !== 1 ? "s" : ""} imported!`
      );
      setPhoneImportOpen(false);
      setStagedPhoneContacts([]);
    } catch {
      ue.error("Failed to import contacts");
    } finally {
      setIsSavingContact(false);
    }
  };
  if (clientLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64" })
      ] })
    ] });
  }
  if (!client) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Client not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "mt-4",
          onClick: () => navigate({ to: "/clients" }),
          children: "Back to Clients"
        }
      )
    ] });
  }
  const visibleNotes = stripIndustryTag(stripContactsTag(client.notes));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "gap-2 text-muted-foreground",
          onClick: () => navigate({ to: "/clients" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
            "Clients"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: client.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: client.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 14 }),
          client.company
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          "data-ocid": "client.edit_button",
          onClick: handleEditOpen,
          className: "gap-2 shrink-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 }),
            "Edit Client"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "contacts", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "contacts",
            "data-ocid": "client.contacts.tab",
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
              "Contacts",
              contacts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "ml-1 h-5 min-w-5 px-1 text-xs",
                  children: contacts.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "interactions",
            "data-ocid": "client.interactions.tab",
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 14 }),
              "Interactions",
              clientInteractions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "ml-1 h-5 min-w-5 px-1 text-xs",
                  children: clientInteractions.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "competitors",
            "data-ocid": "client.competitors.tab",
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { size: 14 }),
              "Competitors",
              competitors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "ml-1 h-5 min-w-5 px-1 text-xs",
                  children: competitors.length
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "contacts", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Client Info" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            client.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14, className: "text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: client.phone })
            ] }),
            client.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14, className: "text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all", children: client.email })
            ] }),
            client.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MapPin,
                {
                  size: 14,
                  className: "text-muted-foreground shrink-0 mt-0.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: client.address })
            ] }),
            visibleNotes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FileText,
                {
                  size: 14,
                  className: "text-muted-foreground shrink-0 mt-0.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: visibleNotes })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Added ",
              formatDate(client.createdAt)
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-semibold text-foreground", children: [
            "Contact Persons (",
            contacts.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                "data-ocid": "contact.import_phone.button",
                onClick: handleImportFromPhone,
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 14 }),
                  "Import from Phone"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                "data-ocid": "contact.add_button",
                onClick: () => {
                  setContactForm(emptyContactForm);
                  setAddContactOpen(true);
                },
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                  "Add Contact"
                ]
              }
            )
          ] })
        ] }),
        contacts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CardContent,
          {
            "data-ocid": "contact.empty_state",
            className: "py-12 text-center text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 36, className: "mx-auto mb-2 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No contacts yet. Add the first contact person." })
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: contacts.map((contact, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `contact.item.${idx + 1}`,
            className: "relative group",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-2 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: contact.name }),
                  contact.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs ${deptColorClass(contact.department)}`,
                      children: contact.department
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                  contact.designation && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: contact.designation }),
                  contact.seniority && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs px-1.5 py-0 h-4 ${SENIORITY_BADGE_CLASSES[contact.seniority] ?? SENIORITY_BADGE_CLASSES.Other}`,
                      children: contact.seniority
                    }
                  )
                ] }),
                contact.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: contact.phone })
                ] }),
                contact.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 11 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all", children: contact.email })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7",
                    "data-ocid": `contact.edit_button.${idx + 1}`,
                    onClick: () => openEditContact(contact),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-destructive hover:text-destructive",
                    "data-ocid": `contact.delete_button.${idx + 1}`,
                    onClick: () => setDeleteContactId(contact.id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] })
            ] }) })
          },
          contact.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "interactions", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-semibold text-foreground", children: [
            "Interactions (",
            clientInteractions.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              "data-ocid": "interactions.add_button",
              onClick: () => setAddInteractionOpen(true),
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                "Add"
              ]
            }
          )
        ] }),
        clientInteractions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CardContent,
          {
            "data-ocid": "interactions.empty_state",
            className: "py-12 text-center text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 36, className: "mx-auto mb-2 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No interactions yet" })
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: clientInteractions.map((int, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `interactions.item.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: int.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs capitalize",
                      children: int.type
                    }
                  )
                ] }),
                int.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: int.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(int.date) }),
                  int.amount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "₹",
                    Number(int.amount).toLocaleString("en-IN")
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: int.status, className: "shrink-0" })
            ] }) })
          },
          int.id.toString()
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsContent,
        {
          value: "competitors",
          className: "space-y-4",
          "data-ocid": "client.competitors.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-semibold text-foreground", children: [
                "Competitors (",
                competitors.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  "data-ocid": "client.competitor.add_button",
                  onClick: () => setAddCompetitorOpen(true),
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                    "Add"
                  ]
                }
              )
            ] }),
            competitors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              CardContent,
              {
                "data-ocid": "client.competitors.empty_state",
                className: "py-12 text-center text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { size: 36, className: "mx-auto mb-2 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Koi competitor add nahi kiya" })
                ]
              }
            ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: competitors.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `client.competitor.item.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: c.companyName }),
                    c.product && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      "Product: ",
                      c.product
                    ] }),
                    c.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 italic", children: c.notes }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                      "Added: ",
                      c.dateAdded
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-destructive hover:text-destructive shrink-0",
                      onClick: () => removeCompetitor(c.id),
                      "data-ocid": `client.competitor.delete_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                    }
                  )
                ] }) })
              },
              c.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addCompetitorOpen, onOpenChange: setAddCompetitorOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DialogContent,
              {
                className: "max-w-sm",
                "data-ocid": "client.competitor.add.dialog",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Competitor Add Karein" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Company Name *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          placeholder: "Competitor company name",
                          value: competitorForm.companyName,
                          onChange: (e) => setCompetitorForm((p) => ({
                            ...p,
                            companyName: e.target.value
                          })),
                          "data-ocid": "client.competitor.company.input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Product / Category" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          placeholder: "Kaunsa product/category",
                          value: competitorForm.product,
                          onChange: (e) => setCompetitorForm((p) => ({
                            ...p,
                            product: e.target.value
                          })),
                          "data-ocid": "client.competitor.product.input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Textarea,
                        {
                          placeholder: "Additional notes...",
                          rows: 2,
                          value: competitorForm.notes,
                          onChange: (e) => setCompetitorForm((p) => ({
                            ...p,
                            notes: e.target.value
                          })),
                          "data-ocid": "client.competitor.notes.textarea"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => setAddCompetitorOpen(false),
                        "data-ocid": "client.competitor.add.cancel_button",
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: handleAddCompetitor,
                        "data-ocid": "client.competitor.add.submit_button",
                        children: "Add"
                      }
                    )
                  ] })
                ]
              }
            ) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "client.edit.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit Client" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEditSave, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "client.edit.name.input",
                value: editForm.name ?? "",
                onChange: (e) => setEditForm((p) => ({ ...p, name: e.target.value })),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Company *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "client.edit.company.input",
                value: editForm.company ?? "",
                onChange: (e) => setEditForm((p) => ({ ...p, company: e.target.value })),
                required: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "client.edit.phone.input",
                value: editForm.phone ?? "",
                onChange: (e) => setEditForm((p) => ({ ...p, phone: e.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "client.edit.email.input",
                type: "email",
                value: editForm.email ?? "",
                onChange: (e) => setEditForm((p) => ({ ...p, email: e.target.value }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "client.edit.address.input",
              value: editForm.address ?? "",
              onChange: (e) => setEditForm((p) => ({ ...p, address: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              "data-ocid": "client.edit.notes.textarea",
              value: editForm.notes ?? "",
              onChange: (e) => setEditForm((p) => ({ ...p, notes: e.target.value })),
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
              "data-ocid": "client.edit.cancel_button",
              onClick: () => setEditOpen(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              "data-ocid": "client.edit.save_button",
              disabled: updateClient.isPending,
              children: [
                updateClient.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                "Save Changes"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addInteractionOpen, onOpenChange: setAddInteractionOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "interaction.add.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add Interaction" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddInteraction, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: intForm.type,
                onValueChange: (v) => setIntForm((p) => ({ ...p, type: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "interaction.type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inquiry", children: "Inquiry" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "offer", children: "Offer" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "order", children: "Order" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "followup", children: "Follow-up" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: intForm.status,
                onValueChange: (v) => setIntForm((p) => ({ ...p, status: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "interaction.status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "open", children: "Open" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inProgress", children: "In Progress" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "closed", children: "Closed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "won", children: "Won" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "lost", children: "Lost" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "interaction.title.input",
              value: intForm.title,
              onChange: (e) => setIntForm((p) => ({ ...p, title: e.target.value })),
              placeholder: "e.g. Initial inquiry for pumps",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              "data-ocid": "interaction.description.textarea",
              value: intForm.description,
              onChange: (e) => setIntForm((p) => ({ ...p, description: e.target.value })),
              rows: 3,
              placeholder: "Details..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "interaction.date.input",
                type: "date",
                value: intForm.date,
                onChange: (e) => setIntForm((p) => ({ ...p, date: e.target.value })),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "interaction.amount.input",
                type: "number",
                min: "0",
                value: intForm.amount,
                onChange: (e) => setIntForm((p) => ({ ...p, amount: e.target.value })),
                placeholder: "0"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              "data-ocid": "interaction.add.cancel_button",
              onClick: () => setAddInteractionOpen(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              "data-ocid": "interaction.add.save_button",
              disabled: createInteraction.isPending,
              children: [
                createInteraction.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                "Add Interaction"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: addContactOpen,
        onOpenChange: (o) => {
          setAddContactOpen(o);
          if (!o) setContactForm(emptyContactForm);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "contact.add.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add Contact Person" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddContact, className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "contact.name.input",
                  value: contactForm.name,
                  onChange: (e) => setContactForm((p) => ({ ...p, name: e.target.value })),
                  placeholder: "Full name",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Department *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.department.input",
                    value: contactForm.department,
                    onChange: (e) => setContactForm((p) => ({
                      ...p,
                      department: e.target.value
                    })),
                    placeholder: "e.g. Purchase, Maintenance",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Designation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.designation.input",
                    value: contactForm.designation,
                    onChange: (e) => setContactForm((p) => ({
                      ...p,
                      designation: e.target.value
                    })),
                    placeholder: "e.g. Manager"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Seniority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: contactForm.seniority || "none",
                  onValueChange: (v) => setContactForm((p) => ({
                    ...p,
                    seniority: v === "none" ? "" : v
                  })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "contact.seniority.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select seniority" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Select seniority —" }),
                      SENIORITY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt, children: opt }, opt))
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.phone.input",
                    value: contactForm.phone,
                    onChange: (e) => setContactForm((p) => ({ ...p, phone: e.target.value })),
                    placeholder: "Mobile number",
                    inputMode: "numeric"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.email.input",
                    type: "email",
                    value: contactForm.email,
                    onChange: (e) => setContactForm((p) => ({ ...p, email: e.target.value })),
                    placeholder: "email@company.com"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  "data-ocid": "contact.add.cancel_button",
                  onClick: () => {
                    setAddContactOpen(false);
                    setContactForm(emptyContactForm);
                  },
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  "data-ocid": "contact.add.save_button",
                  disabled: isSavingContact,
                  children: [
                    isSavingContact ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                    "Add Contact"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editContact !== null,
        onOpenChange: (o) => {
          if (!o) {
            setEditContact(null);
            setContactForm(emptyContactForm);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "contact.edit.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit Contact Person" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEditContactSave, className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "contact.edit.name.input",
                  value: contactForm.name,
                  onChange: (e) => setContactForm((p) => ({ ...p, name: e.target.value })),
                  placeholder: "Full name",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Department *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.edit.department.input",
                    value: contactForm.department,
                    onChange: (e) => setContactForm((p) => ({
                      ...p,
                      department: e.target.value
                    })),
                    placeholder: "e.g. Purchase, Maintenance",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Designation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.edit.designation.input",
                    value: contactForm.designation,
                    onChange: (e) => setContactForm((p) => ({
                      ...p,
                      designation: e.target.value
                    })),
                    placeholder: "e.g. Manager"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Seniority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: contactForm.seniority || "none",
                  onValueChange: (v) => setContactForm((p) => ({
                    ...p,
                    seniority: v === "none" ? "" : v
                  })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "contact.edit.seniority.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select seniority" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Select seniority —" }),
                      SENIORITY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt, children: opt }, opt))
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.edit.phone.input",
                    value: contactForm.phone,
                    onChange: (e) => setContactForm((p) => ({ ...p, phone: e.target.value })),
                    placeholder: "Mobile number",
                    inputMode: "numeric"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "contact.edit.email.input",
                    type: "email",
                    value: contactForm.email,
                    onChange: (e) => setContactForm((p) => ({ ...p, email: e.target.value })),
                    placeholder: "email@company.com"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  "data-ocid": "contact.edit.cancel_button",
                  onClick: () => {
                    setEditContact(null);
                    setContactForm(emptyContactForm);
                  },
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  "data-ocid": "contact.edit.save_button",
                  disabled: isSavingContact,
                  children: [
                    isSavingContact ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                    "Save Changes"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: phoneImportOpen,
        onOpenChange: (o) => {
          if (!o) {
            setPhoneImportOpen(false);
            setStagedPhoneContacts([]);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-lg max-h-[80vh] overflow-y-auto",
            "data-ocid": "contact.phone_import.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Import from Phone Contacts" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Set department and seniority for each contact before importing." }),
                stagedPhoneContacts.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border border-border rounded-lg p-3 space-y-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: c.name || "—" }),
                        c.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.phone }),
                        c.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.email })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Department *" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              "data-ocid": `contact.phone_import.department.input.${idx + 1}`,
                              value: c.department,
                              onChange: (e) => setStagedPhoneContacts(
                                (prev) => prev.map(
                                  (p) => p.tempId === c.tempId ? { ...p, department: e.target.value } : p
                                )
                              ),
                              placeholder: "e.g. Purchase"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Seniority" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Select,
                            {
                              value: c.seniority || "none",
                              onValueChange: (v) => setStagedPhoneContacts(
                                (prev) => prev.map(
                                  (p) => p.tempId === c.tempId ? { ...p, seniority: v === "none" ? "" : v } : p
                                )
                              ),
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectTrigger,
                                  {
                                    "data-ocid": `contact.phone_import.seniority.select.${idx + 1}`,
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" })
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Select —" }),
                                  SENIORITY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt, children: opt }, opt))
                                ] })
                              ]
                            }
                          )
                        ] })
                      ] })
                    ]
                  },
                  c.tempId
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "contact.phone_import.cancel_button",
                    onClick: () => {
                      setPhoneImportOpen(false);
                      setStagedPhoneContacts([]);
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "contact.phone_import.confirm_button",
                    onClick: handlePhoneImportConfirm,
                    disabled: isSavingContact,
                    children: [
                      isSavingContact ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                      "Import ",
                      stagedPhoneContacts.length,
                      " Contact",
                      stagedPhoneContacts.length !== 1 ? "s" : ""
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteContactId !== null,
        onOpenChange: (o) => !o && setDeleteContactId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "contact.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove Contact" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to remove this contact person? This cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "contact.delete.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                "data-ocid": "contact.delete.confirm_button",
                onClick: handleDeleteContact,
                className: "bg-destructive hover:bg-destructive/90",
                disabled: isSavingContact,
                children: [
                  isSavingContact ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                  "Remove"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  ClientDetailPage as default
};
