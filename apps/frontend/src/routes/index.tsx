import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { createShorten, type CreateShortenResponse } from "../lib/api";

export const Route = createFileRoute("/")({
  component: CreatePage,
});

function CreatePage() {
  const [url, setUrl] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<string>("");
  const [result, setResult] = useState<CreateShortenResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createShorten,
    onSuccess: (data) => {
      setResult(data);
      setUrl("");
      setExpiresInDays("");
      queryClient.invalidateQueries({ queryKey: ["short-codes"] });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    mutation.mutate({
      url,
      expires_in_days: expiresInDays ? Number(expiresInDays) : null,
    });
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium mb-4 border border-violet-500/20">
          <Sparkles className="size-3" />
          Fast & Reliable
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Shorten your links
        </h1>
        <p className="text-zinc-400 text-lg">
          Paste a long URL and get a short, shareable link instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/your/very/long/url..."
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-850 px-5 py-4 text-zinc-100 placeholder-zinc-500 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="number"
              min="1"
              max="365"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              placeholder="Expiration (days) — optional"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-850 pl-11 pr-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !url}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {mutation.isPending ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Shorten
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {mutation.isError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {mutation.error.message}
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-850 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Your short URL
            </span>
            {result.expires_at && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="size-3" />
                Expires{" "}
                {new Date(result.expires_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={result.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2 text-violet-400 hover:text-violet-300 text-lg font-mono font-medium truncate transition-colors"
            >
              {result.short_url}
              <ExternalLink className="size-3.5 shrink-0" />
            </a>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-700 hover:text-zinc-100 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
