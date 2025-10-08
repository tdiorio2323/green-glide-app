// src/routes.ts
import React from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import RoutesDebug from "./pages/RoutesDebug";

export type RouteItem = {
    path: string;
    component: React.ComponentType;
    label: string;
    private?: boolean
};

export const routes: RouteItem[] = [
    { path: "/", component: Index, label: "Landing (OTP)" },
    { path: "/dashboard", component: Dashboard, label: "Storefront", private: true },
    { path: "/_routes", component: RoutesDebug, label: "Routes Debug" },
    { path: "*", component: NotFound, label: "Not Found" },
];