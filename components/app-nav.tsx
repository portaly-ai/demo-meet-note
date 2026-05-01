import Link from "next/link";
import { UserMenu } from "./user-menu";

export function AppNav({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-7">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 text-[13px] font-black text-white">
              M
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
              MeetNote
            </span>
          </Link>
          <div className="hidden items-center gap-5 text-[14px] md:flex">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/notes">Notes</NavLink>
            <NavLink href="/settings">Settings</NavLink>
          </div>
        </div>
        <UserMenu email={email} />
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-zinc-600 transition hover:text-zinc-900"
    >
      {children}
    </Link>
  );
}
