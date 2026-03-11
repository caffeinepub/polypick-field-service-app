import { b as useInternetIdentity, aI as useUserProfile, a5 as useIsAdmin, r as reactExports, aJ as getProfilePhoto, aK as compressImage, aL as saveProfilePhoto, y as ue, j as jsxRuntimeExports, n as User, C as Card, l as CardContent, aM as Avatar, aN as AvatarImage, aO as AvatarFallback, ac as Camera, ay as Shield, i as CardHeader, k as CardTitle, aP as Briefcase, B as Button, aQ as LogOut } from "./index-DmVPSM7c.js";
import { C as CalendarDays } from "./calendar-days-B0r0Gbo0.js";
import { M as Mail } from "./mail-CBgFRV3E.js";
function ProfilePage() {
  var _a, _b;
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: isAdmin } = useIsAdmin();
  const fileInputRef = reactExports.useRef(null);
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
