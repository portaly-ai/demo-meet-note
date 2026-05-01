"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { getInsforge } from "@/lib/insforge/client";

export function UserMenu({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    try {
      await getInsforge().auth.signOut();
    } catch {
      /* ignore */
    }
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  const initial = (email[0] || "?").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-[13px] font-bold text-white transition hover:opacity-90"
        aria-label="User menu"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]">
          <div className="border-b border-zinc-100 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[12px] text-zinc-500">
              <User className="h-3.5 w-3.5" />
              Account
            </div>
            <div className="mt-0.5 truncate text-[13px] font-medium text-zinc-900">
              {email}
            </div>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-zinc-700 transition hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 border-t border-zinc-100 px-3 py-2.5 text-left text-[13px] text-zinc-700 transition hover:bg-zinc-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
