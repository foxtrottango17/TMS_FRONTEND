"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Overview
      </Link>
      <Link
        href="/dashboard/analytics"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/analytics" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Analytics
      </Link>
      <Link
        href="/dashboard/reports"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/reports" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Reports
      </Link>
    </nav>
  )
}
