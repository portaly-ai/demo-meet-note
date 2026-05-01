import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/ai/whisper";
import { checkTranscribeQuota } from "@/lib/usage";
import { getOrCreateProfile } from "@/lib/profile";
import { getCurrentUser, adminDb } from "@/lib/insforge/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Transcription is temporarily unavailable. If you are the admin, set OPENAI_API_KEY in Vercel.",
        code: "missing_key",
      },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
  }
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Audio file must be smaller than 25MB" }, { status: 400 });
  }

  const profile = await getOrCreateProfile({
    userId: user.id,
    email: user.email,
  });

  const estMinutes = Math.max(1, Math.ceil(file.size / (1024 * 1024)));
  const pre = checkTranscribeQuota(profile, estMinutes);
  if (!pre.allowed) {
    return NextResponse.json(
      { error: `Monthly transcription limit of ${pre.limit} minutes reached`, code: "quota" },
      { status: 402 },
    );
  }

  let result;
  try {
    result = await transcribeAudio(file);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Transcription failed" },
      { status: 500 },
    );
  }

  const minutes = Math.max(1, Math.ceil(result.durationSeconds / 60));
  // 用 SQL function 確保原子增量（避免 concurrent request race）
  await adminDb.rpc("increment_minutes", {
    p_user: user.id,
    p_delta: minutes,
  });

  return NextResponse.json({
    transcript: result.text,
    durationSeconds: result.durationSeconds,
  });
}
