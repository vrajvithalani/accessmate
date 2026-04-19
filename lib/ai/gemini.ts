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

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini timeout')), 10_000)
  )

  const result = await Promise.race([
    model.generateContent({
      contents: [{ role: 'user', parts: [{ text: buildViolationPrompt(violation) }] }],
    }),
    timeoutPromise,
  ])
  const responseText = result.response.text()
  return parseAIResponse(responseText, violation.helpUrl)
}

function parseAIResponse(rawText: string, helpUrl: string): AIExplanation {
  const sections = rawText.split(/\n(?=\d\.)/)
  const explanation = sections[0]?.trim() ?? rawText.slice(0, 300)
  const fix = sections[2]?.trim() ?? ''
  const wcagRef = sections[3]?.trim() ?? helpUrl
  return { explanation, fix, wcagRef }
}
