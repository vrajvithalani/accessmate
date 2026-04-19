import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Brain, Code2, Zap } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Instant WCAG Scans",
    description:
      "Powered by axe-core, the industry-standard accessibility engine. Comprehensive WCAG 2.1/2.2 reports in seconds.",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    icon: Brain,
    title: "AI Explanations",
    description:
      "Plain English, not jargon. Gemini AI translates complex accessibility requirements into clear, actionable insights.",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
  },
  {
    icon: Code2,
    title: "Ready-to-Use Fixes",
    description:
      "Copy-paste code solutions for every violation. Exact snippets to fix each issue — no guessing required.",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    icon: Zap,
    title: "Free & Fast",
    description:
      "No signup, no credit card, no limits. Full accessibility reports in 30–60 seconds, completely free.",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
] as const;

export function Features() {
  return (
    <section
      className="bg-zinc-50/50 px-4 py-20"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2
            id="features-heading"
            className="mb-3 text-3xl font-bold tracking-tight text-zinc-900"
          >
            Everything you need to fix accessibility
          </h2>
          <p className="mx-auto max-w-xl text-zinc-500">
            From detection to explanation to fix — the complete accessibility
            workflow in one tool.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, iconColor, iconBg }) => (
            <Card
              key={title}
              className="border-transparent shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div
                  className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
                </div>
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
