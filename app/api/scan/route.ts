export const runtime = 'edge'
import * as axe from 'axe-core'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { openPage } from '@/lib/scanner/browser'
import { runAxeScan } from '@/lib/scanner/axe-runner'
import { computeScore } from '@/lib/scanner/scorer'
import { formatDate } from '@/lib/utils'
import { explainViolationWithFallback } from '@/lib/ai/router'
import type { ScanResult, Violation } from '@/types/scan'

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  console.log('step1: parsed request JSON', body)

  if (
    typeof body !== 'object' ||
    body === null ||
    !('url' in body) ||
    typeof (body as Record<string, unknown>).url !== 'string'
  ) {
    return Response.json({ error: 'Missing required field: url' }, { status: 400 })
  }

  const rawUrl = (body as { url: string }).url.trim()
  console.log('step2: validated body, rawUrl =', rawUrl)

  let parsedUrl: URL
  try {
    parsedUrl = new URL(rawUrl)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol')
    }
  } catch {
    return Response.json({ error: 'Invalid URL — must be a full http/https URL' }, { status: 400 })
  }
  console.log('step3: parsed URL =', parsedUrl.href)

  const { env } = getCloudflareContext()
  console.log('step4: got Cloudflare context')

  // axe.source is a raw JS string bundled at build time — safe from esbuild mangling
  const axeScript: string = axe.source
  console.log('step5: loaded axe script, length =', axeScript.length)

  const handle = await openPage(parsedUrl.href, env.BROWSER).catch((err: unknown) => {
    console.error('Failed to open page:', err)
    return null
  })
  console.log('step6: openPage result =', handle ? 'ok' : 'null')

  if (!handle) {
    return Response.json({ error: 'Failed to load target URL' }, { status: 500 })
  }

  try {
    const scanPromise = (async () => {
      const rawViolations = await runAxeScan(handle, axeScript)
      console.log('step7: runAxeScan complete, violations count =', rawViolations.length)

      const violations: Violation[] = await Promise.all(
        rawViolations.map(async (v) => ({
          ...v,
          ai: await explainViolationWithFallback(v, env),
        }))
      )
      console.log('step8: AI explanations attached to all violations')

      const score = computeScore(violations)
      console.log('step9: score computed =', score)

      return { score, violations }
    })()

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Scan timeout after 25 seconds')), 25000)
    )

    const { score, violations } = await Promise.race([scanPromise, timeoutPromise])
    console.log('step10: scan race resolved, score =', score, 'violations =', violations.length)

    const result: ScanResult = {
      score,
      violations,
      scannedUrl: parsedUrl.href,
      timestamp: formatDate(),
    }
    console.log('step11: result object assembled, returning response')

    return Response.json(result)
  } catch (err) {
    console.error('Scan failed:', err)
    return Response.json({ error: 'Scan failed' }, { status: 500 })
  } finally {
    await handle.browser.close().catch(() => {})
    console.log('step12: browser closed')
  }
}
