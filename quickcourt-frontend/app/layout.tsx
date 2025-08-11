import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { MapPin } from 'lucide-react'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuickCourt',
  description: 'Created by 4 Developers',
  icons: 'MapPin'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body style={{ fontFamily: GeistSans.style.fontFamily }}>{children}</body>
    </html>
  )
}
