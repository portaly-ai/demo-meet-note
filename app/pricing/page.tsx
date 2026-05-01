import Link from "next/link";
import { Check, Clock, Globe, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { UpgradeButton } from "@/components/upgrade-button";

const FREE_FEATURES = [
  "30 minutes of audio transcription per month",
  "3 AI summaries per month",
  "Saved and searchable meeting notes",
  "Supports mixed Chinese and English speech",
];

const PRO_FEATURES = [
  "600 minutes of audio transcription per month",
  "Unlimited AI summaries",
  "Public share links",
  "Priority support",
  "Early access to future features",
];

export default function PricingPage() {
  return (
    <main className="bg-white">
      <SiteNav />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_60%)]"
        />
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 md:pt-28">
          <div className="animate-rise text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Pricing
            </p>
            <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-zinc-900 md:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-pretty text-[15px] text-zinc-600">
              Start free, then upgrade when you need more.{" "}
              <span className="whitespace-nowrap">Cancel anytime.</span>
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <PlanCard
              name="Free"
              price="$0"
              tagline="For personal use and occasional meetings"
              features={FREE_FEATURES}
              action={
                <Link
                  href="/sign-up"
                  className="block rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-900 transition hover:border-zinc-300"
                >
                  Start free
                </Link>
              }
            />
            <PlanCard
              highlight
              name="Pro"
              price="$9"
              priceSuffix="/month"
              tagline="For teams, client calls, and research interviews"
              features={PRO_FEATURES}
              action={
                <UpgradeButton className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50">
                  Upgrade to Pro
                </UpgradeButton>
              }
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-zinc-500">
            <Trust icon={<ShieldCheck className="h-4 w-4" />}>Secure payment</Trust>
            <Trust icon={<Clock className="h-4 w-4" />}>Cancel anytime</Trust>
            <Trust icon={<Globe className="h-4 w-4" />}>Traditional Chinese supported</Trust>
          </div>
        </div>
      </section>

      <Faq />

      <SiteFooter />
    </main>
  );
}

function PlanCard({
  name,
  price,
  priceSuffix,
  tagline,
  features,
  action,
  highlight,
}: {
  name: string;
  price: string;
  priceSuffix?: string;
  tagline: string;
  features: string[];
  action: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 ${
        highlight
          ? "border-2 border-zinc-900 bg-white shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)]"
          : "border border-zinc-200 bg-white"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-500">
          {name}
        </span>
        {highlight && (
          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">
            Most popular
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tight text-zinc-900">
          {price}
        </span>
        {priceSuffix && (
          <span className="text-sm text-zinc-500">{priceSuffix}</span>
        )}
      </div>
      <p className="mt-2 text-[13px] text-zinc-500">{tagline}</p>

      <div className="mt-6">{action}</div>

      <ul className="mt-7 space-y-3 text-[14px] text-zinc-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Trust({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {children}
    </span>
  );
}

function Faq() {
  const items = [
    {
      q: "Can I cancel anytime?",
      a: "Yes. You can cancel Pro anytime, keep using it through the paid period, and automatically return to Free afterward.",
    },
    {
      q: "How long can an audio file be?",
      a: "Each upload can be up to 25MB, roughly 25 to 30 minutes of high-quality audio. Split longer meetings into parts.",
    },
    {
      q: "Is my data safe?",
      a: "Audio is not stored permanently. After transcription, only the transcript and summary text remain. Notes are isolated per user account.",
    },
    {
      q: "Which languages are supported?",
      a: "Traditional Chinese, English, and meetings that mix both. Whisper handles mixed Chinese and English well.",
    },
  ];
  return (
    <section className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
          FAQ
        </h2>
        <div className="mt-10 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {items.map((it) => (
            <details key={it.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between text-[15px] font-semibold text-zinc-900">
                {it.q}
                <span className="text-zinc-400 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-zinc-600">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
