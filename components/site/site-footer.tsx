import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-zinc-500 md:flex-row md:items-center">
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded bg-zinc-900 text-[11px] font-black text-white">
            M
          </span>
          <span>© {new Date().getFullYear()} MeetNote AI</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/example" className="transition hover:text-zinc-900">
            Examples
          </Link>
          <Link href="/pricing" className="transition hover:text-zinc-900">
            Pricing
          </Link>
          <Link href="/changelog" className="transition hover:text-zinc-900">
            Changelog
          </Link>
          <Link href="/legal/privacy" className="transition hover:text-zinc-900">
            Privacy
          </Link>
          <Link href="/legal/terms" className="transition hover:text-zinc-900">
            Terms
          </Link>
          <Link href="/sign-in" className="transition hover:text-zinc-900">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
