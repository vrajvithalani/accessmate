import { ExternalLink, GitBranch } from "lucide-react";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/vrajvithalani/accessmate",
    icon: GitBranch,
  },
  {
    label: "Report issue",
    href: "https://github.com/vrajvithalani/accessmate/issues",
    icon: ExternalLink,
  },
  {
    label: "WCAG docs",
    href: "https://www.w3.org/WAI/WCAG21/quickref/",
    icon: ExternalLink,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold text-zinc-700">AccessMate</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Built with Next.js · Cloudflare · Gemini AI
            </p>
          </div>

          <nav aria-label="Footer links">
            <ul className="flex flex-wrap justify-center gap-4 sm:justify-end">
              {links.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          © 2026 AccessMate. Open source under the MIT License.
        </p>
      </div>
    </footer>
  );
}
