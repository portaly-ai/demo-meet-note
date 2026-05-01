"use client";

import { useEffect, useState } from "react";

type Locale = "en" | "zh-TW";

const STORAGE_KEY = "meetnote-locale";

const zhToEn: Record<string, string> = {
  "方案 · MeetNote AI": "Pricing · MeetNote AI",
  "範例筆記 · MeetNote AI": "Example notes · MeetNote AI",
  "登入 · MeetNote AI": "Sign in · MeetNote AI",
  "註冊 · MeetNote AI": "Sign up · MeetNote AI",
  "更新紀錄 · MeetNote AI": "Changelog · MeetNote AI",
  "隱私政策 · MeetNote AI": "Privacy Policy · MeetNote AI",
  "服務條款 · MeetNote AI": "Terms of Service · MeetNote AI",
  "產品週會 · 會員系統 Beta 上線檢視 · MeetNote AI": "Product weekly · Membership Beta launch review · MeetNote AI",
  "客戶訪談 · SaaS 創辦人 V · MeetNote AI": "Customer interview · SaaS founder V · MeetNote AI",
  "設計檢討 · Onboarding 流程 v3 · MeetNote AI": "Design review · Onboarding flow v3 · MeetNote AI",
  "MeetNote AI · 把會議錄音變成可執行的筆記": "MeetNote AI · Turn meeting audio into actionable notes",
  "方案": "Pricing",
  "簡單明瞭的訂價": "Simple, transparent pricing",
  "先免費試用，需要更多再升級。隨時可取消，不綁約。": "Start free, then upgrade when you need more. Cancel anytime.",
  "範例": "Examples",
  "登入": "Sign in",
  "免費試用": "Start free",
  "免費註冊": "Create a free account",
  "免費開始": "Start free",
  "看範例筆記": "View example notes",
  "查看 Pro 方案": "View Pro plan",
  "升級 Pro": "Upgrade to Pro",
  "前往付款…": "Opening checkout...",
  "建立付款失敗，請稍後再試": "Could not start checkout. Please try again later.",
  "建立付款失敗": "Could not start checkout",
  "支援中文 ·": "Chinese supported ·",
  "一場會議只要 30 秒": "One meeting, summarized in 30 seconds",
  "把會議錄音": "Turn meeting audio",
  "變成可執行的筆記": "into actionable notes",
  "上傳音檔或貼上逐字稿，AI 立刻整理出摘要、行動項目、決策點。再也不用花一小時整理一場會議。": "Upload audio or paste a transcript. AI instantly turns it into summaries, action items, and decisions, so you do not spend another hour cleaning up meeting notes.",
  "上傳音檔或貼上逐字稿，AI 立刻整理出摘要、行動項目、決策點。": "Upload audio or paste a transcript. AI instantly turns it into summaries, action items, and decisions.",
  "再也不用花一小時整理一場會議。": " You no longer spend an hour cleaning up one meeting.",
  "免費方案每月 30 分鐘音檔轉錄、3 次 AI 摘要 · 不需信用卡": "Free plan includes 30 minutes of transcription and 3 AI summaries per month. No credit card required.",
  "免費方案每月 30 分鐘音檔轉錄、3 次 AI 摘要 ·": "Free plan includes 30 minutes of transcription and 3 AI summaries per month ·",
  "不需信用卡": "No credit card required",
  "適合產品團隊、設計師、研究員、自由工作者": "Built for product teams, designers, researchers, and freelancers",
  "產品週會": "Product weekly",
  "客戶訪談": "Customer interview",
  "設計檢討": "Design review",
  "1:1 同步": "1:1 sync",
  "講座筆記": "Talk notes",
  "核心功能": "Core features",
  "你需要的不是逐字稿": "You do not need another transcript",
  "而是「下一步要做什麼、誰負責、什麼時候做完」。MeetNote 直接給你決策層的會議產出。": "You need to know what happens next, who owns it, and when it is due. MeetNote gives you decision-ready meeting output.",
  "語音轉逐字稿": "Audio to transcript",
  "OpenAI Whisper 即時轉錄，中英混雜、專有名詞、不同口音都跟得上。轉完直接保留時間軸。": "OpenAI Whisper handles mixed Chinese and English, domain terms, and different accents while preserving the timeline.",
  "支援 mp3 / m4a / wav，最大 25MB": "Supports mp3, m4a, and wav up to 25MB",
  "中英混雜 · 不漏名詞": "Chinese and English mixed speech",
  "結束自動進入下一步分析": "Automatically continues into analysis",
  "會議格式整理": "Meeting structure cleanup",
  "把凌亂逐字稿整理成清楚的會議筆記：摘要、行動項目、決策、參與者全自動抽出來。": "Turn a messy transcript into clear notes with summaries, action items, decisions, and participants extracted automatically.",
  "自動分配「誰負責、什麼時候做完」": "Extract owners and due dates automatically",
  "提取決策、抽取參與者": "Pull out decisions and participants",
  "Claude tool use 強制結構化": "Claude tool use enforces structured output",
  "操作與導出": "Export and handoff",
  "一鍵複製、下載 Markdown / PDF，整份筆記直接帶進 Notion、Obsidian、Slack。": "Copy once or download Markdown/PDF, then move the note directly into Notion, Obsidian, or Slack.",
  "複製到剪貼簿（純文字 / Markdown）": "Copy as plain text or Markdown",
  "下載 .md（給 Notion / Obsidian）": "Download .md for Notion or Obsidian",
  "下載 .pdf（給客戶 / 主管）": "Download .pdf for clients or managers",
  "如何運作": "How it works",
  "三步驟，30 秒搞定": "Three steps, done in 30 seconds",
  "不用裝 app、不用學新工具。會議結束後丟進來就好。": "No app to install and no new workflow to learn. Drop in the meeting when it ends.",
  "丟進來": "Drop it in",
  "拖拉上傳 Zoom / Meet / Teams 的錄音，或直接貼上逐字稿。": "Drag in a Zoom, Meet, or Teams recording, or paste a transcript.",
  "等 30 秒": "Wait 30 seconds",
  "Whisper 自動轉錄、Claude 結構化分析，全自動跑完。": "Whisper transcribes and Claude structures the note automatically.",
  "拿走筆記": "Take the note",
  "摘要、重點、行動項目、決策、參與者，一頁就看完。": "Summary, key points, action items, decisions, and participants on one page.",
  "適用場景": "Use cases",
  "任何需要整理一場對話的時刻": "Any time a conversation needs to become usable notes",
  "產品會議：自動列出本週要交付的任務": "Product meetings: list this week’s deliverables automatically",
  "客戶訪談：研究不漏掉任何洞察": "Customer interviews: keep every insight visible",
  "設計檢討：誰反饋了什麼一目了然": "Design reviews: see who said what at a glance",
  "同事 1:1：行動項目自動進待辦": "1:1s: turn follow-ups into tasks",
  "講座、課程：30 分鐘變成可讀筆記": "Talks and courses: turn 30 minutes into readable notes",
  "遠端工作：跨時區同事看摘要就跟得上": "Remote teams: help teammates catch up from the summary",
  "先免費用，需要更多再升級": "Start free, upgrade when you need more",
  "每月 30 分鐘音檔轉錄": "30 minutes of audio transcription per month",
  "每月 3 次 AI 摘要": "3 AI summaries per month",
  "會議筆記儲存與搜尋": "Saved and searchable meeting notes",
  "支援中英混雜語音": "Supports mixed Chinese and English speech",
  "每月 600 分鐘音檔轉錄": "600 minutes of audio transcription per month",
  "無限 AI 摘要": "Unlimited AI summaries",
  "公開分享連結": "Public share links",
  "優先客服": "Priority support",
  "優先客服支援": "Priority support",
  "未來新功能優先試用": "Early access to future features",
  "安全付款": "Secure payment",
  "隨時可取消": "Cancel anytime",
  "支援繁體中文": "Traditional Chinese supported",
  "最熱門": "Most popular",
  "少花一小時整理筆記，多一小時做正事": "Spend one less hour cleaning up notes and one more hour doing the work",
  "少花一小時整理筆記，": "Spend one less hour cleaning up notes,",
  "多一小時做正事": "and one more hour doing the work",
  "免費註冊，立刻試試你最近一場會議。": "Create a free account and try it on your latest meeting.",
  "個人使用、零星會議": "For personal use and occasional meetings",
  "團隊、客戶會議、深度訪談": "For teams, client calls, and research interviews",
  "常見問題": "FAQ",
  "可以隨時取消嗎？": "Can I cancel anytime?",
  "可以，Pro 訂閱隨時可取消，剩餘期間仍可使用，到期後自動降回 Free 方案。": "Yes. You can cancel Pro anytime, keep using it through the paid period, and automatically return to Free afterward.",
  "音檔最大可以多長？": "How long can an audio file be?",
  "單次最大 25MB（約 25-30 分鐘高品質錄音）。需要更長的會議建議分段上傳。": "Each upload can be up to 25MB, roughly 25 to 30 minutes of high-quality audio. Split longer meetings into parts.",
  "資料安全嗎？": "Is my data safe?",
  "音檔不會永久儲存，轉錄完成後僅保留逐字稿與摘要文字。所有筆記用 RLS 隔離，只有你能看到。": "Audio is not stored permanently. After transcription, only the transcript and summary text remain. Notes are isolated per user account.",
  "支援什麼語言？": "Which languages are supported?",
  "繁體中文、英文，以及兩者混雜的會議。Whisper 對中英混雜處理效果很好。": "Traditional Chinese, English, and meetings that mix both. Whisper handles mixed Chinese and English well.",
  "範例筆記": "Example notes",
  "看 MeetNote AI 實際整理出的會議筆記範例：產品週會、客戶訪談、設計檢討。免費註冊後就能整理你自己的會議。": "See real examples of meeting notes prepared by MeetNote AI: product weekly, customer interview, and design review. Create a free account to process your own meetings.",
  "看實際的會議筆記長什麼樣": "See what a finished meeting note looks like",
  "三段 MeetNote AI 整理過的真實場景筆記。不需註冊就能看完整內容。": "Three realistic notes prepared by MeetNote AI. No signup required.",
  "三段 MeetNote AI 整理過的真實場景筆記。": "Three realistic notes prepared by MeetNote AI.",
  "不需註冊就能看完整內容。": "No signup required.",
  "分鐘": "min",
  "分鐘錄音": "min recording",
  "看完整筆記": "Read full note",
  "想整理你自己的會議？": "Want to process your own meeting?",
  "免費方案每月 30 分鐘音檔轉錄、3 次 AI 摘要。": "The free plan includes 30 minutes of transcription and 3 AI summaries per month.",
  "所有範例": "All examples",
  "音檔轉錄": "Audio transcription",
  "文字輸入": "Text input",
  "查看逐字稿片段": "View transcript excerpt",
  "省略）": "omitted)",
  "免費方案每月 30 分鐘轉錄、3 次摘要 ·": "Free plan includes 30 minutes of transcription and 3 summaries per month ·",
  "登入 MeetNote AI": "Sign in to MeetNote AI",
  "繼續整理你的會議": "Continue organizing your meetings",
  "還沒有帳號？": "No account yet?",
  "註冊": "Sign up",
  "免費試用 MeetNote AI": "Try MeetNote AI for free",
  "建立帳號": "Create account",
  "免費 30 分鐘音檔轉錄、3 次 AI 摘要": "Free 30 minutes of transcription and 3 AI summaries",
  "已有帳號？": "Already have an account?",
  "顯示名稱（選填）": "Display name (optional)",
  "密碼": "Password",
  "至少 6 個字元": "At least 6 characters",
  "處理中…": "Working...",
  "登入回應缺少 token，請重試": "Sign-in response is missing a token. Please try again.",
  "無法儲存 session，請重試": "Could not save the session. Please try again.",
  "未知錯誤": "Unknown error",
  "產品週會 · 2026/04/28": "Product weekly · 2026/04/28",
  "摘要": "Summary",
  "本週聚焦會員系統改版，確認三項主要 UX 調整與下一階段測試計畫。Beta 將於下週三上線，由 Kevin 統籌跨團隊溝通。": "This week focused on the membership-system redesign, confirmed three UX changes, and set the next testing plan. Beta launches next Wednesday, with Kevin coordinating across teams.",
  "行動項目": "Action items",
  "完成註冊流程 A/B 設計": "Finish signup-flow A/B design",
  "串好金流 webhook 簽名驗證": "Connect payment webhook signature verification",
  "安排跨組 demo 並收 feedback": "Schedule cross-team demo and collect feedback",
  "參與者": "Participants",
  "產品週會 · 04/28": "Product weekly · 04/28",
  "會員系統 demo 確認可行，本週聚焦註冊流程簡化、金流訂閱同步、行銷數據補齊三項。": "The membership demo is viable. This week focuses on simplifying signup, syncing subscriptions, and filling in funnel ROI data.",
  "串接訂閱狀態同步": "Sync subscription status",
  "補齊行銷漏斗 ROI 數字": "Fill in funnel ROI numbers",
  "複製": "Copy",
  "下載 Markdown": "Download Markdown",
  "下載 PDF": "Download PDF",
  "已複製到剪貼簿": "Copied to clipboard",
  "原始逐字稿": "Original transcript",
  "正在轉錄…": "Transcribing...",
  "逐字稿": "Transcript",
  "那我們看 demo 流程，會員系統現在跑得起來，但註冊頁我覺得還可以再簡化。": "Let’s review the demo flow. The membership system works, but I think the signup page can be simplified.",
  "我同意，有三個欄位其實非必填，可以收掉。我這週把 A/B 設計做出來。": "I agree. Three fields are not required and can be tucked away. I’ll prepare the A/B design this week.",
  "金流我已經串好了，webhook 驗證也通過了。下一步是做訂閱同步。": "Payments are connected, and webhook verification passed. Next is subscription sync.",
  "那 ROI 數字我來補上，下週三前給你們。": "I’ll fill in the ROI numbers and send them before next Wednesday.",
  "那我們先看會員系統 demo。Anna：我覺得註冊頁可以再簡化一點，現在欄位太多。Ryan：金流那邊我已經串好 webhook 簽名驗證了。Mei：那行銷漏斗的 ROI 還沒做，我下週做完。": "Let’s start with the membership-system demo. Anna: I think the signup page can be simpler because there are too many fields. Ryan: I already connected webhook signature verification for payments. Mei: The funnel ROI is not done yet; I’ll finish it next week.",
  "隱私": "Privacy",
  "隱私政策": "Privacy Policy",
  "服務條款": "Terms of Service",
  "條款": "Terms",
  "更新紀錄": "Changelog",
  "法律": "Legal",
  "最後更新：": "Last updated: ",
  "我們在做什麼": "What we are building",
  "每次發佈都更新在這。想看到的功能？歡迎跟我們說。": "Every release is listed here. Tell us what you want to see next.",
  "每次發佈都更新在這。": "Every release is listed here.",
  "想看到的功能？歡迎跟我們說。": "Tell us what you want to see next.",
  "新功能": "Feature",
  "改進": "Improvement",
  "修正": "Fix",
  "範例筆記頁、SEO 與 OG 預覽": "Example notes, SEO, and OG previews",
  "讓沒註冊的訪客也能看到 MeetNote 整理出的真實成品。": "Visitors can now see realistic output from MeetNote before signing up.",
  "新增 /example 範例筆記頁，三個情境：產品週會、客戶訪談、設計檢討": "Added /example with three scenarios: product weekly, customer interview, and design review",
  "加入 OG image / Twitter card / favicon": "Added OG image, Twitter card, and favicon",
  "加入 sitemap、robots、JSON-LD 結構化資料": "Added sitemap, robots, and JSON-LD structured data",
  "加入隱私／條款／更新紀錄連結": "Added Privacy, Terms, and Changelog links",
  "三段功能演示動畫": "Three feature demo animations",
  "用 GSAP + ScrollTrigger 在 landing 上呈現實際運作流程。": "Used GSAP + ScrollTrigger to show the workflow on the landing page.",
  "音波視覺化 + 進度條 + 逐字稿 typewriter 同步": "Waveform visualization, progress bar, and transcript typewriter sync",
  "原始逐字稿 → 摘要 / 行動項目逐條結構化": "Original transcript to structured summary and action items",
  "模擬游標點擊複製、下載 Markdown / PDF": "Simulated cursor clicks for copy and Markdown/PDF download",
  "視覺與品牌調整": "Visual and brand refinements",
  "從紫色漸層收斂為單色基調，加上微妙的進場動畫，避免孤字。": "Moved away from purple gradients to a monochrome base, added subtle entrance motion, and improved text wrapping.",
  "全站色系收斂為 zinc-900 + emerald accent": "Unified the palette around zinc-900 and emerald accents",
  "加 rise keyframes、尊重 prefers-reduced-motion": "Added rise keyframes and respected prefers-reduced-motion",
  "套用 text-wrap: pretty 處理中文段落，加 nowrap 鎖句尾標點": "Applied text-wrap: pretty and nowrap punctuation handling",
  "全部 emoji 換成 lucide-react icons": "Replaced emoji with lucide-react icons",
  "上線": "Launch",
  "把會議錄音變成可執行筆記的第一個版本。": "The first version of meeting audio to actionable notes.",
  "OpenAI Whisper 音檔轉錄（最大 25MB）": "OpenAI Whisper audio transcription up to 25MB",
  "Claude tool use 結構化摘要（摘要、行動項目、決策、參與者）": "Claude tool-use structured summaries with action items, decisions, and participants",
  "Insforge Auth + Database + file storage": "Insforge Auth, Database, and file storage",
  "Free / Pro 會員方案、用量門檻與付費解鎖": "Free/Pro plans, usage limits, and paid unlocks",
  "公開分享連結、繁體中文搜尋": "Public share links and Traditional Chinese search",
  "使用者選單": "User menu",
  "儀表板": "Dashboard",
  "筆記": "Notes",
  "設定": "Settings",
  "登出": "Sign out",
  "付款功能即將推出": "Payment is coming soon",
  "/月": "/month",
  "每月 $9 USD": "$9/month",
  "$9/月": "$9/month",
  "升級成功 — Pro 方案已啟用": "Upgrade successful — Pro is active",
  "本月你已解鎖 600 分鐘轉錄、無限摘要、分享連結。": "You now have 600 minutes of transcription, unlimited summaries, and share links this month.",
  "歡迎，": "Welcome,",
  "朋友": "friend",
  "目前方案：": "Current plan:",
  "新增筆記": "New note",
  "本月轉錄分鐘": "Transcription minutes this month",
  "本月 AI 摘要次數": "AI summaries this month",
  "我的筆記": "My notes",
  "列表、搜尋、分享": "List, search, and share",
  "帳號設定": "Account settings",
  "訂閱、付款、個人資料": "Subscription, billing, and profile",
  "上傳音檔或貼逐字稿": "Upload audio or paste a transcript",
  "無限": "Unlimited",
  "每月 600 分鐘 + 無限摘要 +": "600 min/month + unlimited summaries +",
  "分享連結": "share links",
  "查看方案": "View plans",
  "帳號": "Account",
  "使用者 ID": "User ID",
  "訂閱": "Subscription",
  "目前方案": "Current plan",
  "訂閱編號": "Subscription ID",
  "本期到期": "Current period ends",
  "如需取消訂閱或調整付款方式，請聯繫客服。": "To cancel or update billing, please contact support.",
  // notes pages
  "上傳會議錄音或直接貼上逐字稿，AI 會幫你整理成結構化筆記。": "Upload a meeting recording or paste a transcript. AI will turn it into a structured note.",
  "上傳音檔": "Upload audio",
  "貼逐字稿": "Paste transcript",
  "選擇音檔（.mp3 / .m4a / .wav，<25MB）": "Choose an audio file (.mp3 / .m4a / .wav, <25MB)",
  "OpenAI Whisper 自動轉錄": "Transcribed automatically by OpenAI Whisper",
  "開始轉錄與摘要": "Transcribe and summarize",
  "貼上會議逐字稿…（從 Google Meet、Zoom、Teams 都可以）": "Paste your meeting transcript... (Google Meet, Zoom, Teams all work)",
  "AI 摘要": "Summarize with AI",
  "上傳音檔…": "Uploading audio...",
  "AI 摘要中…": "Generating summary...",
  "轉錄失敗": "Transcription failed",
  "摘要失敗": "Summarization failed",
  "+ 新增": "+ New",
  "搜尋筆記內容…": "Search notes...",
  "還沒有筆記。": "No notes yet.",
  "建立第一份": "Create the first one",
  "← 返回筆記列表": "← Back to notes",
  "查看逐字稿": "View transcript",
  // share/[token] page
  "摘要尚未產生。": "Summary not generated yet.",
  "由": "Generated by",
  "產生 · 想自己用？": "· Want this for yourself?",
  // note-summary-view section titles
  "重點": "Key points",
  "決策": "Decisions",
  "負責人": "Owner",
  "任務": "Task",
  "期限": "Due",
  // share-button states
  "升級 Pro 以分享": "Upgrade to share",
  "已複製連結 ✓": "Link copied ✓",
  "複製分享連結": "Copy share link",
  "產生中…": "Generating...",
  "產生分享連結": "Create share link",
  // legal page section headings
  "我們蒐集哪些資料": "What we collect",
  "我們如何使用": "How we use it",
  "第三方服務": "Third-party services",
  "資料儲存與刪除": "Storage and deletion",
  "你的權利": "Your rights",
  "未成年使用者": "Minors",
  "政策變更": "Policy changes",
  "聯絡我們": "Contact",
  "服務內容": "Service scope",
  "方案與付款": "Plans and billing",
  "合理使用": "Acceptable use",
  "內容所有權": "Content ownership",
  "責任限制": "Limitation of liability",
  "服務變更與終止": "Service changes and termination",
  "條款變更": "Changes to these terms",
  "準據法": "Governing law",
  "聯絡": "Contact",
};

