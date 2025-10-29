import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lumy - Your Personal Skincare Companion',
  description: 'Get tailored skincare recommendations based on your skin type, allergies, and routines.',
  generator: 'Lumy App',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lumy',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#4d765e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} h-full overflow-hidden`}>
        <div className="h-full flex flex-col">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
