import { r as reactExports, j as jsxRuntimeExports, B as Button, n as Plus, L as Label, I as Input, C as Card, l as CardContent, M as MapPin, bB as ChevronUp, bC as ChevronDown, h as Badge, au as CircleCheck, z as ue } from "./index-DbjPUQDs.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-x_F93RN-.js";
import { T as Textarea } from "./textarea-k-DTS19z.js";
import { T as Trash2 } from "./trash-2-AM3OX5RE.js";
import "./index-CzBemFCv.js";
const STORAGE_KEY = "polypick_route_planner";
function loadStops() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveStops(stops) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
}
function RoutePlannerPage() {
  const [stops, setStops] = reactExports.useState(loadStops);
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({ clientName: "", address: "", notes: "" });
  const totalVisited = reactExports.useMemo(
    () => stops.filter((s) => s.visited).length,
    [stops]
  );
  const persist = reactExports.useCallback((updated) => {
    setStops(updated);
    saveStops(updated);
  }, []);
  const handleAdd = () => {
    if (!form.clientName.trim()) {
      ue.error("Client name required");
      return;
    }
    const newStop = {
      id: Date.now().toString(),
      clientName: form.clientName.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      visited: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    persist([...stops, newStop]);
    setForm({ clientName: "", address: "", notes: "" });
    setOpen(false);
    ue.success("Stop added");
  };
  const toggleVisited = (id) => {
    persist(
      stops.map((s) => s.id === id ? { ...s, visited: !s.visited } : s)
    );
  };
  const moveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...stops];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    persist(updated);
  };
  const moveDown = (idx) => {
    if (idx === stops.length - 1) return;
    const updated = [...stops];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    persist(updated);
  };
  const removeStop = (id) => {
    persist(stops.filter((s) => s.id !== id));
    ue.success("Stop removed");
  };
  const clearAll = () => {
    persist([]);
    ue.success("Route cleared");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-24 max-w-2xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Route Planner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Aaj ke client visits plan karein" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-ocid": "route.open_modal_button", size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-1" }),
          " Add Stop"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "route.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Route Stop" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client / Company Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "route.input",
                  value: form.clientName,
                  onChange: (e) => setForm((f) => ({ ...f, clientName: e.target.value })),
                  placeholder: "e.g. JSL Jajpur"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.address,
                  onChange: (e) => setForm((f) => ({ ...f, address: e.target.value })),
                  placeholder: "e.g. Jajpur, Odisha"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  "data-ocid": "route.textarea",
                  value: form.notes,
                  onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
                  placeholder: "Visit purpose, items to discuss...",
                  rows: 2
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "route.cancel_button",
                variant: "outline",
                onClick: () => setOpen(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { "data-ocid": "route.submit_button", onClick: handleAdd, children: "Add Stop" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: stops.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Stops" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-600", children: totalVisited }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Visited" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-amber-600", children: stops.length - totalVisited }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pending" })
      ] }) })
    ] }),
    stops.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "route.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MapPin,
        {
          size: 32,
          className: "mx-auto mb-3 text-muted-foreground/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: 'Koi stop nahi hai. "Add Stop" se shuru karein.' })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      stops.map((stop, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": `route.item.${idx + 1}`,
          className: stop.visited ? "opacity-60" : "",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-6 w-6",
                  onClick: () => moveUp(idx),
                  disabled: idx === 0,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-6 w-6",
                  onClick: () => moveDown(idx),
                  disabled: idx === stops.length - 1,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-muted-foreground", children: [
                  "#",
                  idx + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `font-semibold text-sm ${stop.visited ? "line-through text-muted-foreground" : "text-foreground"}`,
                    children: stop.clientName
                  }
                ),
                stop.visited && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-[10px] py-0 px-1.5 bg-green-100 text-green-700",
                    children: "Visited"
                  }
                )
              ] }),
              stop.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10, className: "text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: stop.address })
              ] }),
              stop.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 italic", children: stop.notes })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8",
                  onClick: () => toggleVisited(stop.id),
                  title: stop.visited ? "Mark pending" : "Mark visited",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleCheck,
                    {
                      size: 16,
                      className: stop.visited ? "text-green-600" : "text-muted-foreground"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `route.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-destructive hover:text-destructive",
                  onClick: () => removeStop(stop.id),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                }
              )
            ] })
          ] }) })
        },
        stop.id
      )),
      stops.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "route.delete_button",
          variant: "outline",
          size: "sm",
          className: "w-full text-destructive border-destructive/30 hover:bg-destructive/5",
          onClick: clearAll,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14, className: "mr-1" }),
            " Clear Entire Route"
          ]
        }
      )
    ] })
  ] });
}
export {
  RoutePlannerPage as default
};
