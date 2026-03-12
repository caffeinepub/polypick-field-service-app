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
import { ExternalLink, LogIn, LogOut, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LocationEntry {
  id: string;
  staffName: string;
  lat: number;
  lng: number;
  timestamp: string;
  notes: string;
  checkedOut: boolean;
  checkOutTime?: string;
}

const STORAGE_KEY = "polypick_locations";

function loadEntries(): LocationEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveEntries(entries: LocationEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StaffLocationPage() {
  const isAdmin = localStorage.getItem("polypick_is_admin") === "true";
  const staffName =
    localStorage.getItem("polypick_staff_name") ??
    localStorage.getItem("polypick_profile_name") ??
    "Staff";

  const [entries, setEntries] = useState<LocationEntry[]>(loadEntries);
  const [locating, setLocating] = useState(false);
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Active check-in for current user (not admin view)
  const activeEntry = entries.find(
    (e) => e.staffName === staffName && !e.checkedOut,
  );

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const handleCheckIn = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const entry: LocationEntry = {
          id: Date.now().toString(),
          staffName,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: new Date().toISOString(),
          notes: notes.trim(),
          checkedOut: false,
        };
        const updated = [...loadEntries(), entry];
        saveEntries(updated);
        setEntries(updated);
        setNotes("");
        setDialogOpen(false);
        setLocating(false);
        toast.success("Check-in successful!");
      },
      (err) => {
        setLocating(false);
        toast.error(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handleCheckOut = () => {
    if (!activeEntry) return;
    const updated = entries.map((e) =>
      e.id === activeEntry.id
        ? { ...e, checkedOut: true, checkOutTime: new Date().toISOString() }
        : e,
    );
    saveEntries(updated);
    setEntries(updated);
    toast.success("Checked out!");
  };

  // Group entries by date for admin view
  const grouped = entries.reduce(
    (acc, e) => {
      const date = new Date(e.timestamp).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(e);
      return acc;
    },
    {} as Record<string, LocationEntry[]>,
  );

  const myHistory = entries
    .filter((e) => e.staffName === staffName)
    .slice()
    .reverse();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
          <MapPin size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Location Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? "All Staff Check-ins" : "Your Check-in / Check-out"}
          </p>
        </div>
      </div>

      {/* Check In / Active Card */}
      {!isAdmin && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">
              {activeEntry ? "Currently Checked In" : "Not Checked In"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeEntry ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-green-500" />
                  <span className="font-medium">
                    {activeEntry.lat.toFixed(5)}, {activeEntry.lng.toFixed(5)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Since {formatDateTime(activeEntry.timestamp)}
                </div>
                {activeEntry.notes && (
                  <p className="text-sm text-muted-foreground">
                    {activeEntry.notes}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${activeEntry.lat},${activeEntry.lng}`,
                        "_blank",
                      )
                    }
                    data-ocid="location.view_map.button"
                  >
                    <ExternalLink size={13} className="mr-1.5" />
                    View Map
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCheckOut}
                    data-ocid="location.checkout.button"
                  >
                    <LogOut size={13} className="mr-1.5" />
                    Check Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Tap "Check In" to record your current location.
                </p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      data-ocid="location.checkin.open_modal_button"
                    >
                      <LogIn size={13} className="mr-1.5" />
                      Check In
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-ocid="location.checkin.dialog">
                    <DialogHeader>
                      <DialogTitle className="font-display">
                        Check In
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div className="space-y-1.5">
                        <Label>Notes (optional)</Label>
                        <Input
                          placeholder="Site name, purpose..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          data-ocid="location.checkin.input"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your current GPS location will be recorded.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleCheckIn}
                        disabled={locating}
                        data-ocid="location.checkin.submit_button"
                      >
                        {locating ? "Locating..." : "Check In Now"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Admin View */}
      {isAdmin ? (
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <Card>
              <CardContent
                className="py-12 text-center"
                data-ocid="location.empty_state"
              >
                <MapPin
                  size={32}
                  className="mx-auto mb-3 text-muted-foreground/40"
                />
                <p className="text-sm text-muted-foreground">
                  No check-ins recorded yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(grouped)
              .reverse()
              .map(([date, dayEntries]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {dayEntries.map((e, idx) => (
                      <Card key={e.id} data-ocid={`location.item.${idx + 1}`}>
                        <CardContent className="py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {e.staffName}
                                </span>
                                <Badge
                                  variant={
                                    e.checkedOut ? "secondary" : "default"
                                  }
                                  className="text-[10px] h-4"
                                >
                                  {e.checkedOut ? "Checked Out" : "Active"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                In: {formatDateTime(e.timestamp)}
                                {e.checkedOut &&
                                  e.checkOutTime &&
                                  ` · Out: ${formatDateTime(e.checkOutTime)}`}
                              </p>
                              {e.notes && (
                                <p className="text-xs text-muted-foreground">
                                  {e.notes}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() =>
                                window.open(
                                  `https://maps.google.com/?q=${e.lat},${e.lng}`,
                                  "_blank",
                                )
                              }
                              data-ocid={`location.map_button.${idx + 1}`}
                            >
                              <ExternalLink size={13} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      ) : (
        /* Staff history */
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Your History
          </h2>
          {myHistory.length === 0 ? (
            <Card>
              <CardContent
                className="py-10 text-center"
                data-ocid="location.empty_state"
              >
                <p className="text-sm text-muted-foreground">
                  No previous check-ins.
                </p>
              </CardContent>
            </Card>
          ) : (
            myHistory.map((e, idx) => (
              <Card key={e.id} data-ocid={`location.item.${idx + 1}`}>
                <CardContent className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={e.checkedOut ? "secondary" : "default"}
                          className="text-[10px] h-4"
                        >
                          {e.checkedOut ? "Checked Out" : "Active"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(e.timestamp)}
                        </span>
                      </div>
                      {e.checkedOut && e.checkOutTime && (
                        <p className="text-xs text-muted-foreground">
                          Out: {formatDateTime(e.checkOutTime)}
                        </p>
                      )}
                      {e.notes && (
                        <p className="text-xs text-muted-foreground">
                          {e.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${e.lat},${e.lng}`,
                          "_blank",
                        )
                      }
                      data-ocid={`location.map_button.${idx + 1}`}
                    >
                      <ExternalLink size={13} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
