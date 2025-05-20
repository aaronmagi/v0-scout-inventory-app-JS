import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scout Inventory Management",
  description: "Server inventory management application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col h-screen">
            <header className="bg-blue-600 text-white p-4 flex items-center justify-between z-50 relative">
              <h1 className="text-xl font-bold">Scout Inventory Management</h1>
            </header>
            <div className="flex flex-1 overflow-hidden">
              <SidebarProvider>{children}</SidebarProvider>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
