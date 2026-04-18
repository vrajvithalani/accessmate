import type { Violation } from '@/types/scan';
import { buildViolationPrompt } from './prompts';
import type { AIExplanation } from './gemini';

interface GroqMessage {
  role: string;
  content: string;
}

interface GroqChoice {
  message: GroqMessage;
}

interface GroqResponse {
  choices: GroqChoice[];
}

export async function explainViolation(violation: Violation, apiKey: string): Promise<AIExplanation> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: buildViolationPrompt(violation) }],
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status}`);
    }

    const data = (await res.json()) as GroqResponse;
    const text = data.choices[0]?.message?.content ?? '';
    return parseAIResponse(text, violation.helpUrl);
  } finally {
    clearTimeout(timeout);
  }
}

function parseAIResponse(text: string, helpUrl: string): AIExplanation {
  const sections = text.split(/\n(?=\d\.)/);
  const explanation = sections[0]?.trim() ?? text.slice(0, 300);
  const fix = sections[2]?.trim() ?? '';
  const wcagRef = sections[3]?.trim() ?? helpUrl;
  return { explanation, fix, wcagRef };
}
