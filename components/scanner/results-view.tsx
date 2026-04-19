"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanResult, Violation, Severity } from "@/types/scan";

// ── Score circle ──────────────────────────────────────────────────────────────

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreStroke(score: number) {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

function scoreText(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Good";
  if (score >= 50) return "Needs work";
  return "Poor";
}

interface ScoreCircleProps {
  score: number;
}

function ScoreCircle({ score }: ScoreCircleProps) {
  const [display, setDisplay] = useState(0);
  const [offset, setOffset] = useState(CIRCUMFERENCE);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * score));
      setOffset(CIRCUMFERENCE * (1 - eased * score / 100));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="60" cy="60" r={RADIUS}
            strokeWidth="10"
            fill="none"
            className="stroke-zinc-100"
          />
          <circle
            cx="60" cy="60" r={RADIUS}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={cn("transition-none", scoreStroke(score))}
          />
        </svg>
        <div className="relative text-center">
          <span className={cn("text-4xl font-extrabold tabular-nums", scoreText(score))}>
            {display}
          </span>
          <span className="block text-xs font-medium text-zinc-400">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn("text-sm font-semibold", scoreText(score))}>{scoreLabel(score)}</p>
        <p className="text-xs text-zinc-400">Accessibility score</p>
      </div>
    </div>
  );
}

// ── Severity config ───────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, { label: string; badgeCls: string; headerCls: string }> = {
  critical: {
    label: "Critical",
    badgeCls: "bg-red-100 text-red-700 border-red-200",
    headerCls: "text-red-700",
  },
  serious: {
    label: "Serious",
    badgeCls: "bg-orange-100 text-orange-700 border-orange-200",
    headerCls: "text-orange-700",
  },
  moderate: {
    label: "Moderate",
    badgeCls: "bg-amber-100 text-amber-700 border-amber-200",
    headerCls: "text-amber-700",
  },
  minor: {
    label: "Minor",
    badgeCls: "bg-zinc-100 text-zinc-600 border-zinc-200",
    headerCls: "text-zinc-600",
  },
};

const SEVERITY_ORDER: Severity[] = ["critical", "serious", "moderate", "minor"];

// ── Violation card ────────────────────────────────────────────────────────────

function ViolationCard({ v }: { v: Violation }) {
  const [open, setOpen] = useState(false);
  const cfg = SEVERITY_CONFIG[v.impact];

  return (
    <Card className="border-zinc-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-zinc-900">
              {v.description}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">
              WCAG {v.wcagLevel} · {v.nodes.length} element
              {v.nodes.length !== 1 ? "s" : ""} affected
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              cfg.badgeCls,
            )}
          >
            {cfg.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 pt-0">
        {(v.ai?.explanation || v.ai?.fix) && (
          <>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-left text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              aria-expanded={open}
            >
              <span>{open ? "Hide" : "Show"} AI explanation & fix</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-3 pb-1">
                  {v.ai?.explanation && (
                    <div className="rounded-lg bg-blue-50 px-3 py-2.5">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                        Explanation
                      </p>
                      <p className="text-sm leading-relaxed text-zinc-700">
                        {v.ai.explanation}
                      </p>
                    </div>
                  )}
                  {v.ai?.fix && (
                    <div className="rounded-lg bg-zinc-900 px-3 py-2.5">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                        Code fix
                      </p>
                      <pre className="overflow-x-auto text-xs leading-relaxed text-zinc-100">
                        <code>{v.ai.fix}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <a
          href={v.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-800"
        >
          Learn more
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </CardContent>
    </Card>
  );
}

// ── ResultsView ───────────────────────────────────────────────────────────────

interface ResultsViewProps {
  result: ScanResult;
}

export function ResultsView({ result }: ResultsViewProps) {
  const grouped = SEVERITY_ORDER.reduce<Record<Severity, Violation[]>>(
    (acc, sev) => {
      acc[sev] = result.violations.filter((v) => v.impact === sev);
      return acc;
    },
    { critical: [], serious: [], moderate: [], minor: [] },
  );

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      {/* Score */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-100 bg-white px-6 py-8 shadow-sm">
        <ScoreCircle score={result.score} />
        <div className="h-px w-full bg-zinc-100" />
        <div className="flex flex-wrap justify-center gap-6 text-center">
          {SEVERITY_ORDER.map((sev) => {
            const count = grouped[sev].length;
            if (count === 0) return null;
            return (
              <div key={sev}>
                <p className={cn("text-lg font-bold", SEVERITY_CONFIG[sev].headerCls)}>
                  {count}
                </p>
                <p className="text-xs capitalize text-zinc-400">{sev}</p>
              </div>
            );
          })}
          {result.violations.length === 0 && (
            <p className="text-sm font-medium text-emerald-600">
              ✓ No violations found
            </p>
          )}
        </div>
      </div>

      {/* Violations by severity */}
      {SEVERITY_ORDER.map((sev) =>
        grouped[sev].length > 0 ? (
          <section key={sev} aria-labelledby={`severity-${sev}`}>
            <h2
              id={`severity-${sev}`}
              className={cn(
                "mb-3 flex items-center gap-2 text-sm font-semibold",
                SEVERITY_CONFIG[sev].headerCls,
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  SEVERITY_CONFIG[sev].badgeCls,
                )}
              >
                {grouped[sev].length}
              </span>
              {SEVERITY_CONFIG[sev].label} violations
            </h2>
            <div className="flex flex-col gap-3">
              {grouped[sev].map((v) => (
                <ViolationCard key={v.id} v={v} />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}
