import type { Browser, Page } from '@cloudflare/puppeteer'

const PAGE_TIMEOUT = 30_000

export interface PageHandle {
  browser: Browser
  page: Page
}

export async function openPage(url: string, browser: Fetcher): Promise<PageHandle> {
  // Dynamic import avoids esbuild CJS/ESM interop issues with @cloudflare/puppeteer
  const { default: puppeteer } = await import('@cloudflare/puppeteer')
  const b = await puppeteer.launch(browser)
  const page = await b.newPage()
  page.setDefaultTimeout(PAGE_TIMEOUT)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT })
  return { browser: b, page }
}
