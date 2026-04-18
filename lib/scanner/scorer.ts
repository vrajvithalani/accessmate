import { SEVERITY_WEIGHTS } from '@/config/constants';
import type { Violation } from '@/types/scan';

export function computeScore(violations: Violation[]): number {
  const deduction = violations.reduce(
    (sum, v) => sum + (SEVERITY_WEIGHTS[v.impact] ?? 0),
    0
  );
  return Math.max(0, 100 - deduction);
}
