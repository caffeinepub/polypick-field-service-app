import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("✓ Back online - Data synced");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white text-center text-sm font-medium py-1.5 px-4"
      data-ocid="offline.error_state"
    >
      ⚠️ Offline Mode — Data saves locally
    </div>
  );
}
