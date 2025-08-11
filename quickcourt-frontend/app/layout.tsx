import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { MapPin } from 'lucide-react'
import './globals.css'
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), { ssr: false })

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'Quickcourt',
  description: 'Created with v0',
  generator: 'v0.dev',
=======
  title: 'QuickCourt',
  description: 'Created by 4 Developers',
  icons: 'MapPin'
>>>>>>> bd93c9fce8bb617a73b2cc843e128edad8318bf7
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
