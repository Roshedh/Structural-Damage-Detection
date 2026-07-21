import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
  withTagline?: boolean
}

export function Logo({ className, iconOnly = false, withTagline = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group select-none", className)}>
      <div className="relative flex-shrink-0 flex items-center justify-center w-[1.5em] h-[1.5em]">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
              <stop offset="25%" stopColor="rgba(16, 185, 129, 0.35)" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="75%" stopColor="rgba(6, 182, 212, 0.35)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </linearGradient>
          </defs>

          <style>{`
            .logo-hex {
              transition: stroke 0.5s ease, stroke-width 0.3s ease;
            }
            .group:hover .logo-hex {
              stroke: #10b981;
              stroke-width: 1.75;
            }
            .scan-line {
              animation: laser-sweep 3s ease-in-out infinite;
            }
            .group:hover .scan-line {
              animation-duration: 1.5s;
            }
            .ping-ring {
              animation: ping-expand 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              transform-origin: 16.5px 14.5px;
            }
            .target-ring {
              animation: slow-rotate 8s linear infinite;
              transform-origin: 16.5px 14.5px;
            }
            .hotspot-core {
              animation: glow-pulse 1.5s ease-in-out infinite;
            }
            .safe-ping {
              animation: safe-expand 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              transform-origin: 12px 7px;
            }
            .safe-core {
              animation: safe-glow 1.5s ease-in-out infinite;
            }
            
            @keyframes laser-sweep {
              0%, 100% { transform: translateY(-8px); opacity: 0.15; }
              50% { transform: translateY(8px); opacity: 0.95; }
            }
            @keyframes ping-expand {
              0% { r: 1px; opacity: 1; }
              100% { r: 6.5px; opacity: 0; }
            }
            @keyframes slow-rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes glow-pulse {
              0%, 100% { fill: #ef4444; filter: drop-shadow(0 0 1px rgba(239,68,68,0.7)); }
              50% { fill: #f59e0b; filter: drop-shadow(0 0 3px rgba(245,158,11,0.9)); }
            }
            @keyframes safe-expand {
              0% { r: 1px; opacity: 0.8; }
              100% { r: 4.5px; opacity: 0; }
            }
            @keyframes safe-glow {
              0%, 100% { fill: #10b981; filter: drop-shadow(0 0 1px rgba(16,185,129,0.5)); }
              50% { fill: #34d399; filter: drop-shadow(0 0 2.5px rgba(52,211,153,0.7)); }
            }
          `}</style>

          {/* Outer Hexagon Frame */}
          <path 
            d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="logo-hex text-foreground/80 dark:text-foreground/90" 
          />

          {/* Main Spines (Isometric Cube corners) */}
          <path 
            d="M12 12 V22 M12 12 L3 7 M12 12 L21 7" 
            stroke="currentColor" 
            strokeWidth="1.25" 
            strokeLinecap="round" 
            className="text-foreground/40 dark:text-foreground/60 group-hover:text-foreground/50 transition-colors duration-500" 
          />

          {/* Engineering Wireframe / Sub-truss grid */}
          <path 
            d="M3 7 H21 M3 7 L12 22 M3 17 L12 12 M12 12 L21 17 M12 22 L21 7" 
            stroke="currentColor" 
            strokeWidth="0.75" 
            strokeDasharray="2 2" 
            strokeLinecap="round" 
            className="text-muted-foreground/30 dark:text-muted-foreground/45 group-hover:text-cyan-500/25 transition-colors duration-500" 
          />

          {/* Scanning laser beam */}
          <line 
            x1="2" 
            y1="12" 
            x2="22" 
            y2="12" 
            stroke="url(#scanGradient)" 
            strokeWidth="1.5" 
            className="scan-line" 
          />

          {/* Safe Node (Green) */}
          <g className="safe-node">
            <circle cx="12" cy="7" r="1" fill="#10b981" className="safe-ping" />
            <circle cx="12" cy="7" r="1.25" fill="#10b981" className="safe-core" />
          </g>

          {/* Defect Node (Red) */}
          <g className="defect-node">
            <circle cx="16.5" cy="14.5" r="3.25" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="1.5 1" className="target-ring" />
            <circle cx="16.5" cy="14.5" r="1" fill="#ef4444" className="ping-ring" />
            <circle cx="16.5" cy="14.5" r="1.5" fill="#ef4444" className="hotspot-core" />
          </g>
        </svg>

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <span className="text-[1.15em] leading-none font-black tracking-tight text-foreground transition-colors duration-300">
            Structura <span className="text-emerald-600 dark:text-emerald-400 transition-colors duration-300">AI</span>
          </span>
          {withTagline && (
            <span className="text-[0.38em] leading-none mt-1.5 font-bold tracking-[0.2em] text-muted-foreground/80 uppercase">
              Damage Detection System
            </span>
          )}
        </div>
      )}
    </div>
  )
}
