import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  GitBranch,
  LayoutDashboard,
  Plus,
  Receipt,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

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
    label: "Assistant",
    href: "/assistant",
    icon: Bot,
    exact: false,
    ocid: "bottom_nav.assistant.link",
  },
];

export default function BottomNav() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const [fabOpen, setFabOpen] = useState(false);
  const currentPath = routerState.location.pathname;

  const isActive = (href: string, exact: boolean) => {
    if (exact) return currentPath === href;
    return currentPath.startsWith(href);
  };

  return (
    <>
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

      {/* FAB Overlay */}
      {fabOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={() => setFabOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setFabOpen(false)}
        />
      )}

      {/* FAB Menu */}
      {fabOpen && (
        <div
          className="fixed z-40 md:hidden flex flex-col gap-2 items-end"
          style={{ bottom: "84px", right: "16px" }}
        >
          {[
            {
              label: "Add Visit",
              href: "/visits",
              icon: <CalendarCheck size={16} />,
              ocid: "fab.visits.button",
            },
            {
              label: "Add PPI",
              href: "/interactions",
              icon: <GitBranch size={16} />,
              ocid: "fab.ppi.button",
            },
            {
              label: "Add Ticket",
              href: "/service-tickets",
              icon: <Ticket size={16} />,
              ocid: "fab.ticket.button",
            },
            {
              label: "Add Client",
              href: "/clients",
              icon: <Users size={16} />,
              ocid: "fab.client.button",
            },
          ].map((item) => (
            <button
              key={item.href}
              type="button"
              data-ocid={item.ocid}
              className="flex items-center gap-2 bg-background border border-border shadow-lg rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              onClick={() => {
                setFabOpen(false);
                navigate({ to: item.href });
              }}
            >
              {item.label}
              <span className="text-primary">{item.icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* FAB Button */}
      <button
        type="button"
        data-ocid="fab.open_modal_button"
        className="fixed z-40 md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
        style={{ bottom: "80px", right: "16px" }}
        onClick={() => setFabOpen((prev) => !prev)}
        aria-label="Quick actions"
      >
        {fabOpen ? <X size={22} /> : <Plus size={22} />}
      </button>
    </>
  );
}
