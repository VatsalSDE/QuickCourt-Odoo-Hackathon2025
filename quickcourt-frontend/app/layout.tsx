import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import dynamic from 'next/dynamic'

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
        {children}
        {/* Global Chat Widget */}
        <ChatWidget />
      </body>
    </html>
  )
}
