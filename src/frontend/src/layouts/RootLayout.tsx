import { Skeleton } from "@/components/ui/skeleton";
import { Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import { useActor } from "../hooks/useActor";
import { initDarkMode } from "../hooks/useDarkMode";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin, useUserProfile } from "../hooks/useQueries";

// Initialize dark mode immediately on module load
initDarkMode();

export default function RootLayout() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: isAdmin } = useIsAdmin();

  useEffect(() => {
    if (isInitializing || actorFetching) return;
    if (!identity) {
      navigate({ to: "/login" });
      return;
    }
    if (!profileLoading && profile === null) {
      navigate({ to: "/profile-setup" });
    }
  }, [
    identity,
    isInitializing,
    actorFetching,
    profile,
    profileLoading,
    navigate,
  ]);

  if (isInitializing || actorFetching || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <img
              src="/assets/generated/polypick-logo-transparent.dim_120x120.png"
              alt="Polypick Engineers"
              className="h-12 w-12"
            />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-48 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isAdmin={isAdmin ?? false} />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
