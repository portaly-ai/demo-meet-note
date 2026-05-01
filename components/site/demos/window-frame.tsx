/**
 * 共用「視窗外殼」— 三個 demo 統一視覺語言。
 */
export function WindowFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_40px_-16px_rgba(15,23,42,0.14)] ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/80 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="ml-3 truncate text-xs text-zinc-500">{title}</span>
      </div>
      {children}
    </div>
  );
}
