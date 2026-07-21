"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DamageResults from "@/components/damage-results"
import { Upload, Loader2 } from 'lucide-react'
import { runInference, initializeModel } from "@/lib/model-inference"
import { motion, AnimatePresence } from "framer-motion"

interface DamageResult {
  type: string
  confidence: number
  description: string
  severity: "low" | "medium" | "high" | "critical"
}

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [results, setResults] = useState<DamageResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverReady, setServerReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkServer = async () => {
      try {
        await initializeModel()
        console.log("[v0] Model initialized")
        setServerReady(true)
      } catch (err) {
        console.log("[v0] Model initialization failed")
        setServerReady(false)
      }
    }
    checkServer()
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      setResults(null)
      setLoading(true)

      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        setImage(base64)

        try {
          console.log("[v0] Starting inference...")
          const data = await runInference(base64)
          console.log("[v0] Inference complete")
          setResults(data)
        } catch (err) {
          console.error("[v0] Inference error:", err)
          setError(err instanceof Error ? err.message : "Detection failed. Please try another image.")
        } finally {
          setLoading(false)
        }
      }
      
      reader.onerror = () => {
        setError("Failed to read image file")
        setLoading(false)
      }
      
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    } finally {
      if (e.target) {
        e.target.value = ""
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInputRef.current.files = dataTransfer.files
        handleFileSelect({ target: fileInputRef.current } as any)
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      {serverReady ? (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm">AI damage detection ready - running in browser</p>
        </motion.div>
      ) : (
        <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <p className="text-emerald-400 text-sm">Loading AI model...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden h-full flex flex-col">
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Image
              </h2>

              <motion.div
                animate={isDragging ? { scale: 1.02, backgroundColor: "hsl(var(--primary) / 0.1)" } : { scale: 1, backgroundColor: "transparent" }}
                whileHover={!isDragging ? { scale: 1.01, backgroundColor: "hsl(var(--primary) / 0.05)" } : {}}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 flex flex-col justify-center relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary shadow-[0_0_30px_rgba(var(--primary),0.15)]" : "border-muted-foreground/30 hover:border-primary"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                {image ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 w-full">
                    <div className="relative h-64 w-full rounded-lg overflow-hidden border border-border shadow-inner group">
                      <Image src={image || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      {loading && (
                        <div className="absolute inset-0 bg-primary/20 z-10 overflow-hidden">
                          <div className="w-full h-1 bg-primary absolute animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(var(--primary),1)]" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium tracking-wide">Click to change image</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4 flex flex-col items-center justify-center">
                    <motion.div 
                      animate={isDragging ? { y: -10, color: "hsl(var(--primary))" } : { y: 0 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      <Upload className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <p className="text-foreground font-semibold mb-1">Drag and drop your image here</p>
                      <p className="text-muted-foreground text-sm">or click to browse from your device</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <Button
                onClick={() => {
                  setImage(null)
                  setResults(null)
                  setError(null)
                }}
                disabled={!image}
                variant="outline"
                className="w-full mt-6"
              >
                Clear
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div className="h-full" layout>
          {loading ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
              <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-r-2 border-primary/70 rounded-full animate-spin opacity-75 animation-delay-150"></div>
                  <div className="absolute inset-4 border-b-2 border-primary/40 rounded-full animate-spin opacity-50 animation-delay-300"></div>
                  <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Structure</h3>
                <p className="text-muted-foreground text-sm text-center max-w-xs">Running multi-layered neural network inference to detect surface anomalies...</p>
              </Card>
            </motion.div>
          ) : results ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="h-full">
              <DamageResults result={results} />
            </motion.div>
          ) : (
            <Card className="bg-card/30 backdrop-blur-sm border-border/50 p-8 h-full min-h-[400px] flex items-center justify-center border-dashed shadow-sm">
              <p className="text-muted-foreground font-medium text-center max-w-sm">Upload an image of a structural component to begin AI analysis</p>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
