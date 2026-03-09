import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Camera, Loader2, Phone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";
import { compressImage, saveProfilePhoto } from "../utils/profilePhoto";

export default function ProfileSetupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("none");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading } = useUserProfile();
  const saveProfile = useSaveProfile();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setPhotoPreview(compressed);
    } catch {
      toast.error("Could not process the photo. Please try another image.");
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: "/login" });
    }
  }, [identity, isInitializing, navigate]);

  useEffect(() => {
    if (!isLoading && profile !== null) {
      navigate({ to: "/" });
    }
  }, [profile, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      // Backend only supports name field — store it normally
      // Phone & department are local-only UX fields (not persisted to backend)
      await saveProfile.mutateAsync({
        name: name.trim(),
        createdAt: BigInt(Date.now()) * 1_000_000n,
      });
      // Save photo to localStorage after profile is saved
      const principal = identity?.getPrincipal().toString() ?? "";
      if (photoPreview && principal) {
        saveProfilePhoto(principal, photoPreview);
      }
      toast.success("Profile saved! Welcome to Polypick Field Service.");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  if (isInitializing || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center">
          {/* Profile photo picker */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              aria-label="Upload profile photo"
              data-ocid="profile.upload_button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-20 w-20 rounded-full overflow-hidden ring-2 ring-border hover:ring-primary focus:outline-none focus:ring-primary transition-all group cursor-pointer"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                  <User size={32} className="text-primary" />
                </div>
              )}
              {/* Camera overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
              {/* Always-visible camera badge */}
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow">
                <Camera size={12} className="text-primary-foreground" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            Tap to add photo (optional)
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Set up your profile
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="name"
                data-ocid="profile.input"
                type="text"
                placeholder="e.g. Raju Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="relative">
              <Phone
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="phone"
                data-ocid="profile.phone.input"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">
              Department{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="relative">
              <Briefcase
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
              />
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger
                  id="department"
                  data-ocid="profile.department.select"
                  className="pl-9"
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Select department —</SelectItem>
                  <SelectItem value="Marketing">📊 Marketing</SelectItem>
                  <SelectItem value="Service">🔧 Service</SelectItem>
                  <SelectItem value="Admin">🏢 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Phone and department are shown here for reference only.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            data-ocid="profile.submit_button"
            disabled={saveProfile.isPending || !name.trim()}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue to Dashboard"
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Polypick Engineers Pvt Ltd — Field Service App
        </p>
      </div>
    </div>
  );
}
