import type { Violation } from '@/types/scan'
import { buildViolationPrompt } from './prompts'
import type { AIExplanation } from './gemini'

interface GroqMessage {
  role: string
  content: string
}

interface GroqChoice {
  message: GroqMessage
}

interface GroqResponse {
  choices: GroqChoice[]
}

export async function explainViolation(
  violation: Violation,
  apiKey: string
): Promise<AIExplanation> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: buildViolationPrompt(violation) }],
        max_tokens: 1024,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status}`)
    }

    const data = (await res.json()) as GroqResponse
    const responseText = data.choices[0]?.message?.content ?? ''
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
