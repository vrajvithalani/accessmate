import type { Violation } from '@/types/scan'
import { buildViolationPrompt } from './prompts'

export interface AIExplanation {
  explanation: string
  fix: string
  wcagRef: string
}

interface GeminiPart {
  text: string
}

interface GeminiContent {
  parts: GeminiPart[]
}

interface GeminiCandidate {
  content: GeminiContent
}

interface GeminiResponse {
  candidates: GeminiCandidate[]
}

export async function explainViolation(
  violation: Violation,
  apiKey: string
): Promise<AIExplanation> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildViolationPrompt(violation) }] }],
        }),
        signal: controller.signal,
      }
    )

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`)
    }

    const data = (await res.json()) as GeminiResponse
    const responseText = data.candidates[0]?.content?.parts[0]?.text ?? ''
    return parseAIResponse(responseText, violation.helpUrl)
  } finally {
    clearTimeout(timeout)
  }
}

function parseAIResponse(rawText: string, helpUrl: string): AIExplanation {
  const sections = rawText.split(/\n(?=\d\.)/)
  const explanation = sections[0]?.trim() ?? rawText.slice(0, 300)
  const fix = sections[2]?.trim() ?? ''
  const wcagRef = sections[3]?.trim() ?? helpUrl
  return { explanation, fix, wcagRef }
}
