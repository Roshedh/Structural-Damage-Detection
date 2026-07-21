import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from "react"

interface DamageResult {
  type: string
  confidence: number
  description: string
  severity: "low" | "medium" | "high" | "critical"
}

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-destructive/10 border-destructive/30 text-destructive shadow-[0_0_20px_rgba(var(--destructive),0.15)]"
    case "high":
      return "bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]"
    case "medium":
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.15)]"
    case "low":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
    default:
      return "bg-muted border-muted-foreground/30 text-muted-foreground"
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <ShieldAlert className="w-7 h-7" />
    case "high":
      return <AlertCircle className="w-7 h-7" />
    case "medium":
      return <AlertTriangle className="w-7 h-7" />
    case "low":
      return <CheckCircle2 className="w-7 h-7" />
    default:
      return <CheckCircle2 className="w-7 h-7" />
  }
}

const getDamageTypeDisplay = (type: string) => {
  const displayNames: Record<string, string> = {
    no_damage: "No Damage Detected",
    rust: "Rust",
    dent: "Dent",
    crack: "Crack",
    bend: "Bend",
    corrosion: "Corrosion"
  }
  return displayNames[type] || type.replace(/_/g, " ")
}

export default function DamageResults({ result }: { result: DamageResult }) {
  const [animatedWidth, setAnimatedWidth] = useState(0)

  useEffect(() => {
    // Trigger animation after render
    const timer = setTimeout(() => setAnimatedWidth(result.confidence * 100), 100)
    return () => clearTimeout(timer)
  }, [result.confidence])

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden h-full">
      <div className="p-8">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 tracking-tight">
          Analysis Report
        </h2>

        <div className={`rounded-xl border p-6 ${getSeverityStyles(result.severity)} mb-8 transition-all duration-500 transform hover:scale-[1.01]`}>
          <div className="flex items-start gap-5">
            <div className="mt-1 animate-pulse">{getSeverityIcon(result.severity)}</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2 tracking-tight">{getDamageTypeDisplay(result.type)}</h3>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-secondary/50 p-4 rounded-xl border border-border/50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-muted-foreground font-semibold text-sm tracking-wide">Confidence Score</span>
              <span className="text-primary font-mono font-bold text-lg">{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-border">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                style={{ width: `${animatedWidth}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/50">
            <div className="bg-secondary/30 p-4 rounded-lg border border-border/30">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Severity Level</p>
              <p className="text-foreground font-bold capitalize mt-1 tracking-tight text-lg">{result.severity}</p>
            </div>
            <div className="bg-secondary/30 p-4 rounded-lg border border-border/30">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Status</p>
              <p className="text-emerald-500 font-bold mt-1 tracking-tight text-lg">Analyzed</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

