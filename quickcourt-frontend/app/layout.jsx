import "./globals.css"
import { Navigation } from "@/components/navigation"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