const enToZh = Object.fromEntries(
  Object.entries(zhToEn).map(([zh, en]) => [en, zh]),
);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) === "zh-TW" ? "zh-TW" : "en";
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function translateValue(value: string, locale: Locale) {
  const normalized = normalizeText(value);
  if (!normalized) return value;
  const translated = locale === "en" ? zhToEn[normalized] : enToZh[normalized];
  if (!translated || translated === normalized) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function applyTranslations(locale: Locale) {
  document.documentElement.lang = locale === "en" ? "en" : "zh-Hant";
  document.title = translateValue(document.title, locale);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, textarea, [data-i18n-ignore]")) {
        return NodeFilter.FILTER_REJECT;
      }
      return normalizeText(node.nodeValue ?? "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
  for (const node of textNodes) {
    const next = translateValue(node.nodeValue ?? "", locale);
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  for (const attr of ["placeholder", "aria-label", "title"] as const) {
    document.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((element) => {
      if (element.closest("[data-i18n-ignore]")) return;
      const value = element.getAttribute(attr);
      if (!value) return;
      const next = translateValue(value, locale);
      if (next !== value) element.setAttribute(attr, next);
    });
  }
}

export function LanguageRuntime() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    return readStoredLocale();
  });

  useEffect(() => {
    let frame = 0;
    const run = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => applyTranslations(locale));
    };

    window.localStorage.setItem(STORAGE_KEY, locale);
    run();

    const observer = new MutationObserver(run);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title"],
    });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [locale]);

  return (
    <div
      data-i18n-ignore
      suppressHydrationWarning
      className="fixed right-4 bottom-4 z-50 flex rounded-full border border-zinc-200 bg-white/95 p-1 text-xs font-semibold shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur"
      aria-label="Language switcher"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`rounded-full px-3 py-1.5 transition ${
          locale === "en" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh-TW")}
        aria-pressed={locale === "zh-TW"}
        className={`rounded-full px-3 py-1.5 transition ${
          locale === "zh-TW" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        繁中
      </button>
    </div>
  );
}
