import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { NewNoteClient } from "./new-note-client";
import { getCurrentUser } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

export default async function NewNotePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?redirect_url=/notes/new");

  return (
    <>
      <AppNav email={user.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold">New note</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Upload a meeting recording or paste a transcript. AI will turn it
          into a structured note.
        </p>
        <div className="mt-8">
          <NewNoteClient />
        </div>
      </main>
    </>
  );
}
