import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { NoteSummaryView } from "@/components/note-summary-view";
import { ShareButton } from "@/components/share-button";
import type { MeetingSummary } from "@/lib/ai/summarize";
import { PLAN_LIMITS, planOf } from "@/lib/usage";
import { getOrCreateProfile } from "@/lib/profile";
import { getCurrentUser, adminDb } from "@/lib/insforge/server";
import type { Note } from "@/lib/insforge/types";

export const dynamic = "force-dynamic";

export default async function NoteDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?redirect_url=/notes/${id}`);

  const note = await adminDb.first<Note>("notes", {
    eq: { id, user_id: user.id },
  });
  if (!note) notFound();

  const profile = await getOrCreateProfile({
    userId: user.id,
    email: user.email,
  });
  const canShare = PLAN_LIMITS[planOf(profile)].canShare;

  return (
    <>
      <AppNav email={user.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/notes"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Back to notes
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{note.title}</h1>
            <div className="mt-1 text-sm text-zinc-500">
              {new Date(note.created_at).toLocaleString("en-US")} ·{" "}
              {note.source === "audio"
                ? `Audio transcription (${Math.round((note.duration_seconds ?? 0) / 60)} min)`
                : "Text input"}
            </div>
          </div>
          <ShareButton
            noteId={note.id}
            shareToken={note.share_token}
            canShare={canShare}
          />
        </div>

        {note.summary != null && (
          <div className="mt-8">
            <NoteSummaryView summary={note.summary as MeetingSummary} />
          </div>
        )}

        {note.transcript != null && note.transcript.length > 0 && (
          <details className="mt-8 rounded-xl border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-700">
              View transcript
            </summary>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">
              {note.transcript}
            </pre>
          </details>
        )}
      </main>
    </>
  );
}
