"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MESSAGES = [
  "Loading page in browser",
  "Running axe-core accessibility checks",
  "Analyzing violations with AI",
  "Generating code fixes",
  "Building your report",
];

interface ScanProgressProps {
  url: string;
}

export function ScanProgress({ url }: ScanProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 12000);
    return () => clearInterval(msgTimer);
  }, []);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-label="Scanning in progress"
    >
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-zinc-700">
            Scanning{" "}
            <span className="font-mono text-xs text-zinc-400">
              {url.length > 50 ? url.slice(0, 47) + "…" : url}
            </span>
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {MESSAGES[messageIndex]}
            <span aria-hidden="true">{dots}</span>
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            This usually takes 30–60 seconds
          </p>
        </div>
      </div>

      {/* skeleton preview of results */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-100 bg-white p-6">
        <div className="flex items-center justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
