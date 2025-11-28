import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen text-foreground relative z-10">
      <Outlet />
    </div>
  );
}
