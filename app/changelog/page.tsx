import type { Metadata } from "next";
import { Sparkles, Wrench, Zap } from "lucide-react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Feature releases and improvements for MeetNote AI.",
};

type EntryType = "feature" | "improvement" | "fix";

interface Entry {
  date: string;
  version?: string;
  type: EntryType;
  title: string;
  desc?: string;
  bullets?: string[];
}

const ENTRIES: Entry[] = [
  {
    date: "2026-04-29",
    version: "v0.4",
    type: "feature",
    title: "Example notes, SEO, and OG previews",
    desc: "Visitors can now see realistic output from MeetNote before signing up.",
    bullets: [
      "Added /example with three scenarios: product weekly, customer interview, and design review",
      "Added OG image, Twitter card, and favicon",
      "Added sitemap, robots, and JSON-LD structured data",
      "Footer now includes Privacy, Terms, and Changelog links",
    ],
  },
  {
    date: "2026-04-28",
    version: "v0.3",
    type: "feature",
    title: "Three feature demo animations",
    desc: "Used GSAP + ScrollTrigger to show the workflow on the landing page.",
    bullets: [
      "Demo 1: waveform visualization, progress bar, and transcript typewriter sync",
      "Demo 2: original transcript to structured summary and action items",
      "Demo 3: simulated cursor clicks for copy and Markdown/PDF download",
    ],
  },
  {
    date: "2026-04-27",
    version: "v0.2",
    type: "improvement",
    title: "Visual and brand refinements",
    desc: "Moved away from purple gradients to a monochrome base, added subtle entrance motion, and improved text wrapping.",
    bullets: [
      "Unified the palette around zinc-900 and emerald accents",
      "globals.css adds rise keyframes and respects prefers-reduced-motion",
      "Applied text-wrap: pretty for body copy and nowrap for tight punctuation",
      "Replaced emoji with lucide-react icons throughout",
    ],
  },
  {
    date: "2026-04-27",
    version: "v0.1",
    type: "feature",
    title: "MeetNote AI launch",
    desc: "The first version of meeting audio to actionable notes.",
    bullets: [
      "OpenAI Whisper audio transcription up to 25MB",
      "Claude tool-use structured summaries with action items, decisions, and participants",
      "Insforge Auth, Database, and file storage",
      "Free/Pro plans, usage limits, and paid unlocks",
      "Public share links and Traditional Chinese search",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="bg-white">
      <SiteNav />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_60%)]"
        />
        <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 md:pt-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Changelog
            </p>
            <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-zinc-900 md:text-5xl">
              What we are building
            </h1>
            <p className="mt-4 text-pretty text-[15px] text-zinc-600">
              Every release is listed here.{" "}
              <span className="whitespace-nowrap">
                Tell us what you want to see next.
              </span>
            </p>
          </div>

          <ol className="mt-14 space-y-12">
            {ENTRIES.map((e, i) => (
              <li key={i} className="relative pl-8">
                {/* timeline dot + line */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-zinc-200 bg-white"
                >
                  <Icon type={e.type} />
                </span>
                {i < ENTRIES.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[11px] top-7 h-[calc(100%+2.5rem)] w-px bg-zinc-200"
                  />
                )}

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <time className="text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    {e.date}
                  </time>
                  {e.version && (
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white">
                      {e.version}
                    </span>
                  )}
                  <TypeBadge type={e.type} />
                </div>
                <h2 className="mt-2 text-pretty text-[20px] font-bold text-zinc-900">
                  {e.title}
                </h2>
                {e.desc && (
                  <p className="mt-2 text-pretty text-[14px] leading-relaxed text-zinc-600">
                    {e.desc}
                  </p>
                )}
                {e.bullets && (
                  <ul className="mt-3 space-y-1.5 text-[14px] text-zinc-700">
                    {e.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-pretty"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-zinc-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Icon({ type }: { type: EntryType }) {
  const cls = "h-3 w-3";
  if (type === "feature") return <Sparkles className={cls + " text-zinc-900"} />;
  if (type === "improvement")
    return <Zap className={cls + " text-zinc-900"} />;
  return <Wrench className={cls + " text-zinc-900"} />;
}

function TypeBadge({ type }: { type: EntryType }) {
  const map: Record<EntryType, { label: string; cls: string }> = {
    feature: {
      label: "Feature",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    improvement: {
      label: "Improvement",
      cls: "bg-zinc-100 text-zinc-700 border-zinc-200",
    },
    fix: {
      label: "Fix",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };
  const m = map[type];
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
