import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { NoteSummaryView } from "@/components/note-summary-view";
import { EXAMPLES, getExample } from "@/lib/example-notes";

export function generateStaticParams() {
  return EXAMPLES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ex = getExample(slug);
  if (!ex) return { title: "Example notes" };
  return {
    title: ex.title,
    description: ex.summary.summary,
  };
}

export default async function ExampleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ex = getExample(slug);
  if (!ex) notFound();

  return (
    <main className="bg-white">
      <SiteNav />

      <article className="mx-auto max-w-3xl px-6 pt-12 pb-16">
        <Link
          href="/example"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All examples
        </Link>

        <header className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            {ex.scenario}
          </p>
          <h1 className="mt-2 text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
            {ex.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-zinc-500">
            <span>{new Date(ex.createdAt).toLocaleString("en-US")}</span>
            {ex.durationMin && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {ex.durationMin} min recording
              </span>
            )}
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
              {ex.source === "audio" ? "Audio transcription" : "Text input"}
            </span>
          </div>
        </header>

        <div className="mt-10">
          <NoteSummaryView summary={ex.summary} />
        </div>

        {ex.transcriptPreview && (
          <details className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50/60 p-5">
            <summary className="cursor-pointer text-[13px] font-semibold text-zinc-700">
              View transcript excerpt
            </summary>
            <p className="mt-3 text-pretty text-[13px] leading-relaxed text-zinc-700">
              {ex.transcriptPreview}
              <span className="ml-2 text-zinc-400">⋯ (truncated)</span>
            </p>
          </details>
        )}
      </article>

      <section className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-zinc-900">
            Want to process your own meeting?
          </h2>
          <p className="mt-3 text-pretty text-[14px] text-zinc-600">
            Free plan includes 30 minutes of transcription and 3 summaries per month ·{" "}
            <span className="whitespace-nowrap">No credit card required</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/example"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300"
            >
              View other examples
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
