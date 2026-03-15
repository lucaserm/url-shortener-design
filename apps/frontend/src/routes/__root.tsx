import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Link2, BarChart3 } from "lucide-react";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800/60">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
              <Link2 className="size-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Shortener
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              activeProps={{ className: "bg-zinc-800 text-zinc-100" }}
              inactiveProps={{
                className:
                  "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create
            </Link>
            <Link
              to="/dashboard"
              activeProps={{ className: "bg-zinc-800 text-zinc-100" }}
              inactiveProps={{
                className:
                  "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <BarChart3 className="size-3.5" />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
