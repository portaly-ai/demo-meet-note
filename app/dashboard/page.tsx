import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { PLAN_LIMITS, planOf } from "@/lib/usage";
import { getOrCreateProfile } from "@/lib/profile";
import { getCurrentUser } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?redirect_url=/dashboard");

  const profile = await getOrCreateProfile({
    userId: user.id,
    email: user.email,
    displayName: user.name ?? null,
  });

  const plan = planOf(profile);
  const limits = PLAN_LIMITS[plan];
  const minutesUsed = profile.monthly_minutes_used;
  const summariesUsed = profile.monthly_summaries_used;
  const minutesPct =
    limits.minutesPerMonth === Infinity
      ? 0
      : Math.min(
          100,
          Math.round((minutesUsed / limits.minutesPerMonth) * 100),
        );
  const summariesPct =
    limits.summariesPerMonth === Infinity
      ? 0
      : Math.min(
          100,
          Math.round((summariesUsed / limits.summariesPerMonth) * 100),
        );

  return (
    <main className="min-h-screen bg-zinc-50/40">
      <AppNav email={user.email} />

      <div className="mx-auto max-w-6xl px-6 py-10">
        {sp.upgraded === "1" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
            <div>
              <div className="font-semibold">Upgrade successful — Pro is active</div>
              <div className="mt-0.5 text-emerald-800/80">
                You now have 600 minutes of transcription, unlimited
                summaries, and share links this month.
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
              Welcome,{" "}
              {profile.display_name || user.email.split("@")[0] || "friend"}
            </h1>
            <p className="mt-1 text-[14px] text-zinc-500">
              Current plan:
              <PlanBadge plan={plan} />
            </p>
          </div>
          <Link
            href="/notes/new"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            New note
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <UsageCard
            icon={<Clock className="h-4 w-4" />}
            label="Transcription minutes this month"
            used={minutesUsed}
            limit={limits.minutesPerMonth}
            pct={minutesPct}
          />
          <UsageCard
            icon={<Sparkles className="h-4 w-4" />}
            label="AI summaries this month"
            used={summariesUsed}
            limit={limits.summariesPerMonth}
            pct={summariesPct}
          />
        </div>

        {plan === "free" && <UpgradeBanner />}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <QuickAction
            href="/notes/new"
            icon={<Plus className="h-4 w-4" />}
            title="New note"
            desc="Upload audio or paste a transcript"
          />
          <QuickAction
            href="/notes"
            icon={<FileText className="h-4 w-4" />}
            title="My notes"
            desc="List, search, and share"
          />
          <QuickAction
            href="/settings"
            icon={<ArrowRight className="h-4 w-4" />}
            title="Account settings"
            desc="Subscription, billing, and profile"
          />
        </div>
      </div>
    </main>
  );
}

function PlanBadge({ plan }: { plan: "free" | "pro" | "team" }) {
  const styles =
    plan === "free"
      ? "bg-zinc-100 text-zinc-700"
      : "bg-zinc-900 text-white";
  return (
    <span
      className={`ml-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${styles}`}
    >
      {plan}
    </span>
  );
}

function UsageCard({
  icon,
  label,
  used,
  limit,
  pct,
}: {
  icon: React.ReactNode;
  label: string;
  used: number;
  limit: number;
  pct: number;
}) {
  const isInfinite = limit === Infinity;
  const isWarning = pct >= 80;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-black tracking-tight text-zinc-900">
          {used}
        </span>
        <span className="text-sm text-zinc-500">
          / {isInfinite ? "Unlimited" : limit}
        </span>
      </div>
      {!isInfinite && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full transition-all ${
              isWarning ? "bg-amber-500" : "bg-zinc-900"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function UpgradeBanner() {
  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Upgrade to Pro
          </div>
          <div className="mt-1.5 text-pretty text-[16px] font-bold text-zinc-900">
            600 min/month + unlimited summaries +{" "}
            <span className="whitespace-nowrap">share links</span>
          </div>
          <div className="mt-1 text-[13px] text-zinc-500">
            $9/month ·{" "}
            <span className="whitespace-nowrap">Cancel anytime</span>
          </div>
        </div>
        <Link
          href="/pricing"
          className="group inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          View plans
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-[0_4px_16px_-8px_rgba(15,23,42,0.1)]"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 text-white">
          {icon}
        </span>
        <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-700" />
      </div>
      <div className="mt-4 text-[15px] font-bold text-zinc-900">{title}</div>
      <div className="mt-0.5 text-[13px] text-zinc-500">{desc}</div>
    </Link>
  );
}
