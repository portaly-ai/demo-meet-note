import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { EXAMPLES } from "@/lib/example-notes";

export const metadata: Metadata = {
  title: "Example notes",
  description:
    "See real examples of meeting notes prepared by MeetNote AI: product weekly, customer interview, and design review. Create a free account to process your own meetings.",
};

export default function ExamplesIndex() {
  return (
    <main className="bg-white">
      <SiteNav />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.04),_transparent_60%)]"
        />
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Example notes
            </p>
            <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-zinc-900 md:text-5xl">
              See what a finished meeting note looks like
            </h1>
            <p className="mt-4 text-pretty text-[15px] text-zinc-600">
              Three realistic notes prepared by MeetNote AI.{" "}
              <span className="whitespace-nowrap">No signup required.</span>
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {EXAMPLES.map((ex) => (
              <Link
                key={ex.slug}
                href={`/example/${ex.slug}`}
                className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.10)]"
              >
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  <FileText className="h-3.5 w-3.5" />
                  {ex.scenario}
                </div>
                <h2 className="mt-3 text-pretty text-[16px] font-bold text-zinc-900">
                  {ex.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-pretty text-[13px] leading-relaxed text-zinc-600">
                  {ex.summary.summary}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5 text-[12px] text-zinc-500">
                  {ex.durationMin && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {ex.durationMin} min
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-zinc-700 transition group-hover:gap-1.5">
                    Read full note
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
            Want to process your own meeting?
          </h2>
          <p className="mt-3 text-pretty text-[15px] text-zinc-600">
            The free plan includes 30 minutes of transcription and 3 AI summaries per month.
          </p>
          <div className="mt-7">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
