import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import MenuLayout from "@/components/menu-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FleetMaster - Logistics Management",
  description: "Modern admin dashboard for logistics and fleet management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MenuLayout>
              {children}
            </MenuLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
