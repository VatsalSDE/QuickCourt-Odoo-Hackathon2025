import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { MapPin } from 'lucide-react'
import './globals.css'
import dynamic from 'next/dynamic'
import { AuthProvider } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quickcourt',
  description: 'Created with v0',
  generator: 'v0.dev',
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
      <body style={{ fontFamily: GeistSans.style.fontFamily }}>
        <AuthProvider>
          <Navigation />
          {children}
          {/* Global Chat Widget */}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}
