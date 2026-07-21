"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Moon, Sun, Hexagon, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { Logo } from "@/components/ui/logo"

export default function MarketingHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
          <Logo className="text-xl sm:text-2xl" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#modules" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Modules</Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <Link href="/dashboard">
            <Button className="font-semibold bg-emerald-600 text-white hover:bg-emerald-700 border-none transition-all shadow-lg shadow-emerald-900/20">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 shadow-xl">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md">Features</Link>
          <Link href="#modules" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md">Modules</Link>
          <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md">FAQ</Link>
          <div className="border-t border-border pt-4 px-4 flex justify-between items-center">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 text-sm font-medium"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Toggle Theme
              </button>
            )}
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
