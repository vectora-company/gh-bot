import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { App } from "./App";
import { SectionPage } from "./pages/SectionPage";

const rootRoute = createRootRoute({ component: Outlet });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const sectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$section",
  component: SectionPage,
});

const routeTree = rootRoute.addChildren([indexRoute, sectionRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
