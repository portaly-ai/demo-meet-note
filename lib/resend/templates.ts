import { env } from "@/lib/env";

interface BaseProps {
  email: string;
  displayName?: string;
}

function shell(content: string) {
  return `<!doctype html><html><body style="font-family:-apple-system,'Noto Sans TC',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;line-height:1.7">
  <div style="font-weight:700;font-size:18px;margin-bottom:24px">MeetNote AI</div>
  ${content}
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0">
  <div style="color:#888;font-size:12px">MeetNote AI · 把會議錄音變成可執行的筆記</div>
  </body></html>`;
}

export function welcomeEmail(p: BaseProps) {
  const name = p.displayName || p.email.split("@")[0];
  return {
    subject: `${name}，3 步驟做出你第一份 AI 會議筆記`,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 16px">歡迎加入 MeetNote AI</h1>
      <p>Hi ${name}，</p>
      <p>把會議錄音或逐字稿丟進來，30 秒內你會拿到摘要、行動項目、決策點。</p>
      <ol>
        <li>登入後到「新筆記」</li>
        <li>上傳音檔或貼上逐字稿</li>
        <li>等 30 秒，看 AI 整理出一份結構化筆記</li>
      </ol>
      <p style="margin:32px 0">
        <a href="${env.SITE_URL}/notes/new" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">建立第一份筆記</a>
      </p>
      <p>免費方案每月可轉錄 30 分鐘、摘要 3 次。</p>
    `),
  };
}

export function activationNudge(p: BaseProps) {
  const name = p.displayName || p.email.split("@")[0];
  return {
    subject: `${name}，試試貼上你最近一場會議的逐字稿`,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 16px">還沒試試看嗎？</h1>
      <p>Hi ${name}，</p>
      <p>不用上傳音檔，直接把 Google Meet、Zoom、Teams 的逐字稿貼上來，馬上就能拿到結構化摘要。</p>
      <p style="margin:32px 0">
        <a href="${env.SITE_URL}/notes/new" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">立刻試一次</a>
      </p>
    `),
  };
}

export function quotaWarning(p: BaseProps & { used: number; limit: number }) {
  const name = p.displayName || p.email.split("@")[0];
  return {
    subject: `${name}，你這個月已用掉 ${p.used}/${p.limit} 分鐘`,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 16px">免費額度即將用完</h1>
      <p>Hi ${name}，本月 ${p.used} / ${p.limit} 分鐘已使用。</p>
      <p>升級方案以解鎖更多用量、無限摘要與分享連結。</p>
      <p style="margin:32px 0">
        <a href="${env.SITE_URL}/pricing" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">查看方案</a>
      </p>
    `),
  };
}

export function quotaExceededOffer(p: BaseProps) {
  const name = p.displayName || p.email.split("@")[0];
  return {
    subject: `${name}，本月免費額度已用完`,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 16px">這個月額度已用完</h1>
      <p>Hi ${name}，要繼續用就需要升級囉。</p>
      <p>升級後可獲得每月 600 分鐘轉錄、無限 AI 摘要、分享連結等功能。</p>
      <p style="margin:32px 0">
        <a href="${env.SITE_URL}/pricing" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">查看升級方案</a>
      </p>
    `),
  };
}

export function upgradedThankYou(p: BaseProps) {
  const name = p.displayName || p.email.split("@")[0];
  return {
    subject: `${name}，歡迎升級 Pro 🎉`,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 16px">付款成功，Pro 方案啟用</h1>
      <p>Hi ${name}，</p>
      <p>本月你有 600 分鐘轉錄、無限摘要、分享連結功能。</p>
      <p style="margin:32px 0">
        <a href="${env.SITE_URL}/dashboard" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">回到儀表板</a>
      </p>
    `),
  };
}
