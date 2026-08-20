import { createElement } from "react";
import type { RouteObject } from "react-router";
import { DashboardLayout } from "../components/dashboard/dashboardLayout";
import { AuthGuard } from "../guards/authGuard";
import { DashboardIndexPage } from "../pages/dashboard/DashboardIndexPage";
import { ClientIndexPage } from "../pages/clients/ClientIndexPage";

export const dashboardRoutes: RouteObject[] = [{}];
