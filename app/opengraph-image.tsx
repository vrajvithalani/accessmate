import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'AccessMate — AI-Powered WCAG Auditor'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 96,
          height: 96,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          marginBottom: 28,
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-2px',
          marginBottom: 16,
        }}
      >
        AccessMate
      </div>
      <div
        style={{
          fontSize: 32,
          color: '#94a3b8',
          letterSpacing: '0.5px',
        }}
      >
        AI-Powered WCAG Auditor
      </div>
    </div>,
    size
  )
}
