"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Avoid direct window access during SSR
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Only render children once mounted to avoid hydration mismatch
  return <NextThemesProvider {...props}>{mounted ? children : null}</NextThemesProvider>
}
