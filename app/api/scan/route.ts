import { getCloudflareContext } from '@opennextjs/cloudflare';
import { openPage } from '@/lib/scanner/browser';
import { runAxeScan } from '@/lib/scanner/axe-runner';
import { computeScore } from '@/lib/scanner/scorer';
import { formatDate } from '@/lib/utils';
import { explainViolationWithFallback } from '@/lib/ai/router';
import type { ScanResult, Violation } from '@/types/scan';

const AXE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.11.3/axe.min.js';

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || !('url' in body) || typeof (body as Record<string, unknown>).url !== 'string') {
    return Response.json({ error: 'Missing required field: url' }, { status: 400 });
  }

  const rawUrl = (body as { url: string }).url.trim();

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
  } catch {
    return Response.json({ error: 'Invalid URL — must be a full http/https URL' }, { status: 400 });
  }

  const { env } = getCloudflareContext();

  let axeScript: string;
  try {
    const res = await fetch(AXE_CDN);
    if (!res.ok) throw new Error(`CDN fetch failed: ${res.status}`);
    axeScript = await res.text();
  } catch (err) {
    console.error('Failed to load axe-core script:', err);
    return Response.json({ error: 'Scanner unavailable' }, { status: 500 });
  }

  const handle = await openPage(parsedUrl.href, env.BROWSER).catch((err: unknown) => {
    console.error('Failed to open page:', err);
    return null;
  });

  if (!handle) {
    return Response.json({ error: 'Failed to load target URL' }, { status: 500 });
  }

  try {
    const rawViolations = await runAxeScan(handle, axeScript);
    const violations: Violation[] = await Promise.all(
      rawViolations.map(async (v) => ({
        ...v,
        ai: await explainViolationWithFallback(v, env),
      })),
    );
    const score = computeScore(violations);

    const result: ScanResult = {
      score,
      violations,
      scannedUrl: parsedUrl.href,
      timestamp: formatDate(),
    };

    return Response.json(result);
  } catch (err) {
    console.error('Scan failed:', err);
    return Response.json({ error: 'Scan failed' }, { status: 500 });
  } finally {
    await handle.browser.close().catch(() => {});
  }
}
