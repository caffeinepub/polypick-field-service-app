import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Principal } from "@icp-sdk/core/principal";
import {
  Briefcase,
  CalendarDays,
  Camera,
  Info,
  LogOut,
  Mail,
  Moon,
  Shield,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useDarkMode } from "../hooks/useDarkMode";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAssignRole, useIsAdmin, useUserProfile } from "../hooks/useQueries";
import {
  compressImage,
  getProfilePhoto,
  saveProfilePhoto,
} from "../utils/profilePhoto";

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: isAdmin, refetch: refetchAdmin } = useIsAdmin();
  const assignRole = useAssignRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark, setIsDark } = useDarkMode();

  const principal = identity?.getPrincipal().toString() ?? "";

  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (principal) {
      setPhotoSrc(getProfilePhoto(principal));
    }
  }, [principal]);

  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !principal) return;
      try {
        const compressed = await compressImage(file);
        saveProfilePhoto(principal, compressed);
        setPhotoSrc(compressed);
        toast.success("Profile photo updated!");
      } catch {
        toast.error("Could not process the photo. Please try another image.");
      }
      e.target.value = "";
    },
    [principal],
  );

  const handleClaimAdmin = async () => {
    if (!principal) return;
    try {
      await assignRole.mutateAsync({
        user: Principal.fromText(principal),
        role: UserRole.admin,
      });
      await refetchAdmin();
      localStorage.setItem("polypick_is_admin", "true");
      toast.success("Admin access granted! Please refresh the page.");
      // reload to update sidebar
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.error("Admin access claim failed. Contact system administrator.");
    }
  };

  const createdAt = profile?.createdAt
    ? new Date(Number(profile.createdAt / 1_000_000n)).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : "—";

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in pb-20 md:pb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <User size={24} className="text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Your account information
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {/* Avatar with edit overlay */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-16 w-16">
                {photoSrc && (
                  <AvatarImage
                    src={photoSrc}
                    alt={profile?.name ?? "Profile"}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              {/* Edit photo button */}
              <button
                type="button"
                aria-label="Change profile photo"
                data-ocid="profile.upload_button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
              >
                <Camera size={11} className="text-primary-foreground" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {profile?.name ?? "—"}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Shield size={13} />
                {isAdmin ? "Administrator" : "Field Staff"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tap camera icon to change photo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Full Name
              </p>
              <p className="text-sm font-medium text-foreground">
                {profile?.name ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Role</p>
              <p className="text-sm font-medium text-foreground">
                {isAdmin ? "Administrator" : "Field Staff"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0">
              <CalendarDays size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Member Since
              </p>
              <p className="text-sm font-medium text-foreground">{createdAt}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Principal ID
              </p>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {principal ? `${principal.slice(0, 20)}…` : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Briefcase size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Organisation
              </p>
              <p className="text-sm font-medium text-foreground">
                Polypick Engineers Pvt Ltd
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Access Claim -- shown only when not admin */}
      {!isAdmin && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2 text-amber-800">
              <Shield size={16} className="text-amber-600" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-amber-700">
              Agar aap is app ke Admin hain, to neeche button se Admin access le
              sakte hain.
            </p>
            <Button
              data-ocid="profile.claim_admin.button"
              onClick={handleClaimAdmin}
              disabled={assignRole.isPending}
              className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Shield size={16} />
              {assignRole.isPending ? "Processing..." : "Admin Access Lein"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Moon size={16} className="text-indigo-600" />
              </div>
              <div>
                <Label
                  htmlFor="dark-mode-switch"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Dark Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Switch to dark theme
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode-switch"
              data-ocid="profile.dark_mode.switch"
              checked={isDark}
              onCheckedChange={setIsDark}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
        onClick={clear}
        data-ocid="profile.signout_button"
      >
        <LogOut size={16} />
        Sign Out
      </Button>

      {/* App Version Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Info size={16} className="text-muted-foreground" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">App Version</span>
            <span className="font-medium text-foreground">v26.0</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium text-foreground">March 2026</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium text-foreground">
              Polypick Field Service
            </span>
          </div>
        </CardContent>
      </Card>

      <footer className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
