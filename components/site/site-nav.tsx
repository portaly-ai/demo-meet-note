import Link from "next/link";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            MeetNote
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/example"
            className="hidden text-zinc-600 transition hover:text-zinc-900 md:block"
          >
            Examples
          </Link>
          <Link
            href="/pricing"
            className="hidden text-zinc-600 transition hover:text-zinc-900 md:block"
          >
            Pricing
          </Link>
          <Link
            href="/sign-in"
            className="hidden text-zinc-600 transition hover:text-zinc-900 md:block"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 text-[13px] font-black text-white">
      M
    </span>
  );
}
