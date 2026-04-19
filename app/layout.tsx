import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://accessmate.vrajvithalani.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "AccessMate - AI-Powered Web Accessibility Auditor",
  description:
    "Scan any website for WCAG 2.1/2.2 violations. Get AI-powered explanations and ready-to-use code fixes. Free, instant, no signup required.",
  keywords: ["WCAG", "accessibility", "a11y", "audit", "scanner", "compliance"],
  authors: [{ name: "Vraj Vithalani" }],
  openGraph: {
    title: "AccessMate - AI-Powered Web Accessibility Auditor",
    description:
      "Scan any website for WCAG 2.1/2.2 violations. Get AI-powered explanations and ready-to-use code fixes. Free, instant, no signup required.",
    url: BASE_URL,
    siteName: "AccessMate",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AccessMate — AI-Powered WCAG Auditor",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AccessMate - AI-Powered Web Accessibility Auditor",
    description:
      "Scan any website for WCAG 2.1/2.2 violations. Get AI-powered explanations and ready-to-use code fixes.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const cfToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  const isProd = process.env.NODE_ENV === "production";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {isProd && gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {isProd && cfToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${cfToken}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
