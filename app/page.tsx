"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import MarketingHeader from "@/components/marketing-header"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Zap, Activity, BrainCircuit, ChevronDown, CheckCircle2, Hexagon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <MarketingHeader />
      
      <main>
        {/* Modern Hero Section */}
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[75vh]">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          {/* Glowing Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" 
          />

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-6 relative z-10 text-center w-full flex flex-col items-center"
          >
            {/* Version Badge */}
            <motion.div variants={fadeUp} className="relative group cursor-pointer mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-emerald-500/20 text-foreground text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Structura AI Engine v2.0 Live
                <ChevronDown className="w-4 h-4 text-emerald-600/70 dark:text-emerald-400/70 -rotate-90 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              Structural Analysis, <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 blur-2xl opacity-20"></span>
                <span className="relative bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  Powered by Intelligence.
                </span>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Upload images of structural components and let our <strong className="text-foreground font-medium">multi-layered neural networks</strong> detect rust, cracks, and fatigue with <strong className="text-foreground font-medium">sub-millimeter precision</strong> in milliseconds.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-row justify-center items-center gap-4 sm:gap-6 mt-4">
              <Link href="/dashboard" className="relative group inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <Button size="lg" className="relative text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 bg-emerald-600 text-white hover:bg-emerald-700 border-none transition-all w-full sm:w-auto shadow-lg shadow-emerald-900/20">
                  Launch Console <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features" className="inline-block">
                <Button size="lg" variant="outline" className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 border-border/50 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 backdrop-blur-sm transition-all w-full sm:w-auto">
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-16 md:py-20 bg-secondary/10 border-y border-border overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-[100%] pointer-events-none" />
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-6 relative z-10"
          >
            <motion.div variants={fadeUp} className="text-center mb-20 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-4 h-4" /> Capabilities
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Enterprise-Grade Detection</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">Built for structural engineers, powered by next-generation computer vision algorithms designed for mission-critical reliability.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Zap, 
                  title: "Real-Time Inference", 
                  desc: "Get results in milliseconds using edge-optimized ONNX models directly in your browser without compromising data privacy."
                },
                { 
                  icon: ShieldCheck, 
                  title: "Unmatched Accuracy", 
                  desc: "Trained on millions of structural failure points, delivering extreme precision for rust, crack, and fatigue detection."
                },
                { 
                  icon: BrainCircuit, 
                  title: "Adaptive Learning", 
                  desc: "Our vision models dynamically adapt to complex lighting, shadows, and skewed angles automatically."
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeUp}
                  className="group h-full"
                >
                  <div className="relative h-full">
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/40 to-teal-500/40 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <Card className="relative bg-card/90 backdrop-blur-xl p-6 h-full flex flex-col border-border/40 hover:border-emerald-500/40 transition-colors duration-500 rounded-2xl overflow-hidden z-10 shadow-lg group-hover:shadow-emerald-900/10">
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
                        <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-500 dark:group-hover:from-emerald-400 dark:group-hover:to-teal-300 transition-all duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                        {feature.desc}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="py-16 md:py-20 overflow-hidden">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-16">
              <motion.div variants={fadeUp} className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Analyze Everything. <br/>Miss Nothing.</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Structura AI doesn't just look at pixels. It analyzes edge strength, chromatic dispersion, and structural continuity to classify anomalies.
                </p>
                <motion.ul variants={staggerContainer} className="space-y-4">
                  {["Micro-fracture Detection", "Corrosion & Rust Mapping", "Structural Deformation Analysis"].map((item, i) => (
                    <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 text-foreground font-medium">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
              <motion.div variants={fadeUp} className="flex-1 relative w-full h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent blur-3xl rounded-full" />
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
                  <Card className="relative bg-card border-border p-2 shadow-2xl h-full overflow-hidden group">
                    <div className="w-full h-full bg-zinc-950 rounded-md overflow-hidden relative border border-border/50 font-mono">
                      
                      {/* Advanced Wireframe Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff0015_1px,transparent_1px),linear-gradient(to_bottom,#00ff0015_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff0005_1px,transparent_1px),linear-gradient(to_bottom,#00ff0005_1px,transparent_1px)] bg-[size:10px_10px]"></div>

                      {/* Mock 3D structure (bridge support) */}
                      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                        <polygon points="30%,100% 40%,20% 60%,20% 70%,100%" fill="none" stroke="currentColor" className="text-primary/50" strokeWidth="2" strokeDasharray="5,5" />
                        <line x1="40%" y1="20%" x2="45%" y2="0" stroke="currentColor" className="text-primary/50" strokeWidth="1" />
                        <line x1="60%" y1="20%" x2="55%" y2="0" stroke="currentColor" className="text-primary/50" strokeWidth="1" />
                        <polygon points="35%,60% 65%,60% 68%,80% 32%,80%" fill="none" stroke="currentColor" className="text-primary/30" strokeWidth="1" />
                      </svg>

                      {/* Moving Tracking Crosshair 1 */}
                      <motion.div 
                        animate={{ x: ["0%", "50%", "-20%", "0%"], y: ["0%", "-30%", "20%", "0%"] }}
                        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 w-8 h-8 pointer-events-none z-10"
                      >
                        <div className="absolute inset-0 border border-primary rounded-full opacity-50 scale-150 animate-ping"></div>
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-primary -translate-x-1/2"></div>
                        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-primary -translate-y-1/2"></div>
                      </motion.div>

                      {/* Bounding box 1 (Critical Crack) */}
                      <motion.div 
                        animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                        transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.4, 0.7, 0.8, 1] }}
                        className="absolute top-[35%] left-[45%] w-24 h-24 border-2 border-destructive bg-destructive/10 z-20 backdrop-blur-sm"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }} 
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="absolute -top-6 left-[-2px] bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 whitespace-nowrap shadow-[0_0_10px_rgba(239,68,68,0.5)] flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          CRITICAL: CRACK [99.4%]
                        </motion.div>
                        <div className="w-2 h-2 border-t-2 border-l-2 border-destructive absolute -top-1 -left-1"></div>
                        <div className="w-2 h-2 border-t-2 border-r-2 border-destructive absolute -top-1 -right-1"></div>
                        <div className="w-2 h-2 border-b-2 border-l-2 border-destructive absolute -bottom-1 -left-1"></div>
                        <div className="w-2 h-2 border-b-2 border-r-2 border-destructive absolute -bottom-1 -right-1"></div>
                      </motion.div>

                      {/* Bounding box 2 (Surface Rust) */}
                      <motion.div 
                        animate={{ opacity: [0, 0, 0, 1, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.6, 0.9, 0.95, 1] }}
                        className="absolute bottom-[20%] right-[35%] w-16 h-16 border-2 border-yellow-500 bg-yellow-500/10 z-20"
                      >
                        <div className="absolute -top-6 right-[-2px] bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 whitespace-nowrap shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                          RUST [76.2%]
                        </div>
                      </motion.div>

                      {/* Thick Scanner Line with Glow */}
                      <motion.div 
                        animate={{ top: ["-10%", "110%", "-10%"] }}
                        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                        className="w-full absolute z-30"
                      >
                        <div className="h-[2px] bg-primary shadow-[0_0_20px_5px_rgba(var(--primary),0.8)] w-full"></div>
                        <div className="h-48 bg-gradient-to-b from-transparent via-primary/10 to-primary/30 w-full -translate-y-full blur-sm"></div>
                      </motion.div>

                      {/* Technical Data Overlay (Left) */}
                      <div className="absolute left-2 top-2 bottom-2 w-32 border-l border-primary/30 pl-2 text-[8px] text-primary/70 flex flex-col justify-between z-10 pointer-events-none hidden sm:flex">
                        <div className="space-y-1">
                          <p>SYS.STATUS: <span className="text-emerald-500">ONLINE</span></p>
                          <p>MODEL: CNN_v4.2</p>
                          <p>LATENCY: 42ms</p>
                        </div>
                        <div className="space-y-1 opacity-50">
                          <p>0x7F2A9C</p>
                          <p>0x4B1E3D</p>
                          <p>0x9C2F1A</p>
                          <p>0x1A4B8C</p>
                        </div>
                      </div>

                      {/* Live Target Feed Overlay (Right) */}
                      <div className="absolute right-4 top-4 bg-black/60 backdrop-blur-md border border-primary/40 rounded-sm p-2 z-10 hidden sm:block">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-[9px] text-primary uppercase font-bold tracking-widest">Live Feed</span>
                        </div>
                        <div className="h-16 w-24 bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                           <motion.div 
                              animate={{ backgroundPosition: ["0px 0px", "0px -100px"] }}
                              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMzMzIiAvPgo8L3N2Zz4=')] opacity-50"
                           ></motion.div>
                        </div>
                      </div>

                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-primary text-primary-foreground overflow-hidden">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Images Analyzed", value: "2M+" },
                { label: "Detection Accuracy", value: "99.4%" },
                { label: "Inference Time", value: "<50ms" },
                { label: "Enterprise Users", value: "500+" }
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeUp} className="space-y-2">
                  <h4 className="text-4xl font-extrabold tracking-tight text-white">{stat.value}</h4>
                  <p className="text-white/80 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-20 bg-secondary/30 overflow-hidden">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto px-6"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</motion.h2>
            <div className="space-y-4">
              {[
                { q: "How does the AI model work?", a: "We use a proprietary ONNX-compiled convolutional neural network (CNN) running directly in your browser or edge environment to ensure maximum privacy and speed." },
                { q: "Is my data secure?", a: "Yes. In browser-mode, images never leave your device. For server-mode, all data is processed ephemerally and instantly deleted." },
                { q: "What types of damage can it detect?", a: "Currently: Rust, Corrosion, Surface Cracks, Dents, and Bends across metallic and concrete surfaces." }
              ].map((faq, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ x: 5 }}>
                  <Card className="p-6 bg-card border-border transition-colors hover:border-primary/50 cursor-pointer">
                    <h4 className="text-lg font-semibold mb-2 flex items-center justify-between">
                      {faq.q} <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </h4>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-6">
          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <Hexagon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div className="absolute inset-0 bg-emerald-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-foreground">Structura AI</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The modern standard for intelligent structural analysis and defect detection.
            </p>
          </div>
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Structura AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
