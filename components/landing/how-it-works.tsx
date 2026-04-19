import { Link2, Brain, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste URL",
    description:
      "Enter any public URL. We load the live page using a real browser — no static HTML parsing.",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analyzes",
    description:
      "axe-core scans for WCAG violations. Gemini AI reads each issue and explains it in plain English.",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Get Fixes",
    description:
      "Receive a scored report with copy-paste code fixes for every violation, ranked by severity.",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      className="bg-white px-4 py-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2
            id="how-it-works-heading"
            className="mb-3 text-3xl font-bold tracking-tight text-zinc-900"
          >
            How it works
          </h2>
          <p className="text-zinc-500">Three steps from URL to actionable fixes.</p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* connector lines on md+ */}
          <div
            aria-hidden="true"
            className="absolute top-10 left-1/3 right-1/3 hidden h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 md:block"
          />

          {steps.map(({ icon: Icon, step, title, description, iconColor, iconBg }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl ${iconBg} ring-4 ring-white`}
                >
                  <Icon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-zinc-400 ring-2 ring-zinc-100">
                  {step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
