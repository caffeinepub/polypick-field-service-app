import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarCheck,
  FileText,
  GitBranch,
  LayoutDashboard,
  Receipt,
} from "lucide-react";

const BOTTOM_NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: LayoutDashboard,
    exact: true,
    ocid: "bottom_nav.dashboard.link",
  },
  {
    label: "PPI",
    href: "/interactions",
    icon: GitBranch,
    exact: false,
    ocid: "bottom_nav.interactions.link",
  },
  {
    label: "TA DA",
    href: "/tada",
    icon: Receipt,
    exact: false,
    ocid: "bottom_nav.tada.link",
  },
  {
    label: "Visits",
    href: "/visits",
    icon: CalendarCheck,
    exact: false,
    ocid: "bottom_nav.visits.link",
  },
  {
    label: "Report",
    href: "/daily-report",
    icon: FileText,
    exact: false,
    ocid: "bottom_nav.daily_report.link",
  },
];

export default function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (href: string, exact: boolean) => {
    if (exact) return currentPath === href;
    return currentPath.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-sidebar border-t border-sidebar-border"
      aria-label="Bottom navigation"
    >
      <div className="flex items-stretch h-16">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              data-ocid={item.ocid}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground/90",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                size={20}
                className={cn("transition-transform", active && "scale-110")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-safe-bottom bg-sidebar" />
    </nav>
  );
}
