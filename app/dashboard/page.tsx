"use client"

import { Card } from "@/components/ui/card"
import { Activity, ShieldAlert, CheckCircle2, TrendingUp } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

const chartData = [
  { name: "Mon", scans: 140 },
  { name: "Tue", scans: 210 },
  { name: "Wed", scans: 180 },
  { name: "Thu", scans: 290 },
  { name: "Fri", scans: 250 },
  { name: "Sat", scans: 110 },
  { name: "Sun", scans: 90 },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DashboardOverview() {
  const { user } = useAuth()
  
  // Calculate stats dynamically based on role
  const totalScansValue = user.role === 'admin' ? "1,270" : "14" // Demo values
  const criticalAnomaliesValue = user.role === 'admin' ? "24" : "1"

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Platform activity and scan metrics over the last 7 days.</p>
      </motion.div>

      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Scans", value: totalScansValue, icon: Activity, change: "+12.5%", positive: true },
          { label: "Critical Anomalies", value: criticalAnomaliesValue, icon: ShieldAlert, change: "-4.1%", positive: true },
          { label: "Healthy Structures", value: "98.1%", icon: CheckCircle2, change: "+1.2%", positive: true },
          { label: "Avg. Confidence", value: "94.8%", icon: TrendingUp, change: "+0.3%", positive: true },
        ].map((stat, i) => (
          <motion.div key={i} variants={item} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="p-6 bg-card border-border shadow-sm flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-md">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={stat.positive ? "text-emerald-500 font-medium" : "text-destructive font-medium"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-2">vs last week</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="col-span-2">
          <Card className="p-6 bg-card border-border shadow-sm h-full">
            <h3 className="text-lg font-bold mb-4">Scan Volume</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 bg-card border-border shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-bold mb-4">Recent Alerts</h3>
            <motion.div variants={container} className="flex-1 space-y-4">
              {[
                { target: "Bridge Support Alpha", type: "Critical Crack", time: "2h ago" },
                { target: "Pipeline Section 4", type: "Severe Corrosion", time: "5h ago" },
                { target: "Warehouse Roof", type: "Metal Fatigue", time: "1d ago" },
                { target: "Rail Overpass", type: "Concrete Spalling", time: "1d ago" },
              ].map((alert, i) => (
                <motion.div key={i} variants={item} className="flex items-center gap-4 p-3 rounded-md bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors cursor-default">
                  <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{alert.target}</p>
                    <p className="text-xs text-muted-foreground">{alert.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </motion.div>
              ))}
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
