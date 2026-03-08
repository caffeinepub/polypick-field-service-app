import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout";
import ClientDetailPage from "./pages/ClientDetailPage";
import ClientsPage from "./pages/ClientsPage";
import DailyReportPage from "./pages/DailyReportPage";
import DashboardPage from "./pages/DashboardPage";
import InteractionsPage from "./pages/InteractionsPage";
import LoginPage from "./pages/LoginPage";
import MarketingReportPage from "./pages/MarketingReportPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ReportsPage from "./pages/ReportsPage";
import StaffPage from "./pages/StaffPage";
import TaDaPage from "./pages/TaDaPage";
import VisitsPage from "./pages/VisitsPage";

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
  component: ClientsPage,
});

const clientDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/clients/$id",
  component: ClientDetailPage,
});

const interactionsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/interactions",
  component: InteractionsPage,
});

const tadaRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/tada",
  component: TaDaPage,
});

const visitsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/visits",
  component: VisitsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reports",
  component: ReportsPage,
});

const staffRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/staff",
  component: StaffPage,
});

const marketingReportRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/marketing-report",
  component: MarketingReportPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const dailyReportRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/daily-report",
  component: DailyReportPage,
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
  ]),
]);
