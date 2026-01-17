import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TES: Betrayal of the Second Era - Companion",
  description: "Companion app for The Elder Scrolls: Betrayal of the Second Era board game",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-tes-darker text-tes-parchment antialiased">
        {children}
      </body>
    </html>
  )
}
