import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Timeout configuration for Vercel
const TIMEOUT_MS = parseInt(process.env.SCAN_TIMEOUT_MS || '25000')

// Initialize ZAI instance (singleton pattern for serverless)
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null
let zaiInstancePromise: Promise<Awaited<ReturnType<typeof ZAI.create>>> | null = null

async function getZAI() {
  // If already initialized, return it
  if (zaiInstance) {
    return zaiInstance
  }
  
  // If initialization is in progress, wait for it
  if (zaiInstancePromise) {
    return zaiInstancePromise
  }
  
  // Start initialization
  zaiInstancePromise = ZAI.create().then(instance => {
    zaiInstance = instance
    return instance
  }).catch(error => {
    zaiInstancePromise = null
    throw error
  })
  
  return zaiInstancePromise
}

// Goal descriptions for different health plans
const GOAL_MAP: Record<string, string> = {
  diet: 'Diet Ketat (Mengurangi Kalori) - Fokus pada defisit kalori yang signifikan.',
  weightloss: 'Menurunkan Berat Badan (Defisit Moderat) - Mengurangi asupan kalori secara bertahap.',
  cheeks: 'Meniruskan Pipi (Mengurangi Retensi Air & Garam) - Fokus pada pengurangan sodium/garam dan retensi air.',
  healthy: 'Hidup Sehat (Keseimbangan Nutrisi) - Memastikan keseimbangan makronutrien dan mikronutrien.'
}

interface NutritionData {
  makanan_teridentifikasi: string
  perkiraan_kalori: number
  karbohidrat_g: number
  protein_g: number
  lemak_g: number
  tingkat_kesehatan_skor: number
  porsi_saran: string
  ringkasan_saran: string
}

export const maxDuration = 60 // For Vercel Pro plan

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, goal } = body as { image: string; goal: string }

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Gambar diperlukan' },
        { status: 400 }
      )
    }

    if (!goal || goal === 'none') {
      return NextResponse.json(
        { success: false, error: 'Silakan pilih rencana kesehatan terlebih dahulu' },
        { status: 400 }
      )
    }

    const goalDescription = GOAL_MAP[goal] || GOAL_MAP.healthy
    
    // Get ZAI instance with timeout
    const zaiPromise = getZAI()
    const zai = await Promise.race([
      zaiPromise,
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('ZAI init timeout')), 5000)
      )
    ]) as Awaited<ReturnType<typeof ZAI.create>>

    // Create the prompt for food analysis
    const prompt = `Analisis gambar makanan ini dan berikan informasi nutrisi berdasarkan tujuan: "${goalDescription}"

Berikan respons HANYA dalam format JSON yang valid (tanpa markdown code blocks) dengan struktur berikut:
{
  "makanan_teridentifikasi": "Nama makanan yang teridentifikasi",
  "perkiraan_kalori": angka_kalori,
  "karbohidrat_g": angka_karbohidrat,
  "protein_g": angka_protein,
  "lemak_g": angka_lemak,
  "tingkat_kesehatan_skor": angka_1_sampai_5,
  "porsi_saran": "Saran porsi yang sesuai dengan tujuan kesehatan",
  "ringkasan_saran": "Ringkasan saran singkat dalam bahasa Indonesia tentang makanan ini sesuai dengan tujuan kesehatan"
}

Penting:
- Berikan estimasi realistis berdasarkan tampilan visual makanan
- tingkat_kesehatan_skor harus antara 1-5 (5 = sangat sehat)
- porsi_saran harus sesuai dengan tujuan kesehatan yang dipilih
- ringkasan_saran harus memberikan saran praktis dalam bahasa Indonesia`

    // Call VLM API with timeout
    const response = await Promise.race([
      zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image // image should be base64 data URL
                }
              }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      }),
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Scan timeout')), TIMEOUT_MS)
      )
    ])

    if (!response || !('choices' in response)) {
      return NextResponse.json(
        { success: false, error: 'Tidak dapat menganalisis gambar (timeout)' },
        { status: 500 }
      )
    }

    const content = response.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Tidak dapat menganalisis gambar' },
        { status: 500 }
      )
    }

    // Parse JSON from response
    let nutritionData: NutritionData
    try {
      // Try to extract JSON from response (handle potential markdown code blocks)
      let jsonStr = content.trim()
      
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      nutritionData = JSON.parse(jsonStr) as NutritionData
    } catch (parseError) {
      console.error('Failed to parse nutrition data:', content)
      return NextResponse.json(
        { success: false, error: 'Gagal memproses data nutrisi' },
        { status: 500 }
      )
    }

    // Validate required fields
    if (!nutritionData.makanan_teridentifikasi) {
      nutritionData.makanan_teridentifikasi = 'Tidak teridentifikasi'
    }

    return NextResponse.json({
      success: true,
      data: {
        ...nutritionData,
        tujuan: goalDescription
      }
    })

  } catch (error) {
    console.error('Scan food error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
