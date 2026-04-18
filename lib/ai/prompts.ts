import type { Violation } from '@/types/scan';

export function buildViolationPrompt(violation: Violation): string {
  return `You are an accessibility expert. Explain this WCAG violation in plain English for a developer.

Violation: ${violation.description}
Impact: ${violation.impact}
Help URL: ${violation.helpUrl}

Provide:
1. What's wrong (2-3 sentences, non-technical language)
2. Why it matters for users with disabilities
3. Exact code fix with before/after examples
4. WCAG guideline reference

Be concise. Use markdown for code blocks.`;
}
