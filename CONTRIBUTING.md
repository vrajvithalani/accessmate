# Contributing to accessmate

## Prerequisites

- Node 20+
- pnpm (`npm i -g pnpm`)
- A Gemini API key and/or Groq API key (see `.env.local.example` once created)

## Local setup

```bash
git clone https://github.com/vrajvithalani/accessmate.git
cd accessmate
pnpm install
cp .env.local.example .env.local  # fill in your API keys
pnpm dev
```

## Code style

This project uses Prettier. Run `pnpm exec prettier --write .` before committing, or configure your editor to format on save.

Key conventions (see CLAUDE.md for full details):
- No `any` — use `unknown` + type guards
- Absolute imports via `@/` alias
- Server Components by default; `"use client"` only when needed

## Submitting a PR

1. Fork the repo and create a branch off `main`
2. Make your changes, ensuring `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` all pass
3. Open a PR using the template — fill in every checklist item
4. A maintainer will review within a few days

## Reporting bugs / requesting features

Use the GitHub issue templates:
- **Bug report** — steps to reproduce, expected vs actual behaviour, environment
- **Feature request** — problem statement, proposed solution, alternatives
