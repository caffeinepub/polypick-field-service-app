import { b as useInternetIdentity, br as useUserProfile, ae as useIsAdmin, bn as useAssignRole, r as reactExports, bs as useDarkMode, bt as getProfilePhoto, bu as compressImage, bv as saveProfilePhoto, z as ue, j as jsxRuntimeExports, o as User, C as Card, l as CardContent, bw as Avatar, bx as AvatarImage, by as AvatarFallback, am as Camera, bp as Shield, i as CardHeader, k as CardTitle, bz as Briefcase, B as Button, L as Label, bA as LogOut, bq as Principal } from "./index-DbjPUQDs.js";
import { M as Moon, S as Switch, I as Info } from "./switch-DPd574ox.js";
import { U as UserRole } from "./backend.d-Ws4C8wFG.js";
import { C as CalendarDays } from "./calendar-days-C_UUvtag.js";
import { M as Mail } from "./mail-RM2vOHhT.js";
function ProfilePage() {
  var _a, _b;
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: isAdmin, refetch: refetchAdmin } = useIsAdmin();
  const assignRole = useAssignRole();
  const fileInputRef = reactExports.useRef(null);
  const { isDark, setIsDark } = useDarkMode();
  const principal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "";
  const [photoSrc, setPhotoSrc] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (principal) {
      setPhotoSrc(getProfilePhoto(principal));
    }
  }, [principal]);
  const handlePhotoChange = reactExports.useCallback(
    async (e) => {
      var _a2;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file || !principal) return;
      try {
        const compressed = await compressImage(file);
        saveProfilePhoto(principal, compressed);
        setPhotoSrc(compressed);
        ue.success("Profile photo updated!");
      } catch {
        ue.error("Could not process the photo. Please try another image.");
      }
      e.target.value = "";
    },
    [principal]
  );
  const handleClaimAdmin = async () => {
    if (!principal) return;
    try {
      await assignRole.mutateAsync({
        user: Principal.fromText(principal),
        role: UserRole.admin
      });
      await refetchAdmin();
      localStorage.setItem("polypick_is_admin", "true");
      ue.success("Admin access granted! Please refresh the page.");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      ue.error("Admin access claim failed. Contact system administrator.");
    }
  };
  const createdAt = (profile == null ? void 0 : profile.createdAt) ? new Date(Number(profile.createdAt / 1000000n)).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  ) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in pb-20 md:pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 24, className: "text-primary" }),
        "My Profile"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Your account information" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-16 w-16", children: [
          photoSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(
            AvatarImage,
            {
              src: photoSrc,
              alt: (profile == null ? void 0 : profile.name) ?? "Profile",
              className: "object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-2xl font-bold bg-primary/10 text-primary", children: ((_b = (_a = profile == null ? void 0 : profile.name) == null ? void 0 : _a.charAt(0)) == null ? void 0 : _b.toUpperCase()) ?? "U" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Change profile photo",
            "data-ocid": "profile.upload_button",
            onClick: () => {
              var _a2;
              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
            },
            className: "absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 11, className: "text-primary-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handlePhotoChange
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: (profile == null ? void 0 : profile.name) ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 13 }),
          isAdmin ? "Administrator" : "Field Staff"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Tap camera icon to change photo" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Account Details" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16, className: "text-blue-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: (profile == null ? void 0 : profile.name) ?? "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-emerald-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16, className: "text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: isAdmin ? "Administrator" : "Field Staff" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 16, className: "text-amber-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Member Since" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: createdAt })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "text-purple-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Principal ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground break-all", children: principal ? `${principal.slice(0, 20)}…` : "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 16, className: "text-slate-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Organisation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Polypick Engineers Pvt Ltd" })
          ] })
        ] })
      ] })
    ] }),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-amber-200 bg-amber-50/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2 text-amber-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16, className: "text-amber-600" }),
        "Admin Access"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-700", children: "Agar aap is app ke Admin hain, to neeche button se Admin access le sakte hain." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "profile.claim_admin.button",
            onClick: handleClaimAdmin,
            disabled: assignRole.isPending,
            className: "w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16 }),
              assignRole.isPending ? "Processing..." : "Admin Access Lein"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Preferences" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-indigo-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 16, className: "text-indigo-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "dark-mode-switch",
                className: "text-sm font-medium text-foreground cursor-pointer",
                children: "Dark Mode"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Switch to dark theme" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "dark-mode-switch",
            "data-ocid": "profile.dark_mode.switch",
            checked: isDark,
            onCheckedChange: setIsDark
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive",
        onClick: clear,
        "data-ocid": "profile.signout_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }),
          "Sign Out"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 16, className: "text-muted-foreground" }),
        "App Information"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "App Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "v26.0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Last Updated" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "March 2026" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Platform" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Polypick Field Service" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with ❤️ using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "underline hover:text-foreground transition-colors",
          children: "caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  ProfilePage as default
};
