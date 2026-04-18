import type { Severity } from '@/types/scan';

export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 10,
  serious: 5,
  moderate: 2,
  minor: 1,
};

export const CACHE_TTL = 60 * 60 * 24; // 24h in seconds

export const RATE_LIMIT = {
  maxRequests: 10,
  windowSeconds: 60,
} as const;
