"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Truck,
  Users,
  User,
  Contact,
  Home,
  Package,
  RouteIcon,
  ClipboardList,
  History,
  Bell,
  Search,
  Menu,
  FileText,
  CreditCard,
  DollarSign,
  BarChart2,
  Moon,
  Sun,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  
  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router, setIsAuthenticated])
  
  const handleLogout = () => {
    // Clear all authentication related data
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    
    // Update auth state
    setIsAuthenticated(false)
    
    // Redirect to login page
    router.push('/login')
    router.refresh() // Force a refresh to update the UI
  }
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Track open state of submenus
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    resource: false,
    fleet: false,
    customer: false,
    route: false,
    config: false,
    order: false,
    runsheet: false,
    trip: false,
    dispatch: false,
    tripHistory: false,
    payments: false,
    expenses: false,
    financialReports: false,
    operationsReports: false,
    invoice: false,
    profitLoss: false,
    customers: false
  })

  // Toggle submenu
  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Check if path is active - supports exact matches and startsWith for nested paths
  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return pathname === path
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Safe way to check window size without causing hydration issues
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        const isMobileView = window.innerWidth < 768
        setIsMobile(isMobileView)

        // On mobile, sidebar is hidden by default
        if (isMobileView) {
          setIsSidebarOpen(false)
        } else {
          setIsSidebarOpen(true)
        }
      }

      checkMobile()

      // Avoid direct manipulation of window object properties
      const handleResize = () => checkMobile()
      window.addEventListener("resize", handleResize)

      // Set mounted state after initial client-side render
      setMounted(true)

      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  // Fix hydration mismatch with theme
  if (!mounted || isLoading) {
    return <div className="h-screen w-screen bg-background"></div>
  }
  
  // Only render the layout if authenticated
  if (!isAuthenticated) {
    // If not authenticated, just render the children (login page) without the layout
    return <>{children}</>
  }

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop Collapsible Version */}
      {!isMobile && (
        <aside
          className={cn(
            "group/sidebar relative h-full border-r bg-background transition-all duration-300 ease-in-out flex-shrink-0",
            isCollapsed ? "w-[56px]" : "w-[200px]",
          )}
        >
          {/* Sidebar Header */}
          <div className="flex h-14 items-center border-b px-3 flex-shrink-0">
            <div className={cn("flex items-center", isCollapsed && "justify-center w-full")}>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                {/* <Truck className="h-5 w-5" /> */}
              </div>
              {!isCollapsed && <span className="ml-2 text-xs font-semibold">Fleet Master</span>}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="h-[calc(100%-64px)] overflow-y-auto">
            <div className="p-4">
              {/* Dashboard Link */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "w-full justify-start text-[11px]",
                  isActive("/dashboard", true) && "bg-accent text-accent-foreground",
                  isCollapsed && "flex h-7 w-7 shrink-0 items-center justify-center p-0",
                )}
              >
                <Link href="/dashboard">
                  <Home className={cn("h-3 w-3", isCollapsed ? "mr-0" : "mr-1.5")} />
                  {!isCollapsed && <span className="text-[11px]">Dashboard</span>}
                </Link>
              </Button>

              <Separator className="my-4" />

              {/* Master Section */}
              <div className="pb-2">
                <h2
                  className={cn(
                    "mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                    isCollapsed && "sr-only",
                  )}
                >
                  Master
                </h2>

                <div className="space-y-1">
                  {/* Resource */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.resource && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("resource")}
                    >
                      <Users className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Resource</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.resource && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.resource && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/master-data/resource/driver") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/master-data/resource/driver">
                            <span className="text-[11px]">Driver</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Fleet */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.fleet && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("fleet")}
                    >
                      <Truck className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Fleet</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.fleet && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.fleet && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/master-data/fleet/head") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/master-data/fleet/head">
                            <span className="text-[11px]">Head</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/master-data/fleet/tail") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/master-data/fleet/tail">
                            <span className="text-[11px]">Tail</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/master-data/fleet/container") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/master-data/fleet/container">
                            <span className="text-[11px]">Container</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Customer */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.customer && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("customer")}
                    >
                      <Contact className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Customer</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.customer && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.customer && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/master-data/customer/customer") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/master-data/customer/customer">
                            <span className="text-[11px]">Customer</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/master-data/customer/customer_warehouse") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/master-data/customer/customer_warehouse">
                            <span className="text-[11px]">Warehouse</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Route */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.route && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("route")}
                    >
                      <RouteIcon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Route</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.route && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.route && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/master-data/route/route") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/master-data/route/route">
                            <span className="text-[11px]">Route</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Config */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.config && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("config")}
                    >
                      <Settings className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Config</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.config && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.config && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/master-data/config/pricing") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/master-data/config/pricing">
                            <span className="text-[11px]">Pricing</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/master-data/config/payment-terms") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/master-data/config/payment-terms">
                            <span className="text-[11px]">Payment Terms</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />
              {/* Operations Section */}
              <div className="pb-2">
                <h2
                  className={cn(
                    "mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                    isCollapsed && "sr-only",
                  )}
                >
                  Operations
                </h2>

                <div className="space-y-1">
                  {/* Order */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.order && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("order")}
                    >
                      <Package className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Order</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.order && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.order && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/operations/order/quotes") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/operations/order/quotes">
                            <span className="text-[11px]">Quotes</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/operations/order/orders") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/operations/order/orders">
                            <span className="text-[11px]">Orders</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Dispatch */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.dispatch && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("dispatch")}
                    >
                      <Truck className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Dispatch</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.dispatch && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.dispatch && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/operations/dispatch/pending") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/operations/dispatch/pending">
                            <span className="text-[11px]">Plan</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/operations/dispatch/final") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/operations/dispatch/final">
                            <span className="text-[11px]">Final</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/operations/dispatch/tracking") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/operations/dispatch/tracking">
                            <span className="text-[11px]">Tracking</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Trip History */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.tripHistory && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("tripHistory")}
                    >
                      <History className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Trip History</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.tripHistory && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.tripHistory && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/operations/trip-history") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/operations/trip-history">
                            <span className="text-[11px]">Trip Logs</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Finance Section */}
              <div className="pb-2">
                <h2
                  className={cn(
                    "mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                    isCollapsed && "sr-only",
                  )}
                >
                  Finance
                </h2>

                <div className="space-y-1">
                  {/* Invoice */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.invoice && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0"
                      )}
                      onClick={() => toggleSubmenu("invoice")}
                    >
                      <FileText className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Invoice</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.invoice && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.invoice && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/invoice/invoice") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/invoice/invoice">
                            <span className="text-[11px]">Invoice List</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Payments */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.payments && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("payments")}
                    >
                      <CreditCard className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Payments</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.payments && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.payments && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/payments/received") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/payments/received">
                            <span className="text-[11px]">Received Payments</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Expenses */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.expenses && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("expenses")}
                    >
                      <DollarSign className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Expenses</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.expenses && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.expenses && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/expenses/all") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/expenses/all">
                            <span className="text-[11px]">All</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/expenses/fuel") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/expenses/fuel">
                            <span className="text-[11px]">Fuel Expenses</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/expenses/driver") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/expenses/driver">
                            <span className="text-[11px]">Driver Payments</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/expenses/maintenance") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/expenses/maintenance">
                            <span className="text-[11px]">Maintenance Costs</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/expenses/toll") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/expenses/toll">
                            <span className="text-[11px]">Tolls & Parking</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/expenses/misc") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/expenses/misc">
                            <span className="text-[11px]">Miscellaneous</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Profit & Loss */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.profitLoss && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0"
                      )}
                      onClick={() => toggleSubmenu("profitLoss")}
                    >
                      <BarChart2 className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Profit & Loss</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.profitLoss && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.profitLoss && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/finance/profit-loss") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/finance/profit-loss">
                            <span className="text-[11px]">Profit & Loss Report</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Reports Section */}
              <div className="pb-2">
                <h2
                  className={cn(
                    "mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                    isCollapsed && "sr-only",
                  )}
                >
                  Reports
                </h2>

                <div className="space-y-1">
                  {/* Financials */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.financialReports && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0"
                      )}
                      onClick={() => toggleSubmenu("financialReports")}
                    >
                      <BarChart2 className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Financials</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.financialReports && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.financialReports && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        {/* Revenue Report */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/financial/revenue") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/financial/revenue">
                            <span className="text-[11px]">Revenue Report</span>
                          </Link>
                        </Button>
                        
                        {/* Expense Analysis */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/financial/expenses") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/financial/expenses">
                            <span className="text-[11px]">Expense Analysis</span>
                          </Link>
                        </Button>
                        
                        {/* Profit & Loss Overview */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/financial/profit-loss") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/financial/profit-loss">
                            <span className="text-[11px]">Profit & Loss Overview</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Operations */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.operationsReports && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0"
                      )}
                      onClick={() => toggleSubmenu("operationsReports")}
                    >
                      <ClipboardList className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Operations</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.operationsReports && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.operationsReports && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        {/* Order Summary */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/operations/orders") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/operations/orders">
                            <span className="text-[11px]">Order Summary</span>
                          </Link>
                        </Button>
                        
                        {/* Quote Conversion Rate */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/operations/quotes") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/operations/quotes">
                            <span className="text-[11px]">Quote Conversion Rate</span>
                          </Link>
                        </Button>
                        
                        {/* Dispatch Efficiency */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/operations/dispatch") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/operations/dispatch">
                            <span className="text-[11px]">Dispatch Efficiency</span>
                          </Link>
                        </Button>
                        
                        {/* Fleet Utilization */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/operations/fleet") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/operations/fleet">
                            <span className="text-[11px]">Fleet Utilization</span>
                          </Link>
                        </Button>
                        
                        {/* Driver Performance */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/operations/drivers") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/operations/drivers">
                            <span className="text-[11px]">Driver Performance</span>
                          </Link>
                        </Button>
                        
                        {/* Route Performance */}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/operations/routes") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/operations/routes">
                            <span className="text-[11px]">Route Performance</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Customers */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.customers && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0"
                      )}
                      onClick={() => toggleSubmenu("customers")}
                    >
                      <Users className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-[11px]">Customers</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.customers && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.customers && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 py-1 space-y-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start pl-3 pr-2 h-7 text-[11px]",
                            isActive("/reports/customers") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Link href="/reports/customers">
                            <span className="text-[11px]">Customer Analysis</span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar - Slide-out */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100",
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-[240px] border-r bg-background transition-transform duration-300 ease-in-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex h-16 items-center border-b px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">FleetMaster</span>
              </div>
            </div>

            {/* Sidebar Content - Mobile */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              <div className="p-4">
                {/* Dashboard Link */}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn("w-full justify-start", isActive("/dashboard") && "bg-accent text-accent-foreground")}
                >
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>

                <Separator className="my-4" />

                {/* Master Section - Mobile */}
                <div className="pb-4">
                  <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Master
                  </h2>

                  <div className="space-y-1">
                    {/* Resource */}
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start",
                          openSubmenus.resource && "bg-accent text-accent-foreground",
                        )}
                        onClick={() => toggleSubmenu("resource")}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        <span className="flex-1 text-left">Resource</span>
                        <ChevronRight
                          className={cn("h-4 w-4 transition-transform", openSubmenus.resource && "rotate-90")}
                        />
                      </Button>
                      {openSubmenus.resource && (
                        <div className="ml-4 border-l pl-2 pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={cn(
                              "w-full justify-start",
                              isActive("/master-data/resource/driver") && "bg-accent text-accent-foreground",
                            )}
                          >
                            <Link href="/master-data/resource/driver">
                              <Users className="mr-2 h-4 w-4" />
                              Driver
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Fleet */}
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn("w-full justify-start", openSubmenus.fleet && "bg-accent text-accent-foreground")}
                        onClick={() => toggleSubmenu("fleet")}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        <span className="flex-1 text-left">Fleet</span>
                        <ChevronRight
                          className={cn("h-4 w-4 transition-transform", openSubmenus.fleet && "rotate-90")}
                        />
                      </Button>
                      {openSubmenus.fleet && (
                        <div className="ml-4 border-l pl-2 pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={cn(
                              "w-full justify-start",
                              isActive("/master-data/fleet/head") && "bg-accent text-accent-foreground",
                            )}
                          >
                            <Link href="/master-data/fleet/head">
                              <Truck className="mr-2 h-4 w-4" />
                              Head
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={cn(
                              "w-full justify-start",
                              isActive("/master-data/fleet/tail") && "bg-accent text-accent-foreground",
                            )}
                          >
                            <Link href="/master-data/fleet/tail">
                              <Truck className="mr-2 h-4 w-4" />
                              Tail
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Other menu items for mobile... */}
                    {/* Customer and Route sections would go here, similar to above */}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Operations and Transactions sections would go here, similar to above */}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 flex-shrink-0">
          {isMobile ? (
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsCollapsed(!isCollapsed)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}

          <div className="ml-auto flex items-center gap-1">
            <div className="relative hidden md:flex">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-[200px] rounded-md border pl-8 md:w-[300px]" />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 h-[calc(100%-64px)] overflow-hidden">
          <div className="h-full p-2">{children}</div>
        </main>
      </div>
    </div>
  )
}