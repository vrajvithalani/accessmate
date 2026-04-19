export const runtime = 'edge'

export async function GET(): Promise<Response> {
  const results: Record<string, string> = {}

  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    results.cloudflare = 'ok'
  } catch (e) {
    results.cloudflare = String(e)
  }

  try {
    const puppeteer = await import('@cloudflare/puppeteer')
    results.puppeteer = 'ok — keys: ' + Object.keys(puppeteer).join(', ')
  } catch (e) {
    results.puppeteer = String(e)
  }

  try {
    const scanner = await import('@/lib/scanner/browser')
    results.browser = 'ok'
  } catch (e) {
    results.browser = String(e)
  }

  try {
    const axeRunner = await import('@/lib/scanner/axe-runner')
    results.axeRunner = 'ok'
  } catch (e) {
    results.axeRunner = String(e)
  }

  try {
    const router = await import('@/lib/ai/router')
    results.aiRouter = 'ok'
  } catch (e) {
    results.aiRouter = String(e)
  }

  return Response.json(results)
}
