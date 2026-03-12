import { Skeleton } from "@/components/ui/skeleton";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import RootLayout from "./layouts/RootLayout";

import DashboardPage from "./pages/DashboardPage";
// Eagerly loaded (always needed on first render)
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";

// Lazily loaded — only fetched when navigated to
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const ClientDetailPage = lazy(() => import("./pages/ClientDetailPage"));
const InteractionsPage = lazy(() => import("./pages/InteractionsPage"));
const TaDaPage = lazy(() => import("./pages/TaDaPage"));
const VisitsPage = lazy(() => import("./pages/VisitsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const MarketingReportPage = lazy(() => import("./pages/MarketingReportPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const DailyReportPage = lazy(() => import("./pages/DailyReportPage"));
const AssistantPage = lazy(() => import("./pages/AssistantPage"));
const ServiceTicketsPage = lazy(() => import("./pages/ServiceTicketsPage"));
const TargetsPage = lazy(() => import("./pages/TargetsPage"));
const ActivityTrackerPage = lazy(() => import("./pages/ActivityTrackerPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LinerInstallationPage = lazy(
  () => import("./pages/LinerInstallationPage"),
);
const StaffLocationPage = lazy(() => import("./pages/StaffLocationPage"));
const WeeklyReportPage = lazy(() => import("./pages/WeeklyReportPage"));

function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return function SuspenseWrapped() {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    );
  };
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile-setup",
  component: ProfileSetupPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: RootLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: DashboardPage,
});

const clientsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/clients",
  component: withSuspense(ClientsPage),
});

const clientDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/clients/$id",
  component: withSuspense(ClientDetailPage),
});

const interactionsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/interactions",
  component: withSuspense(InteractionsPage),
});

const tadaRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/tada",
  component: withSuspense(TaDaPage),
});

const visitsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/visits",
  component: withSuspense(VisitsPage),
});

const reportsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reports",
  component: withSuspense(ReportsPage),
});

const staffRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/staff",
  component: withSuspense(StaffPage),
});

const marketingReportRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/marketing-report",
  component: withSuspense(MarketingReportPage),
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: withSuspense(ProfilePage),
});

const dailyReportRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/daily-report",
  component: withSuspense(DailyReportPage),
});

const assistantRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/assistant",
  component: withSuspense(AssistantPage),
});

const serviceTicketsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/service-tickets",
  component: withSuspense(ServiceTicketsPage),
});

const targetsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/targets",
  component: withSuspense(TargetsPage),
});

const activityTrackerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/activity-tracker",
  component: withSuspense(ActivityTrackerPage),
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  component: withSuspense(SettingsPage),
});

const linerInstallationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/liner-installation",
  component: withSuspense(LinerInstallationPage),
});

const staffLocationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/location-tracker",
  component: withSuspense(StaffLocationPage),
});

const weeklyReportRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/weekly-report",
  component: withSuspense(WeeklyReportPage),
});

export const routeTree = rootRoute.addChildren([
  loginRoute,
  profileSetupRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    clientsRoute,
    clientDetailRoute,
    interactionsRoute,
    tadaRoute,
    visitsRoute,
    reportsRoute,
    staffRoute,
    marketingReportRoute,
    profileRoute,
    dailyReportRoute,
    assistantRoute,
    serviceTicketsRoute,
    targetsRoute,
    activityTrackerRoute,
    settingsRoute,
    linerInstallationRoute,
    staffLocationRoute,
    weeklyReportRoute,
  ]),
]);
