import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Receipt,
  TrendingUp,
  UserCog,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  ocid: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard size={18} />,
    ocid: "nav.dashboard.link",
  },
  {
    label: "Clients",
    href: "/clients",
    icon: <Users size={18} />,
    ocid: "nav.clients.link",
  },
  {
    label: "Interactions",
    href: "/interactions",
    icon: <MessageSquare size={18} />,
    ocid: "nav.interactions.link",
  },
  {
    label: "TA DA Claims",
    href: "/tada",
    icon: <Receipt size={18} />,
    ocid: "nav.tada.link",
  },
  {
    label: "Visit Planner",
    href: "/visits",
    icon: <CalendarCheck size={18} />,
    ocid: "nav.visits.link",
  },
  {
    label: "Marketing Report",
    href: "/marketing-report",
    icon: <TrendingUp size={18} />,
    ocid: "nav.marketing_report.link",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <BarChart3 size={18} />,
    adminOnly: true,
    ocid: "nav.reports.link",
  },
  {
    label: "Staff",
    href: "/staff",
    icon: <UserCog size={18} />,
    adminOnly: true,
    ocid: "nav.staff.link",
  },
];

interface SidebarProps {
  isAdmin: boolean;
}

export default function Sidebar({ isAdmin }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img
              src="/assets/generated/polypick-logo-transparent.dim_120x120.png"
              alt="Polypick Engineers"
              className="h-9 w-9 rounded-sm bg-white p-0.5"
            />
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold leading-tight text-sidebar-foreground truncate">
              Polypick Engineers
            </p>
            <p className="text-[10px] text-sidebar-foreground/60 truncate">
              Pvt Ltd
            </p>
          </div>
        </div>
      </div>

      {/* Role indicator */}
      <div className="px-4 py-2 border-b border-sidebar-border/50">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
          {isAdmin ? "Administrator" : "Field Staff"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            data-ocid={item.ocid}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "sidebar-nav-item w-full",
              isActive(item.href) && "active",
            )}
          >
            <span
              className={cn(
                "flex-shrink-0",
                isActive(item.href)
                  ? "text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70",
              )}
            >
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User + Logout */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-7 w-7 flex-shrink-0">
            <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-sidebar-foreground/80 truncate">
            {profile?.name ?? "User"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={clear}
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-sidebar text-sidebar-foreground shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
