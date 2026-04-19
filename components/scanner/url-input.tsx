"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlInputProps {
  onScan: (url: string) => void;
  disabled?: boolean;
}

export function UrlInput({ onScan, disabled }: UrlInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function validate(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return "Enter a URL";
    try {
      const u = new URL(trimmed);
      if (u.protocol !== "http:" && u.protocol !== "https:") return "Must be an http/https URL";
      return null;
    } catch {
      return "Invalid URL";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = validate(value);
    if (msg) { setError(msg); return; }
    setError("");
    onScan(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          disabled={disabled}
          className="flex-1"
          aria-label="Website URL to scan"
        />
        <Button type="submit" disabled={disabled || !value.trim()}>
          Scan
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
