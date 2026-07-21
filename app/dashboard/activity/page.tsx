"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Search, Filter, ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"


const allActivityLogs = [
  { id: "SCN-9942", target: "Bridge Support Alpha", type: "Critical Crack", severity: "critical", confidence: "99.1%", time: "2h ago", userId: "user-1" },
  { id: "SCN-9941", target: "Pipeline Section 4", type: "Severe Corrosion", severity: "high", confidence: "94.5%", time: "5h ago", userId: "user-2" },
  { id: "SCN-9940", target: "Main Truss Beam", type: "No Damage Detected", severity: "low", confidence: "98.2%", time: "8h ago", userId: "user-1" },
  { id: "SCN-9939", target: "Warehouse Roof Panel", type: "Metal Fatigue", severity: "medium", confidence: "87.3%", time: "1d ago", userId: "user-2" },
  { id: "SCN-9938", target: "Rail Overpass Column", type: "Concrete Spalling", severity: "high", confidence: "92.1%", time: "1d ago", userId: "user-1" },
  { id: "SCN-9937", target: "Foundation Block C", type: "No Damage Detected", severity: "low", confidence: "99.9%", time: "2d ago", userId: "user-2" },
  { id: "SCN-9936", target: "Exterior Wall Panel", type: "Surface Rust", severity: "medium", confidence: "85.4%", time: "2d ago", userId: "user-1" },
]

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical": return <ShieldAlert className="w-5 h-5 text-destructive" />
    case "high": return <AlertCircle className="w-5 h-5 text-orange-500" />
    case "medium": return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case "low": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    default: return <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-destructive/10 text-destructive border-destructive/20"
    case "high": return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "low": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const tableContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const rowItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function ActivityPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = useMemo(() => {
    return allActivityLogs.filter(log => {
      // 1. Role-based access control filtering
      const canView = user.role === 'admin' || log.userId === user.id
      
      // 2. Search query filtering
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = log.id.toLowerCase().includes(searchLower) || 
                            log.target.toLowerCase().includes(searchLower) ||
                            log.type.toLowerCase().includes(searchLower)
                            
      return canView && matchesSearch
    })
  }, [user, searchQuery])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground mt-1">Detailed history of all structural scans and detections.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search scans..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64 transition-shadow"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors active:scale-95 whitespace-nowrap">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/50 text-muted-foreground text-sm">
                <th className="px-6 py-4 font-semibold">Scan ID</th>
                <th className="px-6 py-4 font-semibold">Target Structure</th>
                <th className="px-6 py-4 font-semibold">Detection Result</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Confidence</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                {user.role === 'admin' && (
                  <th className="px-6 py-4 font-semibold">User ID</th>
                )}
              </tr>
            </thead>
            <motion.tbody variants={tableContainer} initial="hidden" animate="show" className="divide-y divide-border/50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <motion.tr variants={rowItem} key={log.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors">{log.id}</td>
                    <td className="px-6 py-4 font-medium">{log.target}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(log.severity)}
                        <span>{log.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getSeverityBadge(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{log.confidence}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{log.time}</td>
                    {user.role === 'admin' && (
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {log.userId}
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <motion.tr variants={rowItem}>
                  <td colSpan={user.role === 'admin' ? 7 : 6} className="px-6 py-8 text-center text-muted-foreground">
                    No scan history found.
                  </td>
                </motion.tr>
              )}
            </motion.tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredLogs.length > 0 ? 1 : 0} to {filteredLogs.length} of {filteredLogs.length} results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded-md hover:bg-secondary disabled:opacity-50 transition-colors" disabled>Previous</button>
            <button className="px-3 py-1 border border-border rounded-md hover:bg-secondary transition-colors active:scale-95" disabled={filteredLogs.length <= 7}>Next</button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
