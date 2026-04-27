import { createRootRoute, createRoute } from '@tanstack/react-router';
import { HomePage } from '@/pages/home';
import { RootLayout } from '@/shared/components/root-layout';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
