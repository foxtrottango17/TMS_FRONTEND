import type React from "react"
import MenuLayout from "@/components/menu-layout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MenuLayout>{children}</MenuLayout>
}
