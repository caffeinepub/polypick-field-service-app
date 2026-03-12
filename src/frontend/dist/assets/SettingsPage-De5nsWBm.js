import { c as createLucideIcon, b as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, b5 as Settings, C as Card, i as CardHeader, k as CardTitle, l as CardContent, L as Label, I as Input, B as Button, b6 as Separator, aX as LogOut, y as ue } from "./index-zYE3ieSM.js";
import { M as Moon, S as Switch, I as Info } from "./switch-BANbGJN-.js";
import { a as exportAoACSV } from "./exportUtils-DtpCHa8s.js";
import { B as Building2 } from "./building-2-DUcMh1hp.js";
import { D as Download } from "./download-BTjaIlUc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode);
const defaultCompany = {
  name: "",
  address: "",
  phone: "",
  gstin: ""
};
const defaultNotif = { tada: true, visit: true, ppi: true };
function SettingsPage() {
  const { clear } = useInternetIdentity();
  const [company, setCompany] = reactExports.useState(defaultCompany);
  const [isDark, setIsDark] = reactExports.useState(false);
  const [lang, setLang] = reactExports.useState("en");
  const [notif, setNotif] = reactExports.useState(defaultNotif);
  reactExports.useEffect(() => {
    const saved = localStorage.getItem("polypick_company_settings");
    if (saved) setCompany(JSON.parse(saved));
    setIsDark(document.documentElement.classList.contains("dark"));
    const savedLang = localStorage.getItem("polypick_lang");
    if (savedLang) setLang(savedLang);
    const savedNotif = localStorage.getItem("polypick_notif_prefs");
    if (savedNotif) setNotif(JSON.parse(savedNotif));
  }, []);
  function saveCompany() {
    localStorage.setItem("polypick_company_settings", JSON.stringify(company));
    ue.success("Company profile saved!");
  }
  function toggleDark(val) {
    setIsDark(val);
    if (val) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("polypick_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("polypick_theme", "light");
    }
    ue.success(`${val ? "Dark" : "Light"} mode enabled`);
  }
  function toggleLang(val) {
    setLang(val);
    localStorage.setItem("polypick_lang", val);
    ue.success(`Language: ${val === "en" ? "English" : "Hindi"}`);
  }
  function saveNotif(key, val) {
    const updated = { ...notif, [key]: val };
    setNotif(updated);
    localStorage.setItem("polypick_notif_prefs", JSON.stringify(updated));
  }
  function exportAllData() {
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    exportAoACSV(
      [
        ["Polypick Engineers - Data Export"],
        ["Exported on", (/* @__PURE__ */ new Date()).toLocaleString()],
        [],
        ["Company Name", company.name],
        ["Address", company.address],
        ["Phone", company.phone],
        ["GSTIN", company.gstin]
      ],
      `Polypick_Data_Export_${date}.csv`
    );
    ue.success("Data exported successfully!");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground", children: "Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage your app preferences" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16, className: "text-primary" }),
        "Company Profile"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company-name", children: "Company Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "company-name",
              "data-ocid": "settings.company_name.input",
              placeholder: "Polypick Engineers Pvt Ltd",
              value: company.name,
              onChange: (e) => setCompany({ ...company, name: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company-address", children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "company-address",
              "data-ocid": "settings.company_address.input",
              placeholder: "City, State",
              value: company.address,
              onChange: (e) => setCompany({ ...company, address: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company-phone", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "company-phone",
                "data-ocid": "settings.company_phone.input",
                placeholder: "+91 XXXXX XXXXX",
                value: company.phone,
                onChange: (e) => setCompany({ ...company, phone: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company-gstin", children: "GSTIN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "company-gstin",
                "data-ocid": "settings.company_gstin.input",
                placeholder: "27AAAAA0000A1Z5",
                value: company.gstin,
                onChange: (e) => setCompany({ ...company, gstin: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "settings.company.save_button",
            onClick: saveCompany,
            className: "w-full",
            children: "Save Company Profile"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
        isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 16, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 16, className: "text-primary" }),
        "App Preferences"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Dark Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Switch between light and dark theme" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              "data-ocid": "settings.dark_mode.switch",
              checked: isDark,
              onCheckedChange: toggleDark
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Language" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Choose app language" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "settings.lang_en.toggle",
                onClick: () => toggleLang("en"),
                className: `px-3 py-1 rounded-full text-xs font-medium border transition-colors ${lang === "en" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary"}`,
                children: "English"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "settings.lang_hi.toggle",
                onClick: () => toggleLang("hi"),
                className: `px-3 py-1 rounded-full text-xs font-medium border transition-colors ${lang === "hi" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary"}`,
                children: "हिंदी"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Notifications" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: [
        {
          key: "tada",
          label: "TA DA Alerts",
          desc: "Pending claim reminders"
        },
        {
          key: "visit",
          label: "Visit Reminders",
          desc: "Daily visit plan alerts"
        },
        {
          key: "ppi",
          label: "PPI Inactivity Alerts",
          desc: "15+ days no update"
        }
      ].map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        idx > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              "data-ocid": `settings.notif_${item.key}.switch`,
              checked: notif[item.key],
              onCheckedChange: (val) => saveNotif(item.key, val)
            }
          )
        ] })
      ] }, item.key)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16, className: "text-primary" }),
        "Data Export"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Export all your app data as a CSV file for backup or reporting." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "settings.export.button",
            variant: "outline",
            onClick: exportAllData,
            className: "w-full gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
              "Export All Data as CSV"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Account" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "settings.signout.button",
          variant: "destructive",
          onClick: clear,
          className: "w-full gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }),
            "Sign Out"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 16, className: "text-primary" }),
        "App Info"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "32.0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Last Updated" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "March 2026" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Platform" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Polypick Field Service" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground pb-4", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with love using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "underline",
          children: "caffeine.ai"
        }
      )
    ] })
  ] });
}
export {
  SettingsPage as default
};
