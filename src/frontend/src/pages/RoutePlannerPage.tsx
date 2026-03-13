import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface RouteStop {
  id: string;
  clientName: string;
  address: string;
  notes: string;
  visited: boolean;
  createdAt: string;
}

const STORAGE_KEY = "polypick_route_planner";

function loadStops(): RouteStop[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveStops(stops: RouteStop[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
}

export default function RoutePlannerPage() {
  const [stops, setStops] = useState<RouteStop[]>(loadStops);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ clientName: "", address: "", notes: "" });

  const totalVisited = useMemo(
    () => stops.filter((s) => s.visited).length,
    [stops],
  );

  const persist = useCallback((updated: RouteStop[]) => {
    setStops(updated);
    saveStops(updated);
  }, []);

  const handleAdd = () => {
    if (!form.clientName.trim()) {
      toast.error("Client name required");
      return;
    }
    const newStop: RouteStop = {
      id: Date.now().toString(),
      clientName: form.clientName.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      visited: false,
      createdAt: new Date().toISOString(),
    };
    persist([...stops, newStop]);
    setForm({ clientName: "", address: "", notes: "" });
    setOpen(false);
    toast.success("Stop added");
  };

  const toggleVisited = (id: string) => {
    persist(
      stops.map((s) => (s.id === id ? { ...s, visited: !s.visited } : s)),
    );
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...stops];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    persist(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === stops.length - 1) return;
    const updated = [...stops];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    persist(updated);
  };

  const removeStop = (id: string) => {
    persist(stops.filter((s) => s.id !== id));
    toast.success("Stop removed");
  };

  const clearAll = () => {
    persist([]);
    toast.success("Route cleared");
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Route Planner
          </h1>
          <p className="text-sm text-muted-foreground">
            Aaj ke client visits plan karein
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="route.open_modal_button" size="sm">
              <Plus size={16} className="mr-1" /> Add Stop
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="route.dialog">
            <DialogHeader>
              <DialogTitle>Add Route Stop</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Client / Company Name *</Label>
                <Input
                  data-ocid="route.input"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, clientName: e.target.value }))
                  }
                  placeholder="e.g. JSL Jajpur"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="e.g. Jajpur, Odisha"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  data-ocid="route.textarea"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Visit purpose, items to discuss..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="route.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button data-ocid="route.submit_button" onClick={handleAdd}>
                Add Stop
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{stops.length}</p>
            <p className="text-xs text-muted-foreground">Total Stops</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{totalVisited}</p>
            <p className="text-xs text-muted-foreground">Visited</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {stops.length - totalVisited}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Stops list */}
      {stops.length === 0 ? (
        <Card data-ocid="route.empty_state">
          <CardContent className="py-12 text-center">
            <MapPin
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-muted-foreground">
              Koi stop nahi hai. "Add Stop" se shuru karein.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {stops.map((stop, idx) => (
            <Card
              key={stop.id}
              data-ocid={`route.item.${idx + 1}`}
              className={stop.visited ? "opacity-60" : ""}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                    >
                      <ChevronUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveDown(idx)}
                      disabled={idx === stops.length - 1}
                    >
                      <ChevronDown size={14} />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        #{idx + 1}
                      </span>
                      <span
                        className={`font-semibold text-sm ${
                          stop.visited
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {stop.clientName}
                      </span>
                      {stop.visited && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] py-0 px-1.5 bg-green-100 text-green-700"
                        >
                          Visited
                        </Badge>
                      )}
                    </div>
                    {stop.address && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {stop.address}
                        </span>
                      </div>
                    )}
                    {stop.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {stop.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleVisited(stop.id)}
                      title={stop.visited ? "Mark pending" : "Mark visited"}
                    >
                      <CheckCircle2
                        size={16}
                        className={
                          stop.visited
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      />
                    </Button>
                    <Button
                      data-ocid={`route.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeStop(stop.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {stops.length > 0 && (
            <Button
              data-ocid="route.delete_button"
              variant="outline"
              size="sm"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={clearAll}
            >
              <Trash2 size={14} className="mr-1" /> Clear Entire Route
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
