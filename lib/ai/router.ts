import type { Violation } from '@/types/scan';
import type { AIExplanation } from './gemini';
import { explainViolation as geminiExplain } from './gemini';
import { explainViolation as groqExplain } from './groq';

export async function explainViolationWithFallback(
  violation: Violation,
  env: CloudflareEnv,
): Promise<AIExplanation> {
  try {
    const result = await geminiExplain(violation, env.GEMINI_API_KEY);
    console.log('[ai] used gemini for', violation.id);
    return result;
  } catch (geminiErr) {
    console.warn('[ai] gemini failed, trying groq:', geminiErr);
    try {
      const result = await groqExplain(violation, env.GROQ_API_KEY);
      console.log('[ai] used groq for', violation.id);
      return result;
    } catch (groqErr) {
      console.error('[ai] groq also failed:', groqErr);
      return {
        explanation: 'AI explanation unavailable',
        fix: 'See ' + violation.helpUrl,
        wcagRef: violation.helpUrl,
      };
    }
  }
}
