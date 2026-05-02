@AGENTS.md

# MeetNote AI

## 概述
AI 會議筆記 SaaS 樣板（Next.js 16 + Insforge BaaS）。可 fork 的工程模板，不是真要販售的產品。

付費／金流模組已預埋：Plan tier（free/pro/team）、Quota 限制、Pricing UI、UpgradeButton、訂閱欄位、Quota email 模板都已就位，但**目前 payment provider 尚未串接**，UpgradeButton 為 disabled stub。實際 checkout + webhook 待選定 provider（Stripe / Portaly / 其他）後接回。

## 技術棧
- Next.js 16 (App Router) + React 19 + Tailwind v4
- Insforge（Auth + Database + server APIs）
- OpenAI Whisper（轉錄）+ Claude Sonnet 4.6（摘要，tool use）
- Resend + scheduled cron (GitHub Actions, system cron, or your platform's scheduler)
- Payment：模板已預埋，待選接

## 常用指令
- `npm run dev` — 啟動開發伺服器
- `npm run build` — 建置（Turbopack 預設）
- `npm run typecheck` — TypeScript 檢查
- `npm run test:insforge` — 可選：Insforge 串接 smoke test（需要 env）
- `npm run db:migrations:up` — 套用 Insforge migration
- `npm run db:tables` — 查看 Insforge tables

## 目錄結構
- `app/` — 頁面與 API routes（App Router）
- `lib/insforge/` — Insforge server/client helpers
- `lib/ai/` — Whisper + Claude 整合
- `lib/resend/` — Email 模板
- `lib/usage.ts` — Plan tier 與 quota 規則（鋪路保留）
- `lib/profile.ts` — profile helper / usage profile fallback
- `components/` — 共用 React 元件（含 `upgrade-button.tsx` 為 disabled stub）
- `migrations/` — Insforge SQL migration
- `proxy.ts` — Next.js 16 route protection

## 開發規範
- **Next.js 16 注意事項**：`middleware.ts` 改名 `proxy.ts`、函式 `proxy`。`cookies()`、`headers()`、`params`、`searchParams` 全部 async 必須 `await`。
- **環境變數讀取一律 `.trim()`**：見 `lib/env.ts`，避免 CLI 工具輸出帶換行符。
- **Payment webhook（未來串接時）三道驗證不能省**：簽名 / timestamp / 冪等都是必要，遇到驗證失敗只能 debug 不能繞過。
- **AI 摘要必須 tool use**：Claude 的 `summarizeMeeting` 用 tool_choice 強制 JSON。
- **DB schema 以 Insforge migration 為準**：`migrations/20260429071058_init.sql` 是目前 source of truth。複雜操作用 migration 裡的 RPC function。
- **API routes 都要 `export const dynamic = "force-dynamic"`**：Next 16 build 才不會卡在 page data collection。
- **模板交付不要包含私有設定**：不要 commit `.env.local`、`.vercel/`、`.insforge/`、`.mcp.json`、`node_modules/`。

## 部署
- 可部署到任何支援 Node.js 的環境（容器平台、雲端 VM、PaaS、自管主機等）
- 環境變數：見 `.env.example`（Insforge × 2、AI × 2、Resend × 2、Cron × 1；Payment 待串接時補上）
- 第一次：在 Insforge 套用 `migrations/20260429071058_init.sql`
- Cron：每小時對 `/api/cron/email-sequence` 發 GET 請求（帶 `Authorization: Bearer <CRON_SECRET>` header）；可用 GitHub Actions、系統 cron、或平台排程器配置。若使用 Vercel，`vercel.json` 已提供對應設定範例（quota 警告/超額信目前以 `PAYMENT_ENABLED=false` 暫關，待 payment 串好恢復）

## 串接 Payment 時的 checklist
1. 新增 `app/api/checkout/route.ts`（呼叫 provider 建立 checkout session，回 `paymentUrl`）
2. 新增 `app/api/webhooks/<provider>/route.ts`（驗簽 + timestamp + 冪等三道，使用 `webhook_events` 表去重）
3. 把 `components/upgrade-button.tsx` 的 `disabled` 拿掉、補回 `fetch("/api/checkout")` 邏輯
4. `app/api/cron/email-sequence/route.ts` 把 `PAYMENT_ENABLED` 改 `true`（或讀 env）
5. 補上對應的 `*_API_KEY`、`*_PRODUCT_ID`、`*_CALLBACK_SECRET` 等 env 到 `lib/env.ts` 與 `.env.example`
