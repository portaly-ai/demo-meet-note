import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { getCurrentUser, adminDb } from "@/lib/insforge/server";
import type { Note } from "@/lib/insforge/types";

export const dynamic = "force-dynamic";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?redirect_url=/notes");

  const rows = await adminDb.list<Note>("notes", {
    select: ["id", "title", "summary", "created_at"],
    eq: { user_id: user.id },
    or: q
      ? [
          `title.ilike.${encodeURIComponent(`%${q}%`)}`,
          `transcript.ilike.${encodeURIComponent(`%${q}%`)}`,
        ]
      : undefined,
    order: { created_at: "desc" },
    limit: 50,
  });

  return (
    <>
      <AppNav email={user.email} />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">My notes</h1>
          <Link
            href="/notes/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            + New
          </Link>
        </div>

        <form action="/notes" method="get" className="mt-6">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search notes..."
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </form>

        <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {rows.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-zinc-500">
              No notes yet.
              <Link href="/notes/new" className="ml-1 underline">
                Create the first one
              </Link>
            </li>
          )}
          {rows.map((n) => {
            const summaryText =
              (n.summary as { summary?: string } | null)?.summary ?? "";
            return (
              <li key={n.id}>
                <Link
                  href={`/notes/${n.id}`}
                  className="block px-4 py-4 transition hover:bg-zinc-50"
                >
                  <div className="font-semibold text-zinc-900">{n.title}</div>
                  {summaryText && (
                    <div className="mt-1 line-clamp-2 text-sm text-zinc-600">
                      {summaryText}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-zinc-400">
                    {new Date(n.created_at).toLocaleString("en-US")}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
