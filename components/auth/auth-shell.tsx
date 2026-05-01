import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <Link href="/" className="mb-10 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 text-[13px] font-black text-white">
          M
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
          MeetNote
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-7 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.10)]">
        <h1 className="text-balance text-2xl font-black tracking-tight text-zinc-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-pretty text-[14px] text-zinc-600">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
      {footer && (
        <div className="mt-6 text-center text-[13px] text-zinc-600">{footer}</div>
      )}
    </main>
  );
}
