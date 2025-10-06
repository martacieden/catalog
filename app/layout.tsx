import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { CollectionsProvider } from '@/contexts/collections-context'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Collection UI - Modern Asset Management',
  description: 'A modern, intuitive interface for managing your personal and business assets with AI-powered organization.',
  generator: 'Next.js',
  openGraph: {
    title: 'Collection UI - Modern Asset Management',
    description: 'A modern, intuitive interface for managing your personal and business assets with AI-powered organization.',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Collection UI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collection UI - Modern Asset Management',
    description: 'A modern, intuitive interface for managing your personal and business assets with AI-powered organization.',
    images: ['/opengraph-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CollectionsProvider>
          {children}
        </CollectionsProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
