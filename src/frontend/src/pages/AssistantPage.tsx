import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  Bot,
  Cake,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  GitBranch,
  MapPin,
  PenLine,
  Plus,
  Receipt,
  Search,
  Star,
  Trash2,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAllClaims,
  useAllVisits,
  useIsAdmin,
  useMyClaims,
  useMyVisits,
  usePipelineStats,
  useUserProfile,
} from "../hooks/useQueries";

// ── Types ────────────────────────────────────────────────────────────────────
interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

interface FollowUp {
  id: string;
  client: string;
  dueDate: string;
  note: string;
  done: boolean;
}

interface Payment {
  id: string;
  clientName: string;
  invoiceNo: string;
  amount: number;
  dueDate: string;
  note: string;
  paid: boolean;
}

interface Birthday {
  id: string;
  name: string;
  date: string; // MM-DD
  type: "Birthday" | "Anniversary";
  note: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function nsToDate(ns: bigint): Date {
  return new Date(Number(ns / 1_000_000n));
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isThisMonth(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Suprabhat";
  if (h < 17) return "Namaskar";
  return "Shubh Sandhya";
}

function getTodayDisplay(): string {
  return new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ── Quick Commands Config ────────────────────────────────────────────────────
const QUICK_COMMANDS = [
  {
    label: "Visits",
    keywords: ["visit", "plan", "dora"],
    path: "/visits",
    icon: MapPin,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Clients",
    keywords: ["client", "customer", "grahak"],
    path: "/clients",
    icon: Users,
    color: "bg-green-100 text-green-700",
  },
  {
    label: "TA DA",
    keywords: ["tada", "ta da", "claim", "bill"],
    path: "/tada",
    icon: Receipt,
    color: "bg-amber-100 text-amber-700",
  },
  {
    label: "Daily Report",
    keywords: ["report", "daily", "riport"],
    path: "/daily-report",
    icon: FileText,
    color: "bg-purple-100 text-purple-700",
  },
  {
    label: "PPI Pipeline",
    keywords: ["ppi", "pipeline", "inquiry", "enquiry"],
    path: "/interactions",
    icon: GitBranch,
    color: "bg-rose-100 text-rose-700",
  },
  {
    label: "Staff",
    keywords: ["staff", "team", "members"],
    path: "/staff",
    icon: UserCheck,
    color: "bg-teal-100 text-teal-700",
    adminOnly: true,
  },
];

// ── LocalStorage hooks ───────────────────────────────────────────────────────
function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_todos") || "[]");
    } catch {
      return [];
    }
  });

  const save = (next: Todo[]) => {
    setTodos(next);
    localStorage.setItem("polypick_todos", JSON.stringify(next));
  };

  const add = (text: string) => {
    if (!text.trim()) return;
    save([
      ...todos,
      {
        id: Date.now().toString(),
        text: text.trim(),
        done: false,
        createdAt: Date.now(),
      },
    ]);
  };

  const toggle = (id: string) =>
    save(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => save(todos.filter((t) => t.id !== id));

  return { todos, add, toggle, remove };
}

function useNotes() {
  const [notes, setNotes] = useState<string>(
    () => localStorage.getItem("polypick_notes") || "",
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onChange = (val: string) => {
    setNotes(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem("polypick_notes", val);
    }, 500);
  };

  const clear = () => {
    setNotes("");
    localStorage.removeItem("polypick_notes");
    toast.success("Notes cleared");
  };

  return { notes, onChange, clear };
}

function useFollowUps() {
  const [followups, setFollowUps] = useState<FollowUp[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_followups") || "[]");
    } catch {
      return [];
    }
  });

  const save = (next: FollowUp[]) => {
    setFollowUps(next);
    localStorage.setItem("polypick_followups", JSON.stringify(next));
  };

  const add = (client: string, dueDate: string, note: string) => {
    if (!client.trim()) return;
    save([
      ...followups,
      {
        id: Date.now().toString(),
        client: client.trim(),
        dueDate,
        note: note.trim(),
        done: false,
      },
    ]);
  };

  const toggle = (id: string) =>
    save(followups.map((f) => (f.id === id ? { ...f, done: !f.done } : f)));
  const remove = (id: string) => save(followups.filter((f) => f.id !== id));

  return { followups, add, toggle, remove };
}

