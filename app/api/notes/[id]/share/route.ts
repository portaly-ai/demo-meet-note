import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { PLAN_LIMITS, planOf } from "@/lib/usage";
import { getOrCreateProfile } from "@/lib/profile";
import { getCurrentUser, adminDb } from "@/lib/insforge/server";
import type { Note } from "@/lib/insforge/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const profile = await getOrCreateProfile({
    userId: user.id,
    email: user.email,
  });
  if (!PLAN_LIMITS[planOf(profile)].canShare) {
    return NextResponse.json(
      { error: "Upgrade to Pro to share notes", code: "plan" },
      { status: 402 },
    );
  }

  const token = randomBytes(16).toString("base64url");
  const updated = await adminDb.update<Note>(
    "notes",
    { id, user_id: user.id },
    { share_token: token },
  );
  if (updated.length === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
  return NextResponse.json({ token });
}
