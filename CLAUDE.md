# accessmate

AI-powered WCAG 2.1/2.2 accessibility auditor. Scan any URL, get plain-English violation explanations + ready-to-use code fixes.

**Deploy target:** Cloudflare Pages → `accessmate.vrajvithalani.com`

## Stack

| Layer     | Choice                                        |
| --------- | --------------------------------------------- |
| Framework | Next.js 15 App Router, TypeScript strict      |
| Styling   | Tailwind v4, shadcn/ui (`src/components/ui/`) |
| AI        | Gemini (primary) → Groq (fallback)            |
| Scanning  | Cloudflare Browser Rendering + axe-core       |
| Storage   | Cloudflare KV (scan cache/results)            |
| PDF       | jsPDF (client-side)                           |
| Deploy    | `@opennextjs/cloudflare` adapter              |

## Env vars

| Var               | Source                                       |
| ----------------- | -------------------------------------------- |
| `GEMINI_API_KEY`  | aistudio.google.com                          |
| `GROQ_API_KEY`    | console.groq.com                             |
| `BROWSER` binding | Cloudflare Browser Rendering (wrangler.toml) |
| `KV` binding      | Cloudflare KV namespace (wrangler.toml)      |

## Commands

```
pnpm dev        # local dev (next dev)
pnpm build      # next build
pnpm deploy     # opennextjs build + wrangler deploy
pnpm lint       # eslint
```

## Conventions

- **No `any`** — use `unknown` + type guards
- Absolute imports via `@/` alias (tsconfig paths)
- Server Components by default; `"use client"` only for interactivity/browser APIs
- API routes in `src/app/api/` use Route Handlers (not pages/api)
- AI calls go through `src/lib/ai/router.ts` (handles Gemini→Groq fallback)
- KV access only via `src/lib/cache/kv.ts`

## Structure (key paths)

```
src/
  app/
    page.tsx                  # landing
    scan/[id]/page.tsx        # results page
    api/scan/route.ts         # POST: trigger scan
    api/report/[id]/route.ts  # GET: fetch cached report
  components/
    ui/          # shadcn primitives
    landing/     # hero, features, CTA
    scanner/     # URL input, progress
    report/      # violation cards, score, PDF button
    shared/      # nav, footer, etc.
  lib/
    scanner/
      browser.ts   # Cloudflare Browser Rendering client
      axe-runner.ts
      scorer.ts    # WCAG score calc
    ai/
      gemini.ts
      groq.ts
      router.ts    # primary→fallback logic
      prompts.ts
    pdf/generate.ts
    cache/kv.ts
  types/
    scan.ts      # ScanResult, Violation, Score types
    env.d.ts     # Cloudflare bindings types
  config/
    site.ts      # domain, og, metadata constants
    constants.ts # WCAG levels, severity labels
```

## Rules

- Ask before editing if scope is unclear
- Prefer small focused edits over sweeping rewrites
- Never commit `.env.local` or secrets
- Keep Cloudflare bindings typed in `env.d.ts`
