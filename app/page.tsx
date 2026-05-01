import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Download,
  Globe,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroMockup } from "@/components/site/hero-mockup";
import { DemoTranscribe } from "@/components/site/demos/demo-transcribe";
import { DemoSummarize } from "@/components/site/demos/demo-summarize";
import { DemoExport } from "@/components/site/demos/demo-export";
import { StructuredData } from "@/components/site/structured-data";

export default function LandingPage() {
  return (
    <main className="bg-white">
      <StructuredData />
      <SiteNav />
      <Hero />
      <LogosBar />
      <FeatureShowcase />
      <Workflow />
      <UseCases />
      <PricingPreview />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}

/* ───────────────────── Hero ───────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle grey gradient — barely visible, just enough to add depth */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_60%)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-20 pb-24 md:grid-cols-2 md:pt-28 md:pb-32">
        <div>
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Chinese supported ·{" "}
            <span className="whitespace-nowrap">One meeting, summarized in 30 seconds</span>
          </p>
          <h1 className="animate-rise mt-6 text-balance text-5xl font-black leading-[1.05] tracking-tight text-zinc-900 [animation-delay:80ms] md:text-6xl">
            Turn meeting audio
            <br />
            into actionable notes
          </h1>
          <p className="animate-rise mt-5 max-w-lg text-pretty text-[17px] leading-relaxed text-zinc-600 [animation-delay:160ms]">
            Upload audio or paste a transcript. AI instantly turns it into
            summaries, action items, and decisions.
            <span className="whitespace-nowrap">
              {" "}
              You no longer spend an hour cleaning up one meeting.
            </span>
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/example"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300"
            >
              View example notes
            </Link>
          </div>
          <p className="animate-rise mt-4 text-[13px] text-zinc-500 [animation-delay:320ms]">
            Free plan includes 30 minutes of transcription and 3 AI summaries per month ·{" "}
            <span className="whitespace-nowrap">No credit card required</span>
          </p>
        </div>
        <div className="animate-rise-slow [animation-delay:200ms] md:pl-4">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Logos / trust bar ───────────────────── */

