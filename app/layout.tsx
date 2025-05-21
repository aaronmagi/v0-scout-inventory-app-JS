import type React from "react"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"

export const metadata = {
  title: "Scout Inventory",
  description: "Server inventory management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
