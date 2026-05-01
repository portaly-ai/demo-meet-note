import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export function LegalShell({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <header className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Legal
          </p>
          <h1 className="mt-3 text-balance text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-[13px] text-zinc-500">
            Last updated: {updatedAt}
          </p>
        </header>
        <div className="prose-zinc mt-10 max-w-none space-y-6 text-pretty text-[15px] leading-relaxed text-zinc-700 [&_h2]:mt-10 [&_h2]:text-balance [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-zinc-900 [&_h3]:mt-6 [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:text-zinc-900 [&_p]:text-pretty [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_a]:text-zinc-900 [&_a]:underline">
          {children}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
