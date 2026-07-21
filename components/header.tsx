import { Logo } from "@/components/ui/logo"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo className="text-2xl sm:text-3xl" withTagline />
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 shadow-inner">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium text-sm hidden sm:inline-block">System Active</span>
          </div>
        </div>
      </div>
    </header>
  )
}
