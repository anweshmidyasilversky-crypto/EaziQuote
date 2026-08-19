import { createElement } from "react";
import type { RouteObject } from "react-router";
import { DashboardLayout } from "../components/dashboard/dashboardLayout";
import { AuthGuard } from "../guards/authGuard";
import { Index } from "../pages/dashboard";

export const dashboardRoutes: RouteObject[] = [
  {
    element: createElement(AuthGuard),
    children: [
      {
        path: "/dashboard",
        element: createElement(DashboardLayout),
        children: [
          {
            index: true,
            Component: Index,
          },
        ],
      },
    ],
  },
];
