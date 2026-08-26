import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'),
  title: {
    default: 'AUTOMOTIVE LAB — Engineering Obsession',
    template: '%s | AUTOMOTIVE LAB',
  },
  description: 'An interactive automotive engineering experience. Explore machines through design, engineering and motion. Four extraordinary vehicles. One laboratory.',
  keywords: ['automotive', 'cars', 'engineering', 'Ford Mustang', 'supercar', 'Ford GT', 'interactive', 'performance'],
  authors: [{ name: 'Automotive Lab' }],
  creator: 'Automotive Lab',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://automotive-lab.com',
    title: 'AUTOMOTIVE LAB — Engineering Obsession',
    description: 'An interactive automotive engineering experience. Explore machines through design, engineering and motion.',
    siteName: 'AUTOMOTIVE LAB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AUTOMOTIVE LAB — Engineering Obsession',
    description: 'An interactive automotive engineering experience.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  )
}
