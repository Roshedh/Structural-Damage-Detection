import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import * as ort from "onnxruntime-node"
import path from "path"
import { Jimp } from "jimp"

interface DamageResult {
  type: string
  confidence: number
  description: string
  severity: "low" | "medium" | "high" | "critical"
}

// 1. Strict input validation with size limit (Max 5MB for base64)
const RequestSchema = z.object({
  image: z
    .string()
    .min(1, "Image is required")
    .max(7 * 1024 * 1024, "Image exceeds maximum allowed size (5MB limit)") // Base64 encoding adds ~33% overhead, so 7MB base64 is ~5MB binary
    .refine((val) => {
      // Must start with valid image base64 format (jpeg, png, webp, gif)
      return /^data:image\/(jpeg|png|webp|gif);base64,/.test(val)
    }, "Invalid image format. Only JPEG, PNG, WEBP, and GIF data URIs are permitted."),
})

// 2. Simple Server-Side In-Memory Rate Limiting
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15     // 15 requests per minute per IP

interface RateLimitBucket {
  count: number
  resetTime: number
}

const rateLimitDb = new Map<string, RateLimitBucket>()

function getRateLimitHeaders(ip: string): { limitReached: boolean; headers: Record<string, string> } {
  const now = Date.now()
  let bucket = rateLimitDb.get(ip)

  if (!bucket || now > bucket.resetTime) {
    bucket = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    }
  }

  bucket.count += 1
  rateLimitDb.set(ip, bucket)

  const limitReached = bucket.count > MAX_REQUESTS_PER_WINDOW
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - bucket.count)
  const resetSeconds = Math.ceil((bucket.resetTime - now) / 1000)

  return {
    limitReached,
    headers: {
      "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(resetSeconds),
    },
  }
}

// 3. Set Secure Security Headers for responses
const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "same-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
}

let session: ort.InferenceSession | null = null

async function getModelSession() {
  if (!session) {
    const modelPath = path.join(process.cwd(), "public", "damage_model.onnx")
    session = await ort.InferenceSession.create(modelPath)
  }
  return session
}

// ONNX damage detection logic
async function analyzeDamage(imageData: string): Promise<DamageResult> {
  const damageTypes = [
    { type: "rust_corrosion", description: "Significant corrosion detected. Oxidized metal surfaces with orange-brown discoloration. Recommend immediate treatment to prevent further deterioration.", severity: "high" as const },
    { type: "dent", description: "Minor structural deformation observed. Surface indentation without material loss. Monitor for stress concentration.", severity: "medium" as const },
    { type: "fatigue_crack", description: "Potential stress fracture detected. Linear discontinuity in material integrity. Requires detailed inspection.", severity: "high" as const },
    { type: "no_damage", description: "Surface appears intact. No visible structural damage detected. Condition is normal.", severity: "low" as const }
  ]

  try {
    const modelSession = await getModelSession()
    
    // Extract base64 part
    const base64Data = imageData.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Process image with Jimp
    const image = await Jimp.read(buffer)
    image.resize(224, 224)
    
    const imageBufferData = image.bitmap.data
    const float32Data = new Float32Array(3 * 224 * 224)
    
    // ImageNet Normalization
    const mean = [0.485, 0.456, 0.406]
    const std = [0.229, 0.224, 0.225]
    
    for (let i = 0; i < 224 * 224; i++) {
      float32Data[i] = (imageBufferData[i * 4] / 255.0 - mean[0]) / std[0] // R
      float32Data[i + 224 * 224] = (imageBufferData[i * 4 + 1] / 255.0 - mean[1]) / std[1] // G
      float32Data[i + 2 * 224 * 224] = (imageBufferData[i * 4 + 2] / 255.0 - mean[2]) / std[2] // B
    }
    
    const tensor = new ort.Tensor('float32', float32Data, [1, 3, 224, 224])
    
    const results = await modelSession.run({ input: tensor })
    const output = results.output.data as Float32Array
    
    // Softmax to get probabilities
    const exps = Array.from(output).map(Math.exp)
    const sumExps = exps.reduce((a, b) => a + b, 0)
    const probs = exps.map(e => e / sumExps)
    
    // Find max probability index
    let maxIdx = 0
    let maxProb = 0
    for (let i = 0; i < probs.length; i++) {
      if (probs[i] > maxProb) {
        maxProb = probs[i]
        maxIdx = i
      }
    }
    
    return {
      ...damageTypes[maxIdx],
      confidence: maxProb,
    }
  } catch (error) {
    console.error("ONNX inference failed:", error)
    throw new Error("Failed to process image through model")
  }
}

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1"
  
  // Rate Limiting Check
  const { limitReached, headers: rateLimitHeaders } = getRateLimitHeaders(ip)
  const responseHeaders = { ...SECURITY_HEADERS, ...rateLimitHeaders }

  if (limitReached) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429, 
        headers: responseHeaders 
      }
    )
  }

  // CSRF Protection / Origin Validation
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  const referer = request.headers.get("referer")

  if (origin) {
    try {
      const originUrl = new URL(origin)
      if (originUrl.host !== host) {
        return NextResponse.json(
          { error: "Access Denied: Cross-origin request blocked." },
          { 
            status: 403, 
            headers: responseHeaders 
          }
        )
      }
    } catch (e) {
      return NextResponse.json(
        { error: "Access Denied: Invalid request origin." },
        { 
          status: 403, 
          headers: responseHeaders 
        }
      )
    }
  } else if (referer) {
    try {
      const refererUrl = new URL(referer)
      if (refererUrl.host !== host) {
        return NextResponse.json(
          { error: "Access Denied: Cross-origin reference blocked." },
          { 
            status: 403, 
            headers: responseHeaders 
          }
        )
      }
    } catch (e) {
      return NextResponse.json(
        { error: "Access Denied: Invalid referrer." },
        { 
          status: 403, 
          headers: responseHeaders 
        }
      )
    }
  }

  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = RequestSchema.parse(body)

    // Analyze the image
    const result = await analyzeDamage(validatedData.image)

    return NextResponse.json(result, {
      headers: responseHeaders
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request payload", details: error.errors }, 
        { 
          status: 400, 
          headers: responseHeaders 
        }
      )
    }
    console.error("Detection error:", error)
    return NextResponse.json(
      { error: "Failed to analyze image" }, 
      { 
        status: 500, 
        headers: responseHeaders 
      }
    )
  }
}
