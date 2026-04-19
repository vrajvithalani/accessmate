import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-zinc-900 transition-opacity hover:opacity-80"
          aria-label="AccessMate home"
        >
          <ShieldCheck className="h-5 w-5 text-blue-600" aria-hidden="true" />
          AccessMate
        </Link>
      </div>
    </header>
  );
}
