"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Bot, Send, X, MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"

type ChatAction = {
  label: string
  href: string
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  actions?: ChatAction[]
}

export default function ChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [pendingInput, setPendingInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hi! I’m your QuickCourt assistant. Ask me about venues, bookings, or dashboard actions.",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const shouldHide = useMemo(() => {
    if (!pathname) return false
    if (pathname.startsWith("/auth")) return true
    return false
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [isOpen, messages])

  async function sendMessage() {
    const trimmed = pendingInput.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setPendingInput("")
    setIsSending(true)

    try {
      // Local rule-based responses without external APIs
      const lower = trimmed.toLowerCase()

      // Detect sport intent
      const SPORTS: Array<{ name: string; slug: string; keywords: string[] }> = [
        { name: "Badminton", slug: "badminton", keywords: ["badminton", "shuttle"] },
        { name: "Tennis", slug: "tennis", keywords: ["tennis"] },
        { name: "Football", slug: "football", keywords: ["football", "soccer"] },
        { name: "Cricket", slug: "cricket", keywords: ["cricket"] },
        { name: "Basketball", slug: "basketball", keywords: ["basketball", "bball"] },
        { name: "Table Tennis", slug: "table%20tennis", keywords: ["table tennis", "ping pong", "pingpong", "tt"] },
      ]

      const sportMatch = SPORTS.find((s) => s.keywords.some((k) => lower.includes(k)))

      const wantsBooking = ["book", "booking", "reserve", "slot", "play"].some((k) => lower.includes(k))

      // Extract venue id from path if present (/venues/[id])
      let venueIdFromPath: string | undefined
      if (pathname && /^\/venues\//.test(pathname)) {
        const m = pathname.match(/^\/venues\/([^/?#]+)/)
        if (m && m[1]) venueIdFromPath = m[1]
      }

      let reply = "I’m here to help!"
      const actions: ChatAction[] = []

      if (wantsBooking) {
        reply = sportMatch
          ? `Here are quick links to book or explore ${sportMatch.name} venues:`
          : "Here are quick links to book or explore venues:"

        if (sportMatch) {
          actions.push({ label: `Find ${sportMatch.name} Venues`, href: `/venues?sport=${sportMatch.slug}` })
        }
        actions.push({ label: "Find All Venues", href: "/venues" })
        if (venueIdFromPath) {
          actions.push({ label: "Book This Venue", href: `/booking?venue=${venueIdFromPath}` })
        }
        actions.push({ label: "Open Booking", href: "/booking" })
        actions.push({ label: "My Bookings", href: "/bookings" })
      } else if (lower.includes("venue") || lower.includes("price") || lower.includes("rating")) {
        reply = "Check Venues for details like price, ratings, and amenities. Use filters to narrow results."
        actions.push({ label: "Browse Venues", href: "/venues" })
      } else if (lower.includes("owner") || lower.includes("facility")) {
        reply = "Facility owners: manage facilities and courts under Owner → Facilities and Courts."
        actions.push({ label: "Owner Dashboard", href: "/owner/dashboard" })
        actions.push({ label: "My Facilities", href: "/owner/facilities" })
      } else if (lower.includes("admin") || lower.includes("dashboard")) {
        reply = "Admins can monitor metrics at Admin → Dashboard and handle approvals under Admin → Facilities."
        actions.push({ label: "Admin Dashboard", href: "/admin/dashboard" })
        actions.push({ label: "Facility Approvals", href: "/admin/facilities" })
      } else if (lower.includes("login") || lower.includes("signup") || lower.includes("account")) {
        reply = "Use the top-right menu: Login or Sign Up. After login, access Profile and Bookings."
        actions.push({ label: "Login", href: "/auth/login" })
        actions.push({ label: "Sign Up", href: "/auth/signup" })
      } else if (lower.includes("help") || lower.includes("how")) {
        reply = "Try asking about ‘booking’, ‘venues’, ‘owner tools’, or ‘admin dashboard’."
        actions.push({ label: "Browse Venues", href: "/venues" })
        actions.push({ label: "Open Booking", href: "/booking" })
      } else if (pathname?.startsWith("/venues")) {
        reply = "You are on Venues. Use filters for location, sport, and price; click a card for details."
        actions.push({ label: "Browse Venues", href: "/venues" })
      } else if (pathname?.startsWith("/owner")) {
        reply = "You are in the Owner area. Use Dashboard, Facilities, Courts, and Time Slots to manage operations."
        actions.push({ label: "Owner Dashboard", href: "/owner/dashboard" })
      } else if (pathname?.startsWith("/admin")) {
        reply = "You are in the Admin area. Review approvals, users, reports, and analytics from the dashboard."
        actions.push({ label: "Admin Dashboard", href: "/admin/dashboard" })
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        actions: actions.length > 0 ? actions : undefined,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  if (shouldHide) return null

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2">
        <Button
          aria-label={isOpen ? "Close chat" : "Open chat"}
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[400px] max-w-[100vw] p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <div>
                    <SheetTitle>QuickCourt Assistant</SheetTitle>
                    <SheetDescription>Ask anything about venues and bookings</SheetDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="flex">
                  <Card
                    className={
                      message.role === "assistant"
                        ? "max-w-[85%] rounded-lg bg-blue-50 p-3 text-sm"
                        : "ml-auto max-w-[85%] rounded-lg bg-gray-100 p-3 text-sm"
                    }
                  >
                    <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                      <div>{message.content}</div>
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {message.actions.map((a) => (
                            <a
                              key={`${message.id}-${a.href}-${a.label}`}
                              href={a.href}
                              onClick={(e) => {
                                e.preventDefault()
                                window.location.href = a.href
                              }}
                              className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-blue-700 border-blue-200 bg-white hover:bg-blue-50"
                            >
                              {a.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-3">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={pendingInput}
                  onChange={(e) => setPendingInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                />
                <Button onClick={() => void sendMessage()} disabled={isSending || !pendingInput.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}