function usePayments() {
  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_payments") ?? "[]");
    } catch {
      return [];
    }
  });

  const save = (next: Payment[]) => {
    setPayments(next);
    localStorage.setItem("polypick_payments", JSON.stringify(next));
  };

  const add = (p: Omit<Payment, "id" | "paid">) => {
    save([...payments, { ...p, id: Date.now().toString(), paid: false }]);
  };

  const togglePaid = (id: string) =>
    save(payments.map((p) => (p.id === id ? { ...p, paid: !p.paid } : p)));
  const remove = (id: string) => save(payments.filter((p) => p.id !== id));

  return { payments, add, togglePaid, remove };
}

function useBirthdays() {
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_birthdays") ?? "[]");
    } catch {
      return [];
    }
  });

  const save = (next: Birthday[]) => {
    setBirthdays(next);
    localStorage.setItem("polypick_birthdays", JSON.stringify(next));
  };

  const add = (b: Omit<Birthday, "id">) => {
    save([...birthdays, { ...b, id: Date.now().toString() }]);
  };
  const remove = (id: string) => save(birthdays.filter((b) => b.id !== id));

  return { birthdays, add, remove };
}

function getDaysUntil(mmdd: string): number {
  const now = new Date();
  const [mm, dd] = mmdd.split("-").map(Number);
  let next = new Date(now.getFullYear(), mm - 1, dd);
  if (next < now) next = new Date(now.getFullYear() + 1, mm - 1, dd);
  return Math.round((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function isPaymentOverdue(dueDate: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AssistantPage() {
  const navigate = useNavigate();
  const { data: isAdmin } = useIsAdmin();
  const { data: profile } = useUserProfile();
  const { data: myVisits = [] } = useMyVisits();
  const { data: allVisits = [] } = useAllVisits(!!isAdmin);
  const { data: myClaims = [] } = useMyClaims();
  const { data: allClaims = [] } = useAllClaims(!!isAdmin);
  const { data: pipelineStats } = usePipelineStats();

  const visits = isAdmin ? allVisits : myVisits;
  const claims = isAdmin ? allClaims : myClaims;

  // Daily counts
  const todayVisits = useMemo(
    () =>
      visits.filter(
        (v) => isToday(nsToDate(v.plannedDate)) && v.status === "planned",
      ),
    [visits],
  );
  const pendingClaims = useMemo(
    () => claims.filter((c) => c.status === "pending"),
    [claims],
  );
  const monthVisits = useMemo(
    () => visits.filter((v) => isThisMonth(nsToDate(v.plannedDate))),
    [visits],
  );
  const monthClaims = useMemo(
    () => claims.filter((c) => isThisMonth(nsToDate(c.submittedAt))),
    [claims],
  );

  // Month-end reminder
  const isMonthEnd = useMemo(() => {
    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    return now.getDate() >= lastDay - 4;
  }, []);

  const inquiryCount = Number(pipelineStats?.inquiry ?? 0);

  // Birthdays for reminders (must be before reminders useMemo)
  const { birthdays: birthdaysForReminders } = useBirthdays();
  const upcomingBirthdays = useMemo(
    () =>
      birthdaysForReminders
        .filter((b) => getDaysUntil(b.date) <= 7)
        .sort((a, b_) => getDaysUntil(a.date) - getDaysUntil(b_.date)),
    [birthdaysForReminders],
  );

  // Smart reminders
  const reminders = useMemo(() => {
    const list: {
      id: string;
      text: string;
      path: string;
      icon: React.FC<any>;
      color: string;
    }[] = [];
    if (pendingClaims.length > 0) {
      list.push({
        id: "tada",
        text: `${pendingClaims.length} pending TA DA claim${pendingClaims.length > 1 ? "s" : ""} hain -- approve/submit karein`,
        path: "/tada",
        icon: Receipt,
        color: "text-amber-600 bg-amber-50 border-amber-200",
      });
    }
    if (todayVisits.length > 0) {
      list.push({
        id: "visits",
        text: `Aaj ${todayVisits.length} visit${todayVisits.length > 1 ? "s" : ""} planned hai${todayVisits.length > 1 ? "n" : ""} -- check-in karein`,
        path: "/visits",
        icon: MapPin,
        color: "text-blue-600 bg-blue-50 border-blue-200",
      });
    }
    if (inquiryCount > 5) {
      list.push({
        id: "pipeline",
        text: `Pipeline mein ${inquiryCount} inquiries hain -- follow-up karein`,
        path: "/interactions",
        icon: GitBranch,
        color: "text-rose-600 bg-rose-50 border-rose-200",
      });
    }
    if (isMonthEnd) {
      list.push({
        id: "monthend",
        text: "Monthly report submit karna mat bhulein -- mahina khatam hone wala hai",
        path: "/daily-report",
        icon: AlertCircle,
        color: "text-orange-600 bg-orange-50 border-orange-200",
      });
    }
    // Birthday/Anniversary alerts
    for (const b of upcomingBirthdays) {
      const days = getDaysUntil(b.date);
      const label = days === 0 ? "Aaj!" : `${days} din mein`;
      list.push({
        id: `birthday-${b.id}`,
        text: `${b.type}: ${b.name} — ${label}`,
        path: "/assistant",
        icon: Cake,
        color: "text-pink-600 bg-pink-50 border-pink-200",
      });
    }
    return list;
  }, [pendingClaims, todayVisits, inquiryCount, isMonthEnd, upcomingBirthdays]);

  // Quick commands
  const [query, setQuery] = useState("");
  const filteredCommands = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return QUICK_COMMANDS.filter((c) => !c.adminOnly || isAdmin);
    return QUICK_COMMANDS.filter(
      (c) =>
        (!c.adminOnly || isAdmin) &&
        (c.keywords.some((k) => k.includes(q)) ||
          c.label.toLowerCase().includes(q)),
    );
  }, [query, isAdmin]);

  // Payments
  const {
    payments,
    add: addPayment,
    togglePaid,
    remove: removePayment,
  } = usePayments();
  const [payForm, setPayForm] = useState({
    clientName: "",
    invoiceNo: "",
    amount: "",
    dueDate: "",
    note: "",
  });
  const handleAddPayment = useCallback(() => {
    if (!payForm.clientName.trim() || !payForm.amount) return;
    addPayment({
      clientName: payForm.clientName,
      invoiceNo: payForm.invoiceNo,
      amount: Number(payForm.amount),
      dueDate: payForm.dueDate,
      note: payForm.note,
    });
    setPayForm({
      clientName: "",
      invoiceNo: "",
      amount: "",
      dueDate: "",
      note: "",
    });
  }, [payForm, addPayment]);

  // Birthdays (hook already called above for reminders; reuse birthdaysForReminders)
  const birthdays = birthdaysForReminders;
  const { add: addBirthday, remove: removeBirthday } = useBirthdays();
  const [bdForm, setBdForm] = useState({
    name: "",
    date: "",
    type: "Birthday" as Birthday["type"],
    note: "",
  });
  const handleAddBirthday = useCallback(() => {
    if (!bdForm.name.trim() || !bdForm.date) return;
    addBirthday(bdForm);
    setBdForm({ name: "", date: "", type: "Birthday", note: "" });
  }, [bdForm, addBirthday]);

  // To-Do
  const {
    todos,
    add: addTodo,
    toggle: toggleTodo,
    remove: removeTodo,
  } = useTodos();
  const [todoInput, setTodoInput] = useState("");
  const handleAddTodo = useCallback(() => {
    addTodo(todoInput);
    setTodoInput("");
  }, [todoInput, addTodo]);

  // Notes
  const { notes, onChange: onNotesChange, clear: clearNotes } = useNotes();

  // Follow-ups
  const {
    followups,
    add: addFollowUp,
    toggle: toggleFollowUp,
    remove: removeFollowUp,
  } = useFollowUps();
  const [fuClient, setFuClient] = useState("");
  const [fuDate, setFuDate] = useState("");
  const [fuNote, setFuNote] = useState("");
  const handleAddFollowUp = useCallback(() => {
    if (!fuClient.trim()) return;
    addFollowUp(fuClient, fuDate, fuNote);
    setFuClient("");
    setFuDate("");
    setFuNote("");
  }, [fuClient, fuDate, fuNote, addFollowUp]);

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  const now = new Date();
  const monthName = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  const pipelineTotal = Number(
    (pipelineStats?.inquiry ?? 0n) +
      (pipelineStats?.offer ?? 0n) +
      (pipelineStats?.order ?? 0n) +
      (pipelineStats?.followup ?? 0n),
  );

  const VISIT_TARGET = 20;
  const CLAIM_TARGET = 10;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground leading-none">
              Polypick Assistant
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aapka smart sahayak
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Daily Briefing */}
        <Card
          className="border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-elevated"
          data-ocid="assistant.briefing.card"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">
                  {getTodayDisplay()}
                </p>
                <h2 className="text-xl font-display font-bold mt-1">
                  {getGreeting()}, {profile?.name?.split(" ")[0] ?? "Saathi"}!
                  🙏
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Aaj ka din productive banao
                </p>
              </div>
              <Star size={28} className="text-blue-200 shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/15 rounded-xl p-2.5 text-center">
                <p className="text-2xl font-bold">{todayVisits.length}</p>
                <p className="text-blue-100 text-[10px] font-medium leading-tight mt-0.5">
                  Aaj ki Visits
                </p>
              </div>
              <div className="bg-white/15 rounded-xl p-2.5 text-center">
                <p className="text-2xl font-bold">{pendingClaims.length}</p>
                <p className="text-blue-100 text-[10px] font-medium leading-tight mt-0.5">
                  Pending Claims
                </p>
              </div>
              <div className="bg-white/15 rounded-xl p-2.5 text-center">
                <p className="text-2xl font-bold">
                  {todos.filter((t) => !t.done).length}
                </p>
                <p className="text-blue-100 text-[10px] font-medium leading-tight mt-0.5">
                  To-Dos Baki
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Reminders */}
        {reminders.length > 0 && (
          <div data-ocid="assistant.reminders.section">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={15} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Smart Reminders
              </h3>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {reminders.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {reminders.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.id}
                    data-ocid={`assistant.reminder.item.${i + 1}`}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${r.color}`}
                  >
                    <Icon size={16} className="shrink-0 mt-0.5" />
                    <p className="text-sm flex-1 leading-snug">{r.text}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs shrink-0"
                      onClick={() => navigate({ to: r.path })}
                      data-ocid={`assistant.reminder.button.${i + 1}`}
                    >
                      Jao <ChevronRight size={12} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Commands */}
        <div data-ocid="assistant.commands.section">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={15} className="text-yellow-500" />
            <h3 className="text-sm font-semibold text-foreground">
              Quick Commands
            </h3>
          </div>
          <div className="relative mb-3">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Type: 'visit', 'client', 'tada'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10"
              data-ocid="assistant.commands.search_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  type="button"
                  key={cmd.path}
                  onClick={() => navigate({ to: cmd.path })}
                  data-ocid={"assistant.commands.button"}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border border-border/50 ${cmd.color} hover:opacity-80 active:scale-[0.97] transition-all text-left`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="text-sm font-semibold">{cmd.label}</span>
                  <ChevronRight size={14} className="ml-auto opacity-50" />
                </button>
              );
            })}
          </div>
          {filteredCommands.length === 0 && (
            <p
              className="text-center text-muted-foreground text-sm py-4"
              data-ocid="assistant.commands.empty_state"
            >
              Koi command nahi mila. Try: visit, client, tada, report
            </p>
          )}
        </div>

        {/* Tabs: Todo / Notes / Follow-ups / Summary */}
        <Tabs defaultValue="todo" data-ocid="assistant.main.tab">
          <TabsList className="grid grid-cols-5 w-full h-auto">
            <TabsTrigger
              value="todo"
              className="text-xs py-2"
              data-ocid="assistant.todo.tab"
            >
              <ClipboardList size={13} className="mr-1" />
              To-Do
              {todos.filter((t) => !t.done).length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {todos.filter((t) => !t.done).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="text-xs py-2"
              data-ocid="assistant.notes.tab"
            >
              <PenLine size={13} className="mr-1" />
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="followup"
              className="text-xs py-2"
              data-ocid="assistant.followup.tab"
            >
              <Calendar size={13} className="mr-1" />
              Follow-up
              {followups.filter((f) => !f.done && isOverdue(f.dueDate)).length >
                0 && (
                <span className="ml-1 bg-destructive text-destructive-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {
                    followups.filter((f) => !f.done && isOverdue(f.dueDate))
                      .length
                  }
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="text-xs py-2"
              data-ocid="assistant.payment.tab"
            >
              <CreditCard size={13} className="mr-1" />
              Payment
              {payments.filter((p) => !p.paid && isPaymentOverdue(p.dueDate))
                .length > 0 && (
                <span className="ml-1 bg-destructive text-destructive-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {
                    payments.filter(
                      (p) => !p.paid && isPaymentOverdue(p.dueDate),
                    ).length
                  }
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="text-xs py-2"
              data-ocid="assistant.summary.tab"
            >
              <Star size={13} className="mr-1" />
              Summary
            </TabsTrigger>
          </TabsList>

          {/* To-Do Tab */}
          <TabsContent
            value="todo"
            className="mt-3"
            data-ocid="assistant.todo.panel"
          >
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList size={16} className="text-green-600" />
                  My To-Do List
                  <Badge variant="outline" className="ml-auto text-xs">
                    {todos.filter((t) => !t.done).length} baki
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Naya kaam likho..."
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                    className="flex-1 h-9 text-sm"
                    data-ocid="todo.input"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddTodo}
                    className="h-9"
                    data-ocid="todo.add_button"
                  >
                    + Add
                  </Button>
                </div>

                {todos.length === 0 && (
                  <p
                    className="text-center text-muted-foreground text-sm py-4"
                    data-ocid="todo.empty_state"
                  >
                    Koi kaam nahi -- abhi add karein! ✅
                  </p>
                )}

                <div className="space-y-1.5">
                  {todos.map((todo, idx) => (
                    <div
                      key={todo.id}
                      data-ocid={`todo.item.${idx + 1}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/50 hover:bg-muted/80 group"
                    >
                      <Checkbox
                        checked={todo.done}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        data-ocid={`todo.checkbox.${idx + 1}`}
                        className="shrink-0"
                      />
                      <span
                        className={`flex-1 text-sm leading-snug ${
                          todo.done
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTodo(todo.id)}
                        data-ocid={`todo.delete_button.${idx + 1}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent
            value="notes"
            className="mt-3"
            data-ocid="assistant.notes.panel"
          >
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <PenLine size={16} className="text-purple-600" />
                  Quick Notes
                  <span className="ml-auto text-xs text-muted-foreground font-normal">
                    {notes.length} characters
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                <Textarea
                  placeholder="Yahan apne notes likhein... (auto-save hoga)"
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  className="min-h-[160px] text-sm resize-none"
                  data-ocid="assistant.notes.textarea"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Auto-save on: 500ms delay
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearNotes}
                    className="h-7 text-xs text-destructive hover:text-destructive"
                    data-ocid="assistant.notes.delete_button"
                  >
                    <Trash2 size={12} className="mr-1" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Follow-up Tab */}
          <TabsContent
            value="followup"
            className="mt-3"
            data-ocid="assistant.followup.panel"
          >
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar size={16} className="text-orange-500" />
                  Follow-up Tracker
                  {followups.filter((f) => !f.done && isOverdue(f.dueDate))
                    .length > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto text-[10px]"
                    >
                      {
                        followups.filter((f) => !f.done && isOverdue(f.dueDate))
                          .length
                      }{" "}
                      overdue
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="space-y-2 p-3 bg-muted/40 rounded-xl">
                  <Input
                    placeholder="Client ka naam *"
                    value={fuClient}
                    onChange={(e) => setFuClient(e.target.value)}
                    className="h-9 text-sm"
                    data-ocid="assistant.followup.input"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={fuDate}
                      onChange={(e) => setFuDate(e.target.value)}
                      className="h-9 text-sm"
                      data-ocid="assistant.followup.select"
                    />
                    <Input
                      placeholder="Note (optional)"
                      value={fuNote}
                      onChange={(e) => setFuNote(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="w-full h-9"
                    onClick={handleAddFollowUp}
                    disabled={!fuClient.trim()}
                    data-ocid="assistant.followup.submit_button"
                  >
                    + Follow-up Add Karein
                  </Button>
                </div>

                {followups.length === 0 && (
                  <p
                    className="text-center text-muted-foreground text-sm py-4"
                    data-ocid="assistant.followup.empty_state"
                  >
                    Koi follow-up nahi -- client naam likhkar add karein
                  </p>
                )}

                <div className="space-y-2">
                  {followups.map((fu, idx) => {
                    const overdue = !fu.done && isOverdue(fu.dueDate);
                    return (
                      <div
                        key={fu.id}
                        data-ocid={`assistant.followup.item.${idx + 1}`}
                        className={`p-3 rounded-xl border group ${
                          overdue
                            ? "border-red-300 bg-red-50"
                            : fu.done
                              ? "border-green-200 bg-green-50/50"
                              : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => toggleFollowUp(fu.id)}
                            className="mt-0.5 shrink-0"
                            aria-label="Toggle done"
                            data-ocid={`assistant.followup.toggle.${idx + 1}`}
                          >
                            {fu.done ? (
                              <CheckCircle2
                                size={16}
                                className="text-green-600"
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${fu.done ? "line-through text-muted-foreground" : overdue ? "text-red-700" : "text-foreground"}`}
                            >
                              {fu.client}
                            </p>
                            {fu.dueDate && (
                              <p
                                className={`text-xs mt-0.5 ${overdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}
                              >
                                {overdue ? "⚠️ Overdue: " : "Due: "}
                                {new Date(fu.dueDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            )}
                            {fu.note && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {fu.note}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFollowUp(fu.id)}
                            data-ocid={`assistant.followup.delete_button.${idx + 1}`}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive shrink-0"
                            aria-label="Delete follow-up"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Follow-up Tab */}
          <TabsContent
            value="payment"
            className="mt-3"
            data-ocid="assistant.payment.panel"
          >
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CreditCard size={16} className="text-primary" />
                  Payment Follow-up Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {/* Add Payment Form */}
                <div className="bg-muted/40 rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Client naam"
                      value={payForm.clientName}
                      onChange={(e) =>
                        setPayForm((p) => ({
                          ...p,
                          clientName: e.target.value,
                        }))
                      }
                      className="h-8 text-xs"
                      data-ocid="payment.client.input"
                    />
                    <Input
                      placeholder="Invoice No."
                      value={payForm.invoiceNo}
                      onChange={(e) =>
                        setPayForm((p) => ({ ...p, invoiceNo: e.target.value }))
                      }
                      className="h-8 text-xs"
                      data-ocid="payment.invoice.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Amount (₹)"
                      value={payForm.amount}
                      onChange={(e) =>
                        setPayForm((p) => ({ ...p, amount: e.target.value }))
                      }
                      className="h-8 text-xs"
                      data-ocid="payment.amount.input"
                    />
                    <Input
                      type="date"
                      value={payForm.dueDate}
                      onChange={(e) =>
                        setPayForm((p) => ({ ...p, dueDate: e.target.value }))
                      }
                      className="h-8 text-xs"
                      data-ocid="payment.due_date.input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Note"
                      value={payForm.note}
                      onChange={(e) =>
                        setPayForm((p) => ({ ...p, note: e.target.value }))
                      }
                      className="h-8 text-xs flex-1"
                      data-ocid="payment.note.input"
                    />
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs gap-1"
                      onClick={handleAddPayment}
                      data-ocid="payment.add_button"
                    >
                      <Plus size={12} />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Payment List */}
                {payments.length === 0 ? (
                  <div
                    className="py-8 text-center text-muted-foreground text-sm"
                    data-ocid="payment.empty_state"
                  >
                    <CreditCard size={28} className="mx-auto mb-2 opacity-20" />
                    <p>Koi payment entry nahi hai</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payments.map((p, idx) => {
                      const overdue = !p.paid && isPaymentOverdue(p.dueDate);
                      return (
                        <div
                          key={p.id}
                          data-ocid={`payment.item.${idx + 1}`}
                          className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                            p.paid
                              ? "border-border bg-muted/30 opacity-60"
                              : overdue
                                ? "border-red-200 bg-red-50"
                                : "border-border bg-card"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => togglePaid(p.id)}
                            data-ocid={`payment.toggle.${idx + 1}`}
                            className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                              p.paid
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-muted-foreground"
                            }`}
                          >
                            {p.paid && <CheckCircle2 size={10} />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs">
                                {p.clientName}
                              </span>
                              {p.invoiceNo && (
                                <span className="text-xs text-muted-foreground">
                                  {p.invoiceNo}
                                </span>
                              )}
                              {overdue && (
                                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">
                                  Overdue
                                </span>
                              )}
                              {p.paid && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                                  Paid ✓
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="font-bold text-foreground">
                                ₹{p.amount.toLocaleString("en-IN")}
                              </span>
                              {p.dueDate && <span>Due: {p.dueDate}</span>}
                              {p.note && (
                                <span className="italic">{p.note}</span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePayment(p.id)}
                            data-ocid={`payment.delete_button.${idx + 1}`}
                            className="text-muted-foreground hover:text-destructive p-0.5 flex-shrink-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Summary Tab */}
          <TabsContent
            value="summary"
            className="mt-3"
            data-ocid="assistant.summary.panel"
          >
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  {monthName} -- Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-4">
                {/* Visits */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-blue-500" />
                      <span className="text-sm font-medium">
                        Visits this Month
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {monthVisits.length} / {VISIT_TARGET}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (monthVisits.length / VISIT_TARGET) * 100,
                      100,
                    )}
                    className="h-2"
                    data-ocid="assistant.summary.visits.progress"
                  />
                  <p className="text-xs text-muted-foreground">
                    Target: {VISIT_TARGET} visits --{" "}
                    {monthVisits.length >= VISIT_TARGET
                      ? "🎉 Target pura!"
                      : `${VISIT_TARGET - monthVisits.length} aur baaki`}
                  </p>
                </div>

                {/* Claims */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt size={14} className="text-amber-500" />
                      <span className="text-sm font-medium">TA DA Claims</span>
                    </div>
                    <span className="text-sm font-bold text-amber-600">
                      {monthClaims.length} / {CLAIM_TARGET}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (monthClaims.length / CLAIM_TARGET) * 100,
                      100,
                    )}
                    className="h-2 [&>div]:bg-amber-500"
                    data-ocid="assistant.summary.claims.progress"
                  />
                  <p className="text-xs text-muted-foreground">
                    Target: {CLAIM_TARGET} claims --{" "}
                    {monthClaims.length >= CLAIM_TARGET
                      ? "🎉 Target pura!"
                      : `${CLAIM_TARGET - monthClaims.length} aur baaki`}
                  </p>
                </div>

                {/* Pipeline */}
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} className="text-rose-500" />
                      <span className="text-sm font-medium">
                        PPI Pipeline Status
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Inquiry",
                        value: Number(pipelineStats?.inquiry ?? 0),
                        color: "text-blue-600 bg-blue-100",
                      },
                      {
                        label: "Offer",
                        value: Number(pipelineStats?.offer ?? 0),
                        color: "text-amber-600 bg-amber-100",
                      },
                      {
                        label: "Order",
                        value: Number(pipelineStats?.order ?? 0),
                        color: "text-green-600 bg-green-100",
                      },
                      {
                        label: "Follow-up",
                        value: Number(pipelineStats?.followup ?? 0),
                        color: "text-purple-600 bg-purple-100",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`rounded-lg px-3 py-2 ${stat.color}`}
                      >
                        <p className="text-lg font-bold">{stat.value}</p>
                        <p className="text-xs font-medium opacity-80">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Total:{" "}
                    <span className="font-semibold">{pipelineTotal}</span>{" "}
                    pipeline entries
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate({ to: "/reports" })}
                  data-ocid="assistant.summary.primary_button"
                >
                  <FileText size={14} className="mr-2" />
                  Puri Report Dekhein
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Birthday / Anniversary Reminders Manager */}
        <div className="mt-4" data-ocid="birthday.section">
          <div className="flex items-center gap-2 mb-3">
            <Cake size={15} className="text-pink-500" />
            <h3 className="text-sm font-semibold text-foreground">
              Birthday &amp; Anniversary Reminders
            </h3>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {birthdays.length}
            </Badge>
          </div>

          {/* Add Form */}
          <div className="bg-muted/40 rounded-xl p-3 space-y-2 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Naam"
                value={bdForm.name}
                onChange={(e) =>
                  setBdForm((p) => ({ ...p, name: e.target.value }))
                }
                className="h-8 text-xs"
                data-ocid="birthday.name.input"
              />
              <select
                value={bdForm.type}
                onChange={(e) =>
                  setBdForm((p) => ({
                    ...p,
                    type: e.target.value as Birthday["type"],
                  }))
                }
                className="h-8 text-xs rounded-md border border-input bg-background px-2"
                data-ocid="birthday.type.select"
              >
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-0.5">
                <p className="text-[10px] text-muted-foreground">
                  Date (MM-DD)
                </p>
                <Input
                  placeholder="MM-DD (e.g. 03-15)"
                  value={bdForm.date}
                  onChange={(e) =>
                    setBdForm((p) => ({ ...p, date: e.target.value }))
                  }
                  className="h-8 text-xs"
                  data-ocid="birthday.date.input"
                />
              </div>
              <Button
                size="sm"
                className="h-8 px-3 text-xs gap-1 self-end"
                onClick={handleAddBirthday}
                data-ocid="birthday.add_button"
              >
                <Plus size={12} />
                Add
              </Button>
            </div>
          </div>

          {/* Birthdays List */}
          {birthdays.length === 0 ? (
            <div
              className="py-6 text-center text-muted-foreground text-sm"
              data-ocid="birthday.empty_state"
            >
              <Cake size={24} className="mx-auto mb-1 opacity-20" />
              <p>Koi birthday/anniversary add nahi kiya</p>
            </div>
          ) : (
            <div className="space-y-2">
              {birthdays.map((b, idx) => {
                const days = getDaysUntil(b.date);
                const isToday0 = days === 0;
                return (
                  <div
                    key={b.id}
                    data-ocid={`birthday.item.${idx + 1}`}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm ${
                      isToday0
                        ? "border-pink-200 bg-pink-50"
                        : "border-border bg-card"
                    }`}
                  >
                    <Cake
                      size={16}
                      className={
                        isToday0 ? "text-pink-500" : "text-muted-foreground"
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs">{b.name}</span>
                        <Badge className="bg-pink-100 text-pink-700 border-0 text-[10px]">
                          {b.type}
                        </Badge>
                        {isToday0 && (
                          <Badge className="bg-pink-500 text-white border-0 text-[10px]">
                            Aaj! 🎉
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {b.date} {days > 0 ? `— ${days} din mein` : ""}
                        {b.note && ` — ${b.note}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBirthday(b.id)}
                      data-ocid={`birthday.delete_button.${idx + 1}`}
                      className="text-muted-foreground hover:text-destructive p-0.5 flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
