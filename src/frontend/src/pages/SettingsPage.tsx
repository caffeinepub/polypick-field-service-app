import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Download,
  Info,
  LogOut,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { exportAoACSV } from "../utils/exportUtils";

interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  gstin: string;
}

interface NotifPrefs {
  tada: boolean;
  visit: boolean;
  ppi: boolean;
}

const defaultCompany: CompanySettings = {
  name: "",
  address: "",
  phone: "",
  gstin: "",
};
const defaultNotif: NotifPrefs = { tada: true, visit: true, ppi: true };

export default function SettingsPage() {
  const { clear } = useInternetIdentity();

  const [company, setCompany] = useState<CompanySettings>(defaultCompany);
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [notif, setNotif] = useState<NotifPrefs>(defaultNotif);

  useEffect(() => {
    const saved = localStorage.getItem("polypick_company_settings");
    if (saved) setCompany(JSON.parse(saved));
    setIsDark(document.documentElement.classList.contains("dark"));
    const savedLang = localStorage.getItem("polypick_lang") as
      | "en"
      | "hi"
      | null;
    if (savedLang) setLang(savedLang);
    const savedNotif = localStorage.getItem("polypick_notif_prefs");
    if (savedNotif) setNotif(JSON.parse(savedNotif));
  }, []);

  function saveCompany() {
    localStorage.setItem("polypick_company_settings", JSON.stringify(company));
    toast.success("Company profile saved!");
  }

  function toggleDark(val: boolean) {
    setIsDark(val);
    if (val) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("polypick_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("polypick_theme", "light");
    }
    toast.success(`${val ? "Dark" : "Light"} mode enabled`);
  }

  function toggleLang(val: "en" | "hi") {
    setLang(val);
    localStorage.setItem("polypick_lang", val);
    toast.success(`Language: ${val === "en" ? "English" : "Hindi"}`);
  }

  function saveNotif(key: keyof NotifPrefs, val: boolean) {
    const updated = { ...notif, [key]: val };
    setNotif(updated);
    localStorage.setItem("polypick_notif_prefs", JSON.stringify(updated));
  }

  function exportAllData() {
    const date = new Date().toISOString().split("T")[0];
    exportAoACSV(
      [
        ["Polypick Engineers - Data Export"],
        ["Exported on", new Date().toLocaleString()],
        [],
        ["Company Name", company.name],
        ["Address", company.address],
        ["Phone", company.phone],
        ["GSTIN", company.gstin],
      ],
      `Polypick_Data_Export_${date}.csv`,
    );
    toast.success("Data exported successfully!");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your app preferences
          </p>
        </div>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            Company Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              data-ocid="settings.company_name.input"
              placeholder="Polypick Engineers Pvt Ltd"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company-address">Address</Label>
            <Input
              id="company-address"
              data-ocid="settings.company_address.input"
              placeholder="City, State"
              value={company.address}
              onChange={(e) =>
                setCompany({ ...company, address: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company-phone">Phone</Label>
              <Input
                id="company-phone"
                data-ocid="settings.company_phone.input"
                placeholder="+91 XXXXX XXXXX"
                value={company.phone}
                onChange={(e) =>
                  setCompany({ ...company, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company-gstin">GSTIN</Label>
              <Input
                id="company-gstin"
                data-ocid="settings.company_gstin.input"
                placeholder="27AAAAA0000A1Z5"
                value={company.gstin}
                onChange={(e) =>
                  setCompany({ ...company, gstin: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            data-ocid="settings.company.save_button"
            onClick={saveCompany}
            className="w-full"
          >
            Save Company Profile
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {isDark ? (
              <Moon size={16} className="text-primary" />
            ) : (
              <Sun size={16} className="text-primary" />
            )}
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Switch
              data-ocid="settings.dark_mode.switch"
              checked={isDark}
              onCheckedChange={toggleDark}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-xs text-muted-foreground">
                Choose app language
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="settings.lang_en.toggle"
                onClick={() => toggleLang("en")}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary"
                }`}
              >
                English
              </button>
              <button
                type="button"
                data-ocid="settings.lang_hi.toggle"
                onClick={() => toggleLang("hi")}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  lang === "hi"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary"
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "tada" as const,
              label: "TA DA Alerts",
              desc: "Pending claim reminders",
            },
            {
              key: "visit" as const,
              label: "Visit Reminders",
              desc: "Daily visit plan alerts",
            },
            {
              key: "ppi" as const,
              label: "PPI Inactivity Alerts",
              desc: "15+ days no update",
            },
          ].map((item, idx) => (
            <div key={item.key}>
              {idx > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  data-ocid={`settings.notif_${item.key}.switch`}
                  checked={notif[item.key]}
                  onCheckedChange={(val) => saveNotif(item.key, val)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Download size={16} className="text-primary" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Export all your app data as a CSV file for backup or reporting.
          </p>
          <Button
            data-ocid="settings.export.button"
            variant="outline"
            onClick={exportAllData}
            className="w-full gap-2"
          >
            <Download size={16} />
            Export All Data as CSV
          </Button>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            data-ocid="settings.signout.button"
            variant="destructive"
            onClick={clear}
            className="w-full gap-2"
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info size={16} className="text-primary" />
            App Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">32.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium">March 2026</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium">Polypick Field Service</span>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground pb-4">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
