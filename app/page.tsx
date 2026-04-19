'use client'

import { useState } from 'react'
import { Navbar } from '@/components/shared/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Footer } from '@/components/landing/footer'
import { UrlInput } from '@/components/scanner/url-input'
import { ScanProgress } from '@/components/scanner/scan-progress'
import { ResultsView } from '@/components/scanner/results-view'
import type { ScanResult } from '@/types/scan'

export default function Home() {
  const [scanning, setScanning] = useState(false)
  const [activeUrl, setActiveUrl] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')

  async function handleScan(url: string) {
    setScanning(true)
    setActiveUrl(url)
    setResult(null)
    setError('')

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data: unknown = await res.json()
      if (!res.ok) {
        const msg =
          typeof data === 'object' && data !== null && 'error' in data
            ? String((data as { error: unknown }).error)
            : 'Scan failed'
        setError(msg)
      } else {
        setResult(data as ScanResult)
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setScanning(false)
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AccessMate',
    applicationCategory: 'DeveloperApplication',
    description: 'AI-powered web accessibility auditor for WCAG 2.1/2.2 compliance checking',
    url: 'https://accessmate.vrajvithalani.com',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
    },
    keywords: 'WCAG, accessibility, a11y, audit, scanner, compliance',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />

        {/* Scanner section */}
        <section
          id="scanner"
          className="scroll-mt-16 bg-zinc-50/50 px-4 py-20"
          aria-labelledby="scanner-heading"
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2
                id="scanner-heading"
                className="mb-2 text-3xl font-bold tracking-tight text-zinc-900"
              >
                Scan your website
              </h2>
              <p className="text-zinc-500">
                Paste any public URL to get a free WCAG accessibility report.
              </p>
            </div>

            <UrlInput onScan={handleScan} disabled={scanning} />

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {scanning && (
              <div className="mt-8">
                <ScanProgress url={activeUrl} />
              </div>
            )}

            {result && (
              <div className="mt-8">
                <ResultsView result={result} />
              </div>
            )}
          </div>
        </section>

        <HowItWorks />
      </main>

      <Footer />
    </>
  )
}
