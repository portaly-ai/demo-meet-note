# MeetNote AI

MeetNote AI is a forkable SaaS template for an AI meeting-notes product on Next.js 16 + Insforge. Authentication, database, usage limits, AI workflows, lifecycle email, and the entire paid-tier UI surface are wired together so engineers can fork the project and replace the product surface with their own idea.

This repository is intended as a template, not a real product being sold.

> **Payment status**: Plan tier, quota schema, pricing UI, UpgradeButton shell, and email templates are all paved in but **no payment provider is wired right now**. UpgradeButton is a disabled stub showing "付款功能即將推出". Hook in Stripe / Portaly / any provider when ready — see [Wiring a Payment Provider](#wiring-a-payment-provider) below.

## What Is Included

| Area | Implementation |
| --- | --- |
| App framework | Next.js 16 App Router, React 19, Tailwind CSS v4 |
| Backend-as-a-service | Insforge Auth, Database, Storage-compatible schema, server APIs |
| AI transcription | OpenAI Whisper |
| AI summarization | Anthropic Claude structured output |
| Paid-tier scaffold | Plan column (free/pro/team), per-plan quota, pricing page, upgrade UI, quota emails (provider TBD) |
| Email automation | Resend templates plus Vercel Cron |
| SEO/legal | Metadata, sitemap, robots, OG image, changelog, privacy, terms |
| Demo UI | English-first marketing site with Traditional Chinese toggle |

## Core Demo Flows

1. Sign up or sign in with Insforge Auth.
2. Upload audio or paste a transcript.
3. Generate a structured meeting summary.
4. Track free-plan usage limits (30 min/month transcription, 3 summaries/month, no share).
5. Hit the upgrade CTA — currently a disabled stub until a payment provider is wired.
6. Run the hourly email sequence cron when Resend is configured (quota emails are gated off until payment is back).

## Required Services

Minimum local app:

- Insforge project
- OpenAI API key for audio transcription
- Anthropic API key for summaries

Full SaaS demo:

- Resend for lifecycle emails
- Vercel for deployment and cron

Optional agent workflow:

- Insforge MCP

These MCP/agent tools are not required for the app to run.

## Environment Variables

Copy `.env.example` to `.env.local` and fill the values you need.

```bash
cp .env.example .env.local
```

Required for the app shell and auth:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_INSFORGE_URL=https://YOUR-APPKEY.us-east.insforge.app
INSFORGE_API_KEY=
```

Required for AI features:

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

Optional email automation:

```env
RESEND_API_KEY=
RESEND_FROM="MeetNote AI <hello@meetnote.ai>"
CRON_SECRET=
```

Payment provider envs are intentionally absent — add them when you wire one in.

## Setup

Install dependencies:

```bash
npm install
```

Use Node.js `20.19.0` or newer. Node `22.13.0+` also works well with the current ESLint/Next.js toolchain.

Create an Insforge project, then apply the schema in:

```text
migrations/20260429071058_init.sql
```

You can use the Insforge dashboard SQL editor or the Insforge CLI. The package includes helper commands:

```bash
npm run db:migrations:list
npm run db:migrations:up
npm run db:tables
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run the checks that do not require external credentials:

```bash
npm run typecheck
npm run build
```

Optional Insforge smoke test:

```bash
npm run test:insforge
```

The Insforge smoke test requires:

```env
NEXT_PUBLIC_INSFORGE_URL=
INSFORGE_API_KEY=
```

It creates a temporary test user and verifies tables, auth, profile trigger behavior, and RPC usage counters. Review the script before running it against production data.

## File Map

```text
app/
  page.tsx                          Marketing homepage
  sign-in/                          Insforge sign-in page
  sign-up/                          Insforge sign-up page
  dashboard/                        Usage dashboard
  notes/                            Notes list, new note, note detail
  pricing/                          Pricing page (UpgradeButton currently disabled)
  settings/                         Subscription settings shell
  share/[token]/                    Public note sharing
  api/
    auth/session/                   Writes Insforge access token to httpOnly cookie
    transcribe/                     OpenAI Whisper endpoint
    summarize/                      Anthropic summary endpoint
    notes/[id]/share/               Generate share token (Pro-gated)
    email/welcome/                  Optional welcome email endpoint
    cron/email-sequence/            Hourly Resend lifecycle email cron

components/
  auth/                             Auth shell and form
  site/                             Marketing UI and GSAP demo animations
  upgrade-button.tsx                Disabled stub — re-enable when payment provider is wired
  language-runtime.tsx              English-first runtime translation toggle

lib/
  ai/                               OpenAI and Anthropic integrations
  insforge/                         Server/client Insforge helpers
  resend/                           Email client and templates
  env.ts                            Central environment variable reader
  usage.ts                          Per-plan usage rules (free/pro/team)

migrations/
  20260429071058_init.sql           Insforge database schema (incl. plan, subscription, webhook_events)

scripts/
  insforge-smoke-test.mjs           Optional Insforge integration smoke test
```

## Wiring a Payment Provider

The paid-tier scaffold is intact. To make upgrades actually work, you need to fill in the vendor-specific glue:

1. **Add `app/api/checkout/route.ts`** — POST endpoint that calls your provider's API to create a checkout session and returns `{ paymentUrl }`. Read the user from Insforge auth, look up their profile, and pass `plan: "pro"` (or whatever).
2. **Add `app/api/webhooks/<provider>/route.ts`** — receive payment-success callbacks. **Three guards required**: HMAC signature verify, timestamp freshness window, and idempotency (use the `webhook_events` table — `(id, source)` keys with `ON CONFLICT DO NOTHING`). On success, `update profiles set plan='pro', subscription_id=..., current_period_end=...`.
3. **Re-enable [components/upgrade-button.tsx](components/upgrade-button.tsx)** — replace the disabled stub with the original `fetch("/api/checkout")` flow and `window.location` redirect.
4. **Flip the cron flag** — set `PAYMENT_ENABLED = true` in [app/api/cron/email-sequence/route.ts](app/api/cron/email-sequence/route.ts) so quota warning / exceeded emails resume.
5. **Add provider env vars** to `lib/env.ts` and `.env.example` (`*_API_KEY`, `*_CALLBACK_SECRET`, `*_PRODUCT_ID`, etc.).
6. **Update [proxy.ts](proxy.ts)** matcher if your webhook path needs to bypass auth (currently `api/webhooks` is already excluded).

The `webhook_events` table, `plan` / `subscription_id` / `current_period_end` columns on `profiles`, `quotaWarning` / `quotaExceededOffer` / `upgradedThankYou` email templates, the pricing page, and the upgrade banners all stay put — wiring a provider is mostly drop-in.

## Template Handoff Notes

Before handing this repository to another engineer:

1. Do not include `.env.local`, `.vercel/`, `.insforge/`, `node_modules/`, or local MCP config.
2. Keep `.env.example` accurate and free of real credentials.
3. Ask the engineer to create their own Insforge, OpenAI, Anthropic, and Resend credentials.
4. If they want billing, follow the [Wiring a Payment Provider](#wiring-a-payment-provider) checklist.
5. If they do not need email automation, they can leave Resend variables empty and disable the Vercel cron.
6. If they fork for a different product, replace demo copy, example notes, pricing, email templates, metadata, and legal pages.
7. Run `npm run typecheck` and `npm run build` before deploying.

## Optional Integrations

The following are helpful during development but are not required for a forked app:

- Insforge MCP
- Agent-specific instruction files outside this repo

## Known Limitations

- Audio upload is limited to 25 MB.
- Audio files are sent directly for transcription and are not persisted for replay.
- Payment provider is not wired (UpgradeButton is a disabled stub).
- Cancel/resume subscription flows are not yet implemented.
- Free-plan usage reset is intentionally simple for demo purposes.
- Email deliverability depends on Resend domain verification.

## License

MIT. Use it as a starting point for your own SaaS template or demo.
