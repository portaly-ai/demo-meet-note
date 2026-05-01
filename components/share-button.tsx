"use client";

import { useState } from "react";

export function ShareButton({
  noteId,
  shareToken,
  canShare,
}: {
  noteId: string;
  shareToken: string | null;
  canShare: boolean;
}) {
  const [token, setToken] = useState<string | null>(shareToken);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!canShare) {
    return (
      <a
        href="/pricing"
        className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-300"
      >
        Upgrade to share
      </a>
    );
  }

  async function generate() {
    setBusy(true);
    const res = await fetch(`/api/notes/${noteId}/share`, { method: "POST" });
    setBusy(false);
    if (res.ok) {
      const { token: t } = (await res.json()) as { token: string };
      setToken(t);
    }
  }

  async function copy() {
    if (!token) return;
    await navigator.clipboard.writeText(`${window.location.origin}/share/${token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (token) {
    return (
      <button
        onClick={copy}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-400"
      >
        {copied ? "Link copied ✓" : "Copy share link"}
      </button>
    );
  }
  return (
    <button
      onClick={generate}
      disabled={busy}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-400 disabled:opacity-50"
    >
      {busy ? "Generating..." : "Create share link"}
    </button>
  );
}
