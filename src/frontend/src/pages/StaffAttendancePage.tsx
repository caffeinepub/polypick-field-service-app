import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, Download, Plus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type AttendanceStatus = "Present" | "Absent" | "Half Day" | "WFH" | "On Leave";

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

interface AttendanceRecord {
  date: string;
  staffId: string;
  status: AttendanceStatus;
}

const STORAGE_KEY_STAFF = "polypick_attendance_staff";
const STORAGE_KEY_RECORDS = "polypick_attendance_records";

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  "Half Day": "bg-amber-100 text-amber-700",
  WFH: "bg-blue-100 text-blue-700",
  "On Leave": "bg-purple-100 text-purple-700",
};

const STATUS_SHORT: Record<AttendanceStatus, string> = {
  Present: "P",
  Absent: "A",
  "Half Day": "H",
  WFH: "W",
  "On Leave": "L",
};

function loadStaff(): StaffMember[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_STAFF) ?? "[]");
  } catch {
    return [];
  }
}

function loadRecords(): AttendanceRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) ?? "[]");
  } catch {
    return [];
  }
}

export default function StaffAttendancePage() {
  const [staff, setStaff] = useState<StaffMember[]>(loadStaff);
  const [records, setRecords] = useState<AttendanceRecord[]>(loadRecords);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [monthView, setMonthView] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const persistStaff = useCallback((updated: StaffMember[]) => {
    setStaff(updated);
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));
  }, []);

  const persistRecords = useCallback((updated: AttendanceRecord[]) => {
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
  }, []);

  const addStaff = () => {
    if (!newName.trim()) {
      toast.error("Name required");
      return;
    }
    persistStaff([
      ...staff,
      { id: Date.now().toString(), name: newName.trim(), role: newRole.trim() },
    ]);
    setNewName("");
    setNewRole("");
    toast.success("Staff member added");
  };

  const removeStaff = (id: string) => {
    persistStaff(staff.filter((s) => s.id !== id));
    persistRecords(records.filter((r) => r.staffId !== id));
  };

  const getRecord = (staffId: string, date: string): AttendanceStatus | "" => {
    return (
      records.find((r) => r.staffId === staffId && r.date === date)?.status ??
      ""
    );
  };

  const setRecord = (
    staffId: string,
    date: string,
    status: AttendanceStatus,
  ) => {
    const existing = records.findIndex(
      (r) => r.staffId === staffId && r.date === date,
    );
    let updated: AttendanceRecord[];
    if (existing >= 0) {
      updated = records.map((r, i) => (i === existing ? { ...r, status } : r));
    } else {
      updated = [...records, { staffId, date, status }];
    }
    persistRecords(updated);
  };

  const saveDay = () => {
    toast.success(`Attendance saved for ${selectedDate}`);
  };

  // Monthly view: days in selected month
  const monthDays = useMemo(() => {
    const [year, month] = monthView.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      return `${monthView}-${String(d).padStart(2, "0")}`;
    });
  }, [monthView]);

  const exportCSV = () => {
    const [year, month] = monthView.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const header = ["Staff", "Role", ...days.map((d) => String(d))].join(",");
    const rows = staff.map((s) => {
      const cells = days.map((d) => {
        const date = `${monthView}-${String(d).padStart(2, "0")}`;
        const rec = getRecord(s.id, date);
        return rec ? STATUS_SHORT[rec as AttendanceStatus] : "";
      });
      return [s.name, s.role, ...cells].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${monthView}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Staff Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Daily attendance track karein
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {staff.length} Staff
        </Badge>
      </div>

      <Tabs defaultValue="daily">
        <TabsList data-ocid="attendance.tab">
          <TabsTrigger value="daily">Daily Entry</TabsTrigger>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          <TabsTrigger value="manage">Manage Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-3">
          <div className="flex items-center gap-3">
            <div>
              <Label>Date</Label>
              <Input
                data-ocid="attendance.input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button
              data-ocid="attendance.save_button"
              onClick={saveDay}
              className="mt-5"
            >
              Save
            </Button>
          </div>

          {staff.length === 0 ? (
            <Card data-ocid="attendance.empty_state">
              <CardContent className="py-8 text-center">
                <CalendarCheck
                  size={32}
                  className="mx-auto mb-3 text-muted-foreground/40"
                />
                <p className="text-muted-foreground">
                  Pehle "Manage Staff" tab mein staff members add karein.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {staff.map((s, idx) => (
                <Card key={s.id} data-ocid={`attendance.row.${idx + 1}`}>
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{s.name}</p>
                      {s.role && (
                        <p className="text-xs text-muted-foreground">
                          {s.role}
                        </p>
                      )}
                    </div>
                    <Select
                      value={getRecord(s.id, selectedDate) || ""}
                      onValueChange={(v) =>
                        setRecord(s.id, selectedDate, v as AttendanceStatus)
                      }
                    >
                      <SelectTrigger
                        data-ocid={`attendance.select.${idx + 1}`}
                        className="w-36"
                      >
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          [
                            "Present",
                            "Absent",
                            "Half Day",
                            "WFH",
                            "On Leave",
                          ] as const
                        ).map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <Label>Month</Label>
              <Input
                type="month"
                value={monthView}
                onChange={(e) => setMonthView(e.target.value)}
                className="w-40"
              />
            </div>
            <Button
              data-ocid="attendance.primary_button"
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={exportCSV}
            >
              <Download size={14} className="mr-1" /> Export CSV
            </Button>
          </div>

          {staff.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No staff members yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left font-semibold sticky left-0 bg-muted">
                      Staff
                    </th>
                    {monthDays.map((d) => (
                      <th key={d} className="p-1 text-center font-medium w-8">
                        {d.split("-")[2]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s.id} className="border-b border-border">
                      <td className="p-2 font-medium sticky left-0 bg-background">
                        {s.name}
                      </td>
                      {monthDays.map((date) => {
                        const status = getRecord(s.id, date) as
                          | AttendanceStatus
                          | "";
                        return (
                          <td key={date} className="p-1 text-center">
                            {status ? (
                              <span
                                className={`inline-block w-6 h-6 rounded text-[10px] font-bold leading-6 ${
                                  STATUS_COLORS[status]
                                }`}
                              >
                                {STATUS_SHORT[status]}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Add Staff Member</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  data-ocid="attendance.input"
                  placeholder="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="Role (e.g. Fitter)"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
                <Button
                  data-ocid="attendance.primary_button"
                  onClick={addStaff}
                  className="flex-shrink-0"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {staff.map((s, idx) => (
              <Card key={s.id} data-ocid={`attendance.item.${idx + 1}`}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    {s.role && (
                      <p className="text-xs text-muted-foreground">{s.role}</p>
                    )}
                  </div>
                  <Button
                    data-ocid={`attendance.delete_button.${idx + 1}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeStaff(s.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
