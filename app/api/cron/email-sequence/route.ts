import { NextResponse } from "next/server";
import { adminDb } from "@/lib/insforge/server";
import { getResend, FROM } from "@/lib/resend/client";
import {
  activationNudge,
  quotaExceededOffer,
  quotaWarning,
} from "@/lib/resend/templates";
import { PLAN_LIMITS } from "@/lib/usage";
import type { Profile, Note } from "@/lib/insforge/types";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Scheduled cron endpoint — intended to run once per hour.
 * Callers must pass `Authorization: Bearer ${CRON_SECRET}` header for authentication.
 * Configure your cron scheduler (GitHub Actions, system cron, platform scheduler, etc.)
 * to hit GET /api/cron/email-sequence with that header on the desired schedule.
 */
export async function GET(req: Request) {
  if (env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const resend = env.RESEND_API_KEY ? getResend() : null;
  const sent = { activation: 0, warning: 0, exceeded: 0 };
  const oneDayAgoIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // === 2: activation nudge — 註冊 >24h 還沒上傳 ===
  // PostgREST 的「比較」要用 lt.<value>，這裡需要自訂查詢。
  // 為簡化先取最近 50 個 free 用戶 + 沒寄過 activation 的，再用程式判斷時間。
  const activationCandidates = await adminDb.list<Profile>("profiles", {
    select: ["id", "email", "welcomed_at", "activation_email_sent_at"],
    eq: { activation_email_sent_at: undefined as never }, // null
    order: { welcomed_at: "asc" },
    limit: 50,
  });

  for (const p of activationCandidates) {
    if (!p.welcomed_at || p.welcomed_at > oneDayAgoIso) continue;
    if (p.activation_email_sent_at) continue;
    const notes = await adminDb.list<Note>("notes", {
      select: ["id"],
      eq: { user_id: p.id },
      limit: 1,
    });
    if (notes.length > 0) continue;

    if (resend && p.email) {
      const t = activationNudge({ email: p.email });
      await resend.emails
        .send({ from: FROM, to: p.email, subject: t.subject, html: t.html })
        .catch(() => {});
    }
    await adminDb.update("profiles", { id: p.id }, {
      activation_email_sent_at: new Date().toISOString(),
    });
    sent.activation++;
  }

  // === 3 + 4: 用量警告 / 超額 ===
  // TODO: 待 payment provider 重新串接後再啟用以下 quota emails。
  // 目前 UpgradeButton 為 disabled stub，寄信會把使用者導去無法升級的 CTA，故先暫關。
  // 串接完成後把 PAYMENT_ENABLED 改成 true（或讀 env）即可恢復。
  const PAYMENT_ENABLED: boolean = false;
  if (PAYMENT_ENABLED) {
    // PostgREST 的 GTE / LT 比較這版 helper 沒實作，改用 SQL function 或直接 list 全部。
    // 偷懶：列出 Free 全部，前端 filter。
    const freePlans = await adminDb.list<Profile>("profiles", {
      select: [
        "id",
        "email",
        "plan",
        "monthly_minutes_used",
        "quota_warning_sent_at",
        "quota_exceeded_sent_at",
      ],
      eq: { plan: "free" },
      limit: 500,
    });

    const freeLimit = PLAN_LIMITS.free.minutesPerMonth;
    const warnThreshold = Math.floor(freeLimit * 0.8);

    for (const p of freePlans) {
      const used = p.monthly_minutes_used;
      if (
        !p.quota_warning_sent_at &&
        used >= warnThreshold &&
        used < freeLimit
      ) {
        if (resend && p.email) {
          const t = quotaWarning({ email: p.email, used, limit: freeLimit });
          await resend.emails
            .send({ from: FROM, to: p.email, subject: t.subject, html: t.html })
            .catch(() => {});
        }
        await adminDb.update("profiles", { id: p.id }, {
          quota_warning_sent_at: new Date().toISOString(),
        });
        sent.warning++;
      }
      if (!p.quota_exceeded_sent_at && used >= freeLimit) {
        if (resend && p.email) {
          const t = quotaExceededOffer({ email: p.email });
          await resend.emails
            .send({ from: FROM, to: p.email, subject: t.subject, html: t.html })
            .catch(() => {});
        }
        await adminDb.update("profiles", { id: p.id }, {
          quota_exceeded_sent_at: new Date().toISOString(),
        });
        sent.exceeded++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, paymentEnabled: PAYMENT_ENABLED });
}
