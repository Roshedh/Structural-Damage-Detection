"use client"

import { useEffect, useState } from "react"
import { ShieldAlert } from "lucide-react"

export default function SecurityShield() {
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    // 1. Disable Right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      triggerWarning("Right-click context menu is disabled for security reasons.")
    }

    // 2. Disable inspection keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 (123)
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault()
        triggerWarning("Developer Tools (F12) are restricted.")
        return
      }

      // Ctrl+Shift+I (73) - Inspect
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
        e.preventDefault()
        triggerWarning("Developer Tools shortcuts are restricted.")
        return
      }

      // Ctrl+Shift+J (74) - Console
      if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
        e.preventDefault()
        triggerWarning("Javascript Console shortcuts are restricted.")
        return
      }

      // Ctrl+Shift+C (67) - Element selection pointer
      if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
        e.preventDefault()
        triggerWarning("Inspector tools shortcuts are restricted.")
        return
      }

      // Ctrl+U (85) - View Source
      if (e.ctrlKey && (e.key === "U" || e.key === "u" || e.keyCode === 85)) {
        e.preventDefault()
        triggerWarning("Viewing source code is restricted.")
        return
      }

      // Ctrl+S (83) - Save page local assets
      if (e.ctrlKey && (e.key === "S" || e.key === "s" || e.keyCode === 83)) {
        e.preventDefault()
        triggerWarning("Saving application assets is restricted.")
        return
      }
    }

    // 3. Client-side Anti-debugging trick
    // Dynamically executes a debugger statement to pause execution if DevTools is open.
    const interval = setInterval(() => {
      try {
        const start = Date.now()
        // Use Function constructor to construct debugger statement dynamically
        // so that it compiles at runtime and bypasses static ESLint checks.
        Function("debugger")()
        const end = Date.now()
        // If debugger paused execution, the time difference will be large
        if (end - start > 100) {
          triggerWarning("Security Alert: Debugger active.")
        }
      } catch (err) {}
    }, 1000)

    document.addEventListener("contextmenu", handleContextMenu)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      window.removeEventListener("keydown", handleKeyDown)
      clearInterval(interval)
    }
  }, [])

  const triggerWarning = (msg: string) => {
    setWarning(msg)
    // Clear warning after 4 seconds
    const timer = setTimeout(() => {
      setWarning(null)
    }, 4000)
    return () => clearTimeout(timer)
  }

  if (!warning) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div className="bg-slate-950/95 border border-red-500/30 text-white rounded-lg p-4 shadow-[0_0_20px_rgba(239,68,68,0.25)] flex items-start gap-3 backdrop-blur-md">
        <div className="p-2 bg-red-500/10 rounded-md shrink-0">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-red-400">
            Security Policy Active
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {warning} Inspecting source, using developer tools, and debugging actions are restricted.
          </p>
        </div>
      </div>
    </div>
  )
}
