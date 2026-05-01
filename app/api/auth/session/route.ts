import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { COOKIE_NAME } from "@/lib/insforge/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  accessToken: z.string().min(10),
  expiresAt: z.string().datetime().optional(),
});

/**
 * Sign-in / sign-up 成功後，client 把 accessToken POST 過來，
 * server 把它寫進 httpOnly cookie 給後續 server-side request 使用。
 */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const { accessToken, expiresAt } = parsed.data;
  const expiresMs = expiresAt
    ? Date.parse(expiresAt) - Date.now()
    : 60 * 60 * 1000; // 預設 1 小時
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, Math.floor(expiresMs / 1000)),
  });
  return NextResponse.json({ ok: true });
}

/** Sign-out — 清掉 cookie。 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
