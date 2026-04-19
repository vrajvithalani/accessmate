# AccessMate

AI-powered web accessibility auditor — scan any URL for WCAG 2.1/2.2 violations and get plain-English explanations with ready-to-use code fixes.

![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript) ![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-orange?logo=cloudflare) ![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?logo=google)

**Live:** [accessmate.vrajvithalani.com](https://accessmate.vrajvithalani.com)

## Features

- **WCAG 2.1/2.2 scanning** — full axe-core ruleset, categorised by severity (critical → minor)
- **AI explanations** — Gemini primary, Groq fallback; plain-English "why it matters" for every violation
- **Code fixes** — ready-to-paste corrected HTML/CSS snippets per issue
- **Accessibility score** — 0–100 score with grade badge based on violation severity
- **PDF report** — one-click client-side PDF export (no server round-trip)
- **Instant & free** — no signup, no rate limit for personal use

## How It Works

1. **Paste a URL** — enter any public website URL in the scanner
2. **Browser renders it** — Cloudflare Browser Rendering loads the page with full JS execution
3. **axe-core audits** — WCAG rules run against the live DOM
4. **AI explains** — Gemini reads each violation and writes a plain-English explanation + code fix
5. **Results appear** — scored report with filterable violation cards; download as PDF

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router, TypeScript strict |
| Styling | Tailwind v4, shadcn/ui |
| AI | Gemini (primary) → Groq (fallback) |
| Scanning | Cloudflare Browser Rendering + axe-core |
| Storage | Cloudflare KV (scan cache) |
| PDF | jsPDF (client-side) |
| Deploy | Cloudflare Pages + Workers |

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # fill in API keys
pnpm dev
```

See [CLAUDE.md](CLAUDE.md) for full env vars, commands, and conventions.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
