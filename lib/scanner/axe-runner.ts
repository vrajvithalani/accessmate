import type { PageHandle } from './browser';
import type { Violation, ViolationNode, Severity, WCAGLevel } from '@/types/scan';

interface AxeNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

interface AxeViolation {
  id: string;
  description: string;
  impact: string | null;
  helpUrl: string;
  tags: string[];
  nodes: AxeNode[];
}

interface AxeResults {
  violations: AxeViolation[];
}

function resolveWcagLevel(tags: string[]): WCAGLevel {
  if (tags.some(tag => tag.includes('aaa'))) return 'AAA';
  if (tags.some(tag => tag.includes('aa'))) return 'AA';
  return 'A';
}

function toSeverity(impact: string | null): Severity {
  if (impact === 'critical' || impact === 'serious' || impact === 'moderate' || impact === 'minor') {
    return impact;
  }
  return 'minor';
}

export async function runAxeScan(handle: PageHandle, axeScript: string): Promise<Violation[]> {
  const { page } = handle;

  await page.evaluate(axeScript);

  const results: AxeResults = await page.evaluate(async () => {
    return await (window as unknown as { axe: { run: (opts: unknown) => Promise<AxeResults> } }).axe.run({
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    });
  });

  return results.violations.map((v): Violation => ({
    id: v.id,
    description: v.description,
    impact: toSeverity(v.impact),
    helpUrl: v.helpUrl,
    wcagLevel: resolveWcagLevel(v.tags),
    nodes: v.nodes.map((n): ViolationNode => ({
      html: n.html,
      target: n.target,
      failureSummary: n.failureSummary,
    })),
  }));
}
