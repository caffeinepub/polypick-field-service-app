import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { BarChart3, Loader2, Shield, Wrench } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/" });
    }
  }, [identity, navigate]);

  const features = [
    { icon: <Wrench size={16} />, label: "Field Service Tracking" },
    { icon: <BarChart3 size={16} />, label: "Marketing Reports" },
    { icon: <Shield size={16} />, label: "TA DA Billing" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel – branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.22 0.055 265), oklch(0.18 0.045 275))",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/polypick-logo-transparent.dim_120x120.png"
            alt="Polypick Engineers"
            className="h-12 w-12 rounded bg-white p-1"
          />
          <div>
            <p className="font-display text-lg font-bold text-white leading-tight">
              Polypick Engineers
            </p>
            <p className="text-white/60 text-xs">Private Limited</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white leading-tight">
              Field Service
              <br />
              Management
            </h1>
            <p className="mt-4 text-white/70 text-lg leading-relaxed max-w-sm">
              Track clients, plan visits, manage TA DA claims, and monitor your
              team's performance — all in one place.
            </p>
          </div>
          <div className="space-y-3">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 text-white/80"
              >
                <span className="text-amber-400">{f.icon}</span>
                <span className="text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} Polypick Engineers Pvt Ltd
        </p>
      </div>

      {/* Right panel – login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3">
            <img
              src="/assets/generated/polypick-logo-transparent.dim_120x120.png"
              alt="Polypick Engineers"
              className="h-10 w-10 rounded bg-white p-0.5 shadow"
            />
            <div>
              <p className="font-display text-base font-bold text-foreground leading-tight">
                Polypick Engineers
              </p>
              <p className="text-muted-foreground text-xs">Private Limited</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Sign in to your field service account
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full font-semibold"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              data-ocid="login.primary_button"
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secure, decentralized authentication via{" "}
              <span className="font-medium text-foreground">
                Internet Identity
              </span>
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Access limited to authorized Polypick Engineers staff
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
