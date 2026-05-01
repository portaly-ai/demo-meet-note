import { Check, FileText, ListChecks, Users } from "lucide-react";

/**
 * Sample meeting note card mimicking the in-app finished output, used as the
 * hero visual. Soft greys + emerald accent only, kept understated.
 */
export function HeroMockup() {
  return (
    <div className="relative">
      {/* 極淡的灰底 glow，幾乎只是邊緣的柔光 */}
      <div
        aria-hidden
        className="absolute inset-x-8 -bottom-6 -top-6 rounded-3xl bg-zinc-200/40 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_40px_-16px_rgba(15,23,42,0.14)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/80 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="ml-3 truncate text-xs text-zinc-500">
            Product weekly · 2026/04/28
          </span>
        </div>

        <div className="px-6 py-6 md:px-8 md:py-8">
          <SubHeading icon={<FileText className="h-3.5 w-3.5" />}>Summary</SubHeading>
          <p className="mt-2 text-pretty text-[15px] leading-relaxed text-zinc-800">
            This week focused on the membership-system redesign, confirmed three UX changes, and set the next testing plan. Beta launches next Wednesday, with Kevin coordinating across teams.
          </p>

          <div className="mt-6">
            <SubHeading icon={<ListChecks className="h-3.5 w-3.5" />}>
              Action items
            </SubHeading>
          </div>
          <ul className="mt-3 space-y-2">
            <ActionItem owner="Anna" task="Finish signup-flow A/B design" due="04/30" />
            <ActionItem owner="Ryan" task="Connect payment webhook signature verification" due="05/02" />
            <ActionItem owner="Kevin" task="Schedule cross-team demo and collect feedback" due="05/05" />
          </ul>

          <div className="mt-6">
            <SubHeading icon={<Users className="h-3.5 w-3.5" />}>Participants</SubHeading>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Kevin", "Anna", "Ryan", "Mei"].map((p) => (
              <span
                key={p}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[12px] text-zinc-700"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
      {icon}
      {children}
    </div>
  );
}

function ActionItem({
  owner,
  task,
  due,
}: {
  owner: string;
  task: string;
  due: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-white px-3 py-2.5">
      <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-emerald-50 text-emerald-700">
        <Check className="h-3 w-3" />
      </span>
      <div className="min-w-0 flex-1 text-[13px]">
        <span className="font-semibold text-zinc-900">{owner}</span>
        <span className="ml-2 text-zinc-700">{task}</span>
      </div>
      <span className="flex-none whitespace-nowrap text-[11px] text-zinc-400">
        {due}
      </span>
    </li>
  );
}
