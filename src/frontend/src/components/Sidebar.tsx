import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart2,
  BarChart3,
  CalendarCheck,
  FileBarChart2,
  FileText,
  GitBranch,
  HardHat,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  MapPin,
  Medal,
  Menu,
  Package,
  Receipt,
  Settings,
  Shield,
  Ticket,
  TrendingUp,
  Trophy,
  Truck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllClaims,
  useIsAdmin,
  useMyClaims,
  useUserProfile,
} from "../hooks/useQueries";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  ocid: string;
  badge?: number;
}

interface SidebarProps {
  isAdmin: boolean;
}

export default function Sidebar({ isAdmin }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: allClaims } = useAllClaims();
  const { data: myClaims } = useMyClaims();
  const { data: isAdminData } = useIsAdmin();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Pending claims badge for admin
  const pendingCount = isAdminData
    ? (allClaims ?? []).filter((c) => c.status === "pending").length
    : (myClaims ?? []).filter((c) => c.status === "pending").length;

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
      label: "PPI",
      href: "/interactions",
      icon: <GitBranch size={18} />,
      ocid: "nav.interactions.link",
    },
    {
      label: "TA DA Claims",
      href: "/tada",
      icon: <Receipt size={18} />,
      ocid: "nav.tada.link",
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      label: "Visit Planner",
      href: "/visits",
      icon: <CalendarCheck size={18} />,
      ocid: "nav.visits.link",
    },
    {
      label: "Route Planner",
      href: "/route-planner",
      icon: <MapIcon size={18} />,
      ocid: "nav.route_planner.link",
    },
    {
      label: "Daily Report",
      href: "/daily-report",
      icon: <FileText size={18} />,
      ocid: "nav.daily_report.link",
    },
    {
      label: "Marketing Report",
      href: "/marketing-report",
      icon: <TrendingUp size={18} />,
      ocid: "nav.marketing_report.link",
    },
    {
      label: "Liner Installation",
      href: "/liner-installation",
      icon: <HardHat size={18} />,
      ocid: "nav.liner_installation.link",
    },
    {
      label: "Service Tickets",
      href: "/service-tickets",
      icon: <Ticket size={18} />,
      ocid: "nav.service_tickets.link",
    },
    {
      label: "Targets",
      href: "/targets",
      icon: <Trophy size={18} />,
      ocid: "nav.targets.link",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: <Medal size={18} />,
      adminOnly: true,
      ocid: "nav.leaderboard.link",
    },
    {
      label: "Activity Tracker",
      href: "/activity-tracker",
      icon: <Activity size={18} />,
      ocid: "nav.activity_tracker.link",
    },
    {
      label: "Inventory",
      href: "/inventory",
      icon: <Package size={18} />,
      ocid: "nav.inventory.link",
    },
    {
      label: "Quotations",
      href: "/quotations",
      icon: <FileText size={18} />,
      ocid: "nav.quotations.link",
    },
    {
      label: "Dispatch",
      href: "/dispatch",
      icon: <Truck size={18} />,
      ocid: "nav.dispatch.link",
    },
    {
      label: "AMC Tracker",
      href: "/amc",
      icon: <Shield size={18} />,
      ocid: "nav.amc.link",
    },
    {
      label: "Location Tracker",
      href: "/location-tracker",
      icon: <MapPin size={18} />,
      adminOnly: true,
      ocid: "nav.location_tracker.link",
    },
    {
      label: "Attendance",
      href: "/attendance",
      icon: <CalendarCheck size={18} />,
      adminOnly: true,
      ocid: "nav.attendance.link",
    },
    {
      label: "Weekly Report",
      href: "/weekly-report",
      icon: <FileBarChart2 size={18} />,
      ocid: "nav.weekly_report.link",
    },
    {
      label: "Mgmt Report",
      href: "/mgmt-report",
      icon: <BarChart2 size={18} />,
      adminOnly: true,
      ocid: "nav.mgmt_report.link",
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
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings size={18} />,
      ocid: "nav.settings.link",
    },
  ];

  const localIsAdmin = localStorage.getItem("polypick_is_admin") === "true";
  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin || localIsAdmin,
  );

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
          {isAdmin || localIsAdmin ? "Administrator" : "Field Staff"}
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
            <span className="truncate flex-1">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex-shrink-0">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
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
        data-ocid="nav.mobile.toggle"
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
