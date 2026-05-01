import { NextResponse } from "next/server";
import { getResend, FROM } from "@/lib/resend/client";
import { welcomeEmail } from "@/lib/resend/templates";
import { getCurrentUser } from "@/lib/insforge/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, skipped: "no_resend_key" });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!user.email)
    return NextResponse.json({ error: "no_email" }, { status: 400 });

  try {
    const t = welcomeEmail({ email: user.email });
    await getResend().emails.send({
      from: FROM,
      to: user.email,
      subject: t.subject,
      html: t.html,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "send_failed" },
      { status: 500 },
    );
  }
}
