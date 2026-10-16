"use client"
import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileScan, Activity, Hexagon } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Scan", href: "/dashboard/scan", icon: FileScan },
    { name: "Activity", href: "/dashboard/activity", icon: Activity },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group text-primary font-bold text-xl tracking-tight">
            <div className="relative">
              <Hexagon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <div className="absolute inset-0 bg-emerald-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
            </div>
            Structura AI
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
        {/* Mobile Header */}
        <header className="h-16 md:hidden flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
          <Link href="/" className="flex items-center gap-2 group text-primary font-bold text-lg">
            <div className="relative">
              <Hexagon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div className="absolute inset-0 bg-emerald-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
            </div>
            Structura AI
          </Link>
          <Link href="/dashboard/scan">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-sm">
              <FileScan className="w-3.5 h-3.5" /> Scan Now
            </span>
          </Link>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-lg border-t border-border z-40 flex items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`p-1 rounded-md mb-0.5 ${isActive ? "bg-emerald-500/15" : ""}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </main>
    </div>
  )
}
