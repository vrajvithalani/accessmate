import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Violation } from '@/types/scan'
import { buildViolationPrompt } from './prompts'

export interface AIExplanation {
  explanation: string
  fix: string
  wcagRef: string
}

export async function explainViolation(
  violation: Violation,
  apiKey: string
): Promise<AIExplanation> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: buildViolationPrompt(violation) }] }],
    })
    const responseText = result.response.text()
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
