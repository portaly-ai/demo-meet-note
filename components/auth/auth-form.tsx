"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getInsforge } from "@/lib/insforge/client";

export type AuthMode = "sign-in" | "sign-up";

export function AuthForm({
  mode,
  redirectTo = "/dashboard",
}: {
  mode: AuthMode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const insforge = getInsforge();
      const { data, error } =
        mode === "sign-up"
          ? await insforge.auth.signUp({
              email: email.trim(),
              password,
              name: name.trim() || email.split("@")[0],
            })
          : await insforge.auth.signInWithPassword({
              email: email.trim(),
              password,
            });
      if (error) {
        setErr(error.message);
        setBusy(false);
        return;
      }
      if (!data?.accessToken) {
        setErr("Sign-in response is missing a token. Please try again.");
        setBusy(false);
        return;
      }

      // Store token in httpOnly cookie for server-side use
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: data.accessToken }),
      });
      if (!sessionRes.ok) {
        setErr("Could not save the session. Please try again.");
        setBusy(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {mode === "sign-up" && (
        <Field label="Display name (optional)">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={inputCls}
            placeholder="Kevin"
          />
        </Field>
      )}
      <Field label="Email">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={inputCls}
        />
      </Field>
      <Field label="Password" hint={mode === "sign-up" ? "At least 6 characters" : undefined}>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          className={inputCls}
        />
      </Field>

      {err && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {busy ? "Working..." : mode === "sign-up" ? "Create account" : "Sign in"}
        {!busy && (
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        )}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-zinc-700">{label}</span>
        {hint && <span className="text-[11px] text-zinc-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
