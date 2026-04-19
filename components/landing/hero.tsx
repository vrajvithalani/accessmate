"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function Hero() {
  function scrollToScanner() {
    document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/60 to-violet-50/40 px-4 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl"
      />

      <div className="animate-fade-in-up relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          WCAG 2.1 / 2.2 Compliance Reports
        </div>

        <h1 className="mb-6 bg-gradient-to-br from-zinc-900 via-blue-900 to-violet-900 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
          Scan. Understand.
          <br />
          Fix.
        </h1>

        <p className="mx-auto mb-3 max-w-2xl text-lg text-zinc-600 sm:text-xl">
          AI-powered accessibility auditor for{" "}
          <span className="font-semibold text-blue-700">WCAG 2.1/2.2 compliance</span>.
          Paste any URL and get plain-English explanations with ready-to-use code fixes.
        </p>

        <p className="mb-10 text-sm text-zinc-400">
          No sign-up required · Free · Powered by axe-core + Gemini AI
        </p>

        <Button
          onClick={scrollToScanner}
          className="h-12 gap-2 px-8 text-base"
        >
          Scan a URL now
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