function LogosBar() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/60 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-zinc-500">
          Built for product teams, designers, researchers, and freelancers
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[15px] font-semibold tracking-tight text-zinc-400">
          {[
            "Product weekly",
            "Customer interview",
            "Design review",
            "1:1 sync",
            "Talk notes",
          ].map((label, i, arr) => (
            <span
              key={label}
              className="flex items-center gap-x-10 whitespace-nowrap"
            >
              {label}
              {i < arr.length - 1 && (
                <span
                  aria-hidden
                  className="hidden h-1 w-1 rounded-full bg-zinc-300 md:inline-block"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Feature Showcase (with animated demos) ───────────────────── */

function FeatureShowcase() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Core features"
          title="You do not need another transcript"
          desc="You need to know what happens next, who owns it, and when it is due. MeetNote gives you decision-ready meeting output."
        />

        <div className="mt-20 space-y-24 md:space-y-28">
          <FeatureRow
            num="01"
            icon={<Waves className="h-4 w-4" />}
            title="Audio to transcript"
            desc="OpenAI Whisper handles mixed Chinese and English, domain terms, and different accents while preserving the timeline."
            bullets={[
              "Supports mp3, m4a, and wav up to 25MB",
              "Chinese and English mixed speech",
              "Automatically continues into analysis",
            ]}
            visual={<DemoTranscribe />}
          />

          <FeatureRow
            num="02"
            reverse
            icon={<Sparkles className="h-4 w-4" />}
            title="Meeting structure cleanup"
            desc="Turn a messy transcript into clear notes with summaries, action items, decisions, and participants extracted automatically."
            bullets={[
              "Extract owners and due dates automatically",
              "Pull out decisions and participants",
              "Claude tool use enforces structured output",
            ]}
            visual={<DemoSummarize />}
          />

          <FeatureRow
            num="03"
            icon={<Download className="h-4 w-4" />}
            title="Export and handoff"
            desc="Copy once or download Markdown/PDF, then move the note directly into Notion, Obsidian, or Slack."
            bullets={[
              "Copy as plain text or Markdown",
              "Download .md for Notion or Obsidian",
              "Download .pdf for clients or managers",
            ]}
            visual={<DemoExport />}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  num,
  icon,
  title,
  desc,
  bullets,
  visual,
  reverse,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-10 md:grid-cols-2 md:gap-14 ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[12px] font-medium text-zinc-700">
          <span className="text-zinc-900">{icon}</span>
          <span className="text-zinc-400">{num}</span>
          <span>{title}</span>
        </div>
        <h3 className="mt-5 text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
          {title}
        </h3>
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-zinc-600">
          {desc}
        </p>
        <ul className="mt-6 space-y-2.5">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-[14px] text-zinc-700"
            >
              <span className="mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-current">
                  <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div>{visual}</div>
    </div>
  );
}

/* ───────────────────── Workflow ───────────────────── */

function Workflow() {
  return (
    <section className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps, done in 30 seconds"
          desc="No app to install and no new workflow to learn. Drop in the meeting when it ends."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <StepCard
            n="01"
            title="Drop it in"
            desc="Drag in a Zoom, Meet, or Teams recording, or paste a transcript."
          />
          <StepCard
            n="02"
            title="Wait 30 seconds"
            desc="Whisper transcribes and Claude structures the note automatically."
          />
          <StepCard
            n="03"
            title="Take the note"
            desc="Summary, key points, action items, decisions, and participants on one page."
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300">
      <div className="text-[12px] font-bold tracking-[0.2em] text-zinc-400">
        {n}
      </div>
      <h3 className="mt-2 text-[18px] font-bold text-zinc-900">{title}</h3>
      <p className="mt-2 text-pretty text-[14px] leading-relaxed text-zinc-600">
        {desc}
      </p>
    </div>
  );
}

/* ───────────────────── Use cases ───────────────────── */

function UseCases() {
  return (
    <section className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Use cases"
          title="Any time a conversation needs to become usable notes"
        />
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {[
            "Product meetings: list this week’s deliverables automatically",
            "Customer interviews: keep every insight visible",
            "Design reviews: see who said what at a glance",
            "1:1s: turn follow-ups into tasks",
            "Talks and courses: turn 30 minutes into readable notes",
            "Remote teams: help teammates catch up from the summary",
          ].map((u) => (
            <div
              key={u}
              className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-pretty text-[14px] text-zinc-700 transition hover:border-zinc-300"
            >
              <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <Check className="h-3 w-3" />
              </span>
              {u}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Pricing preview ───────────────────── */

function PricingPreview() {
  return (
    <section className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free, upgrade when you need more"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <MiniPlanCard
            name="Free"
            price="$0"
            features={[
              "30 minutes of audio transcription per month",
              "3 AI summaries per month",
              "Saved and searchable meeting notes",
            ]}
            cta="Start free"
            ctaHref="/sign-up"
          />
          <MiniPlanCard
            highlight
            name="Pro"
            price="$9"
            priceSuffix="/month"
            features={[
              "600 minutes of audio transcription per month",
              "Unlimited AI summaries",
              "Public share links",
              "Priority support",
            ]}
            cta="View Pro plan"
            ctaHref="/pricing"
          />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-zinc-500">
          <Trust icon={<ShieldCheck className="h-3.5 w-3.5" />}>Secure payment</Trust>
          <Trust icon={<Clock className="h-3.5 w-3.5" />}>Cancel anytime</Trust>
          <Trust icon={<Globe className="h-3.5 w-3.5" />}>Traditional Chinese supported</Trust>
        </div>
      </div>
    </section>
  );
}

function MiniPlanCard({
  name,
  price,
  priceSuffix,
  features,
  cta,
  ctaHref,
  highlight,
}: {
  name: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-7 ${
        highlight
          ? "border-2 border-zinc-900 bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.14)]"
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
        <span className="text-4xl font-black tracking-tight text-zinc-900">
          {price}
        </span>
        {priceSuffix && (
          <span className="text-sm text-zinc-500">{priceSuffix}</span>
        )}
      </div>
      <ul className="mt-6 space-y-2.5 text-[14px] text-zinc-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`mt-7 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
          highlight
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
        }`}
      >
        {cta}
      </Link>
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
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      {icon}
      {children}
    </span>
  );
}

/* ───────────────────── Final CTA ───────────────────── */

function FinalCta() {
  return (
    <section className="px-6 py-24 md:py-28">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-900 px-8 py-16 text-center md:px-12">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]"
        />
        <h2 className="text-balance text-3xl font-black tracking-tight text-white md:text-4xl">
          Spend one less hour cleaning up notes,
          <br />
          and one more hour doing the work
        </h2>
        <p className="mt-4 text-pretty text-[15px] text-zinc-300">
          Create a free account and try it on your latest meeting.
        </p>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── shared ───────────────────── */

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-zinc-600">
          {desc}
        </p>
      )}
    </div>
  );
}
