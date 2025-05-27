"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Truck,
  Users,
  Home,
  Package,
  RouteIcon,
  ClipboardList,
  History,
  Bell,
  Search,
  Menu,
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { setIsAuthenticated } = useAuth()
  
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
    order: false,
    runsheet: false,
    trip: false,
  })

  // Toggle submenu
  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Check if path is active
  const isActive = (path: string) => pathname === path

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
  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop Collapsible Version */}
      {!isMobile && (
        <aside
          className={cn(
            "group/sidebar relative h-screen border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[60px]" : "w-[240px]",
          )}
        >
          {/* Sidebar Header */}
          <div className="flex h-16 items-center border-b px-4">
            <div className={cn("flex items-center", isCollapsed && "justify-center w-full")}>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                {/* <Truck className="h-5 w-5" /> */}
              </div>
              {!isCollapsed && <span className="ml-2 text-lg font-semibold">FleetMaster</span>}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4">
              {/* Dashboard Link */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "w-full justify-start",
                  isActive("/dashboard") && "bg-accent text-accent-foreground",
                  isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                )}
              >
                <Link href="/dashboard">
                  <Home className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>
              </Button>

              <Separator className="my-4" />

              {/* Master Section */}
              <div className="pb-4">
                <h2
                  className={cn(
                    "mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
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
                          <span className="flex-1 text-left">Resource</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.resource && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.resource && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/resource/driver") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/resource/driver">
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
                          <span className="flex-1 text-left">Fleet</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.fleet && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.fleet && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/fleet/head") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/fleet/head">
                            Head
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/fleet/tail") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/fleet/tail">
                            Tail
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/fleet/container") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/fleet/container">
                            Container
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
                      <Users className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">Customer</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.customer && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.customer && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/customer/customer") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/customer/customer">
                            Customer
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/customer/warehouse") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/customer/warehouse">
                            Warehouse
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
                          <span className="flex-1 text-left">Route</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.route && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.route && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/route/routes") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/route/routes">
                            Routes
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Operations Section */}
              <div className="pb-4">
                <h2
                  className={cn(
                    "mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
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
                          <span className="flex-1 text-left">Order</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.order && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.order && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/order/delivery") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/order/delivery">
                            Customer Order
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Runsheet */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.runsheet && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("runsheet")}
                    >
                      <ClipboardList className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">Runsheet</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.runsheet && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.runsheet && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/runsheet/pending") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/runsheet/pending">
                            Pending
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/runsheet/final") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/runsheet/final">
                            Final
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Transactions Section */}
              <div className="pb-4">
                <h2
                  className={cn(
                    "mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    isCollapsed && "sr-only",
                  )}
                >
                  Transactions
                </h2>

                <div className="space-y-1">
                  {/* Trip */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        openSubmenus.trip && "bg-accent text-accent-foreground",
                        isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0",
                      )}
                      onClick={() => toggleSubmenu("trip")}
                    >
                      <History className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">Trip</span>
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform", openSubmenus.trip && "rotate-90")}
                          />
                        </>
                      )}
                    </Button>
                    {openSubmenus.trip && !isCollapsed && (
                      <div className="ml-4 border-l pl-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(
                            "w-full justify-start",
                            isActive("/dashboard/trip/historical") && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href="/dashboard/trip/historical">
                            Placeholder
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
                <span className="text-lg font-semibold">FleetMaster</span>
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
                              isActive("/dashboard/resource/driver") && "bg-accent text-accent-foreground",
                            )}
                          >
                            <Link href="/dashboard/resource/driver">
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
                              isActive("/dashboard/fleet/head") && "bg-accent text-accent-foreground",
                            )}
                          >
                            <Link href="/dashboard/fleet/head">
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
                              isActive("/dashboard/fleet/tail") && "bg-accent text-accent-foreground",
                            )}
                          >
                            <Link href="/dashboard/fleet/tail">
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
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 md:px-6">
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

          <div className="ml-auto flex items-center gap-4">
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
        <main className="flex-1">
          <div className="flex-1 space-y-4 p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
