import { createElement } from "react";
import type { RouteObject } from "react-router";
import { SideBar } from "../components/common/sidebar";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: createElement(SideBar),
    children: [],
  },
];
