export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';
export type WCAGLevel = 'A' | 'AA' | 'AAA';

export interface ViolationNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

export interface ViolationAI {
  explanation: string;
  fix: string;
  wcagRef: string;
}

export interface Violation {
  id: string;
  description: string;
  impact: Severity;
  helpUrl: string;
  wcagLevel: WCAGLevel;
  nodes: ViolationNode[];
  ai?: ViolationAI;
}

export interface ScanResult {
  score: number;
  violations: Violation[];
  scannedUrl: string;
  timestamp: string;
}
