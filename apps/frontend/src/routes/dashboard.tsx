import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MousePointerClick,
  Clock,
  ExternalLink,
  RefreshCw,
  Link2,
  AlertCircle,
  TrendingUp,
  Activity,
  WifiOff,
  ArrowRight,
} from "lucide-react";
import { listShortCodes, type ShortenEntry } from "../lib/api";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isExpired(entry: ShortenEntry) {
  if (!entry.expires_at) return false;
  return new Date(entry.expires_at) < new Date();
}

function StatusBadge({ entry }: { entry: ShortenEntry }) {
  if (isExpired(entry)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">
        Expired
      </span>
    );
  }
  if (!entry.expires_at) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
        Permanent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
      <Clock className="size-3" />
      {formatDate(entry.expires_at)}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4">
        <div className="h-4 w-20 rounded bg-zinc-800" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-48 rounded bg-zinc-800" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-20 rounded-full bg-zinc-800" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-10 rounded bg-zinc-800 ml-auto" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-28 rounded bg-zinc-800" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-28 rounded bg-zinc-800" />
      </td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-850 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="size-9 rounded-lg bg-zinc-800" />
        <div className="h-4 w-20 rounded bg-zinc-800" />
      </div>
      <div className="h-8 w-16 rounded bg-zinc-800 mb-1" />
      <div className="h-3 w-28 rounded bg-zinc-800" />
    </div>
  );
}

function ErrorFallback({
  error,
  onRetry,
  isRetrying,
}: {
  error: Error;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const isNetworkError =
    error.message.includes("Network Error") ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("ERR_CONNECTION_REFUSED");

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <div className="mx-auto mb-6 size-16 rounded-2xl bg-zinc-850 border border-zinc-800 flex items-center justify-center">
        {isNetworkError ? (
          <WifiOff className="size-7 text-zinc-500" />
        ) : (
          <AlertCircle className="size-7 text-red-400" />
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">
        {isNetworkError ? "Cannot reach the server" : "Something went wrong"}
      </h2>

      <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto">
        {isNetworkError
          ? "Make sure the backend is running on port 3000 in development mode."
          : error.message}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`size-3.5 ${isRetrying ? "animate-spin" : ""}`}
          />
          Try again
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-850 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-zinc-100"
        >
          Create a URL
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto mb-4 size-14 rounded-2xl bg-zinc-800/50 border border-zinc-800 flex items-center justify-center">
        <Link2 className="size-6 text-zinc-600" />
      </div>
      <p className="font-medium text-zinc-300 mb-1">No URLs yet</p>
      <p className="text-sm text-zinc-500 mb-6">
        Create your first short URL to see analytics here.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500"
      >
        Shorten a URL
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["short-codes"],
    queryFn: listShortCodes,
    retry: 1,
  });

  if (isError && !data) {
    return (
      <ErrorFallback
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const entries = data?.urls ?? [];
  const totalClicks = entries.reduce(
    (sum, e) => sum + (e.click_count ?? 0),
    0,
  );
  const activeCount = entries.filter((e) => !isExpired(e)).length;
  const expiredCount = entries.filter((e) => isExpired(e)).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Analytics overview for your shortened URLs
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-850 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="rounded-xl border border-zinc-800 bg-zinc-850 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Link2 className="size-4 text-violet-400" />
                </div>
                <span className="text-sm text-zinc-400">Total URLs</span>
              </div>
              <p className="text-3xl font-bold tabular-nums">
                {entries.length}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {activeCount} active · {expiredCount} expired
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-850 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="size-4 text-emerald-400" />
                </div>
                <span className="text-sm text-zinc-400">Total Clicks</span>
              </div>
              <p className="text-3xl font-bold tabular-nums">
                {totalClicks.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Across all shortened URLs
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-850 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Activity className="size-4 text-amber-400" />
                </div>
                <span className="text-sm text-zinc-400">Avg Clicks/URL</span>
              </div>
              <p className="text-3xl font-bold tabular-nums">
                {entries.length > 0
                  ? (totalClicks / entries.length).toFixed(1)
                  : "0"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Average across all URLs
              </p>
            </div>
          </>
        )}
      </div>

      {isError && data && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400 flex items-center gap-3 mb-6">
          <AlertCircle className="size-4 shrink-0" />
          Failed to refresh. Showing cached data.
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-850 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Short Code
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Destination
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Clicks
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Last Accessed
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr
                    key={entry.short_code}
                    className="group hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <a
                        href={`http://localhost:3000/${entry.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        {entry.short_code}
                        <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="px-5 py-4 max-w-[240px]">
                      <span className="block truncate text-zinc-300">
                        {entry.long_url}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge entry={entry} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="flex items-center justify-end gap-1.5 tabular-nums font-medium">
                        <MousePointerClick className="size-3.5 text-zinc-500" />
                        {(entry.click_count ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-xs">
                      {formatDate(entry.last_accessed_at)}
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-xs">
                      {formatDate(entry.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
