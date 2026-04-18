# AccessMate

AI-powered web accessibility auditor — scan any URL for WCAG 2.1/2.2 violations and get plain-English explanations with ready-to-use code fixes.

![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript) ![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-orange?logo=cloudflare) ![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?logo=google)

**Live demo:** accessmate.vrajvithalani.com _(coming soon)_

## Stack

- **Framework:** Next.js 15 App Router, TypeScript strict
- **AI:** Gemini (primary) → Groq (fallback)
- **Scanning:** Cloudflare Browser Rendering + axe-core
- **Deploy:** Cloudflare Pages + Workers + KV

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
