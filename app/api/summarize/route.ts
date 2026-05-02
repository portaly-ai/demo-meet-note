import { NextResponse } from "next/server";
import { z } from "zod";
import { summarizeMeeting } from "@/lib/ai/summarize";
import { checkSummaryQuota } from "@/lib/usage";
import { getOrCreateProfile } from "@/lib/profile";
import { getCurrentUser, adminDb } from "@/lib/insforge/server";
import { env } from "@/lib/env";
import type { Note } from "@/lib/insforge/types";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const Body = z.object({
  source: z.enum(["audio", "transcript"]),
  transcript: z.string().min(20, "Transcript is too short"),
  durationSeconds: z.number().int().nonnegative().default(0),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI summarization is temporarily unavailable. If you are the admin, set ANTHROPIC_API_KEY in your environment.",
        code: "missing_key",
      },
      { status: 503 },
    );
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { source, transcript, durationSeconds } = parsed.data;

  const profile = await getOrCreateProfile({
    userId: user.id,
    email: user.email,
  });

  const quota = checkSummaryQuota(profile);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: `Monthly summary limit of ${quota.limit} reached`, code: "quota" },
      { status: 402 },
    );
  }

  let summary;
  try {
    summary = await summarizeMeeting(transcript);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Summarization failed" },
      { status: 500 },
    );
  }

  const note = await adminDb.insert<Note>("notes", {
    user_id: user.id,
    title: summary.title || "Untitled meeting",
    source,
    transcript,
    duration_seconds: durationSeconds,
    summary,
  });
  if (!note) {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }

  await adminDb.rpc("increment_summaries", { p_user: user.id });

  return NextResponse.json({ id: note.id });
}
