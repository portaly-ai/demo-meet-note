import type { MeetingSummary } from "@/lib/ai/summarize";

export interface ExampleNote {
  slug: string;
  title: string;
  source: "audio" | "transcript";
  durationMin?: number;
  scenario: string;
  createdAt: string;
  summary: MeetingSummary;
  transcriptPreview?: string;
}

export const EXAMPLES: ExampleNote[] = [
  {
    slug: "product-weekly",
    title: "產品週會 · 會員系統 Beta 上線檢視",
    source: "audio",
    durationMin: 32,
    scenario: "產品團隊週會",
    createdAt: "2026-04-28T14:00:00+08:00",
    summary: {
      title: "產品週會 · 會員系統 Beta 上線檢視",
      summary:
        "本週聚焦會員系統改版三項主要 UX 調整與下一階段測試計畫。Beta 將於下週三上線，由 Kevin 統籌跨團隊溝通；金流 webhook 簽名驗證已完成，下一步是訂閱同步與行銷漏斗 ROI 數據。",
      key_points: [
        "註冊流程目前 7 個欄位，三個非必填可收掉",
        "Webhook 已通過 HMAC 簽名驗證測試（防 replay + 冪等）",
        "Beta 上線時間敲定 5/6（下週三），跨組 demo 排在 5/5",
        "行銷漏斗 ROI 數字尚未補齊，影響 Q2 報告",
      ],
      action_items: [
        { owner: "Anna", task: "完成註冊流程 A/B 設計（Variant A 簡化版）", due: "04/30" },
        { owner: "Ryan", task: "串接訂閱狀態同步（webhook + polling fallback）", due: "05/02" },
        { owner: "Mei", task: "補齊行銷漏斗 ROI 數字", due: "05/05" },
        { owner: "Kevin", task: "安排 5/5 跨組 demo 並收 feedback", due: "05/05" },
      ],
      decisions: [
        "Beta 不強制使用者立即升級，提供 2 週試用期",
        "註冊欄位精簡為 4 個（email、密碼、暱稱、來源）",
        "金流接第三方 SaaS 服務，不自建",
      ],
      participants: ["Kevin", "Anna", "Ryan", "Mei"],
    },
    transcriptPreview:
      "Kevin：那我們看 demo 流程，會員系統現在跑得起來，但註冊頁我覺得還可以再簡化…",
  },
  {
    slug: "user-interview",
    title: "客戶訪談 · SaaS 創辦人 V",
    source: "transcript",
    durationMin: 45,
    scenario: "用戶研究訪談",
    createdAt: "2026-04-25T10:30:00+08:00",
    summary: {
      title: "客戶訪談 · SaaS 創辦人 V",
      summary:
        "受訪者 V 是設計顧問，每週開 8 場以上會議，目前痛點是會議結束後整理筆記耗時 30-60 分鐘。願意付費的關鍵是「自動抽出客戶 quote」與「能直接生 proposal 段落」。",
      key_points: [
        "現用工具：Otter.ai 試用過但中文不準、人工整理回 Notion",
        "最痛：客戶訪談的 quote 找不到，要重聽錄音",
        "願付月費 $10-15 USD 區間",
        "團隊 3 人，希望能共享筆記但不要強制共用帳號",
        "個資擔憂中等，會議涉及客戶業務細節",
      ],
      action_items: [
        { owner: "PM", task: "設計「自動抽 quote」功能 spec，下週三前", due: "05/02" },
        { owner: "PM", task: "聯繫 V 進入 Beta 名單", due: "04/28" },
        { owner: "RD", task: "評估團隊共享筆記的權限模型", due: "05/10" },
      ],
      decisions: [
        "下版本優先做「Quote 抽取」而非「Slack 整合」",
        "Pro 方案改為 $12/月（V 反饋 $9 看起來太便宜不可信）",
      ],
      participants: ["V（受訪）", "PM", "Researcher"],
    },
    transcriptPreview:
      "V：我大概一週開 8 場以上會議，最痛苦的就是會議結束之後要整理筆記，那個時間真的很多…",
  },
  {
    slug: "design-review",
    title: "設計檢討 · Onboarding 流程 v3",
    source: "audio",
    durationMin: 28,
    scenario: "設計團隊檢討",
    createdAt: "2026-04-22T16:00:00+08:00",
    summary: {
      title: "設計檢討 · Onboarding 流程 v3",
      summary:
        "三位設計師檢討第三版 onboarding 流程，主要爭論點在於是否保留「示範筆記」的 step 2。最終決議移除，改用 dashboard 預設 demo 取代，避免強制流程。",
      key_points: [
        "v3 比 v2 流程縮短 40%（從 5 步驟 → 3 步驟）",
        "「示範筆記」step 在使用者測試裡 60% 跳過，價值低",
        "字級層級不一致（h2/h3 跳用），下版要重做 type system",
        "Empty state 圖示太多 emoji，改用 line icon 統一",
      ],
      action_items: [
        { owner: "Anna", task: "移除 step 2 示範筆記、改 dashboard 預設 demo", due: "04/26" },
        { owner: "Lucas", task: "重整 typography token，產 Figma library v2", due: "05/01" },
        { owner: "Mei", task: "替換所有 emoji 為 lucide icon", due: "04/30" },
      ],
      decisions: [
        "Onboarding 採用 v3 + dashboard 預設 demo 的組合",
        "Typography 不在這版改，獨立排到下個 sprint",
      ],
      participants: ["Anna（lead）", "Lucas", "Mei"],
    },
    transcriptPreview:
      "Anna：我覺得 v3 已經很順了，但 step 2 的示範筆記到底還要不要？我看 user testing 數據是 60% 跳過…",
  },
];

export function getExample(slug: string): ExampleNote | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}
