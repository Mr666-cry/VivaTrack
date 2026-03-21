import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// OpenRouter configuration
const OPENROUTER_API_KEY = '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'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Telegram configuration
const TELEGRAM_BOT_TOKEN = '8528430395:AAGnHi7bI34Q-7-FHx0tYD5NICmvQcgQyb0'
const TELEGRAM_CHAT_ID = '7625804862'

// Timeout configuration
// Vercel Hobby: max 10s, Pro: max 60s, Enterprise: max 900s
// Default to 25s to be safe for most plans (gives buffer for network latency)
const TIMEOUT_MS = parseInt(process.env.CHAT_TIMEOUT_MS || '25000')

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

// Send message to Telegram
async function sendToTelegram(userMessage: string, aiResponse: string) {
  try {
    const text = `💬 *Chat VitaTrack*\n\n👤 User: ${userMessage.substring(0, 200)}...\n\n🤖 AI: ${aiResponse.substring(0, 200)}...\n\n---\n📅 ${new Date().toLocaleString('id-ID')}`
    
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    })
  } catch (error) {
    console.error('Telegram error:', error)
  }
}

// System prompt for health customer service
const SYSTEM_PROMPT = `Anda adalah Customer Service VitaTrack, layanan kesehatan digital. 
Anda adalah AI yang diintegrasikan ke dalam aplikasi VitaTrack oleh @SamuDev untuk membantu layanan agar mempermudah orang memakai layanan VitaTrack.

Tugas Anda:
- Membantu pengguna dengan pertanyaan seputar kesehatan, nutrisi, dan pola hidup sehat
- Memberikan saran yang informatif dan ramah
- Menjawab pertanyaan tentang fitur VitaTrack (scan makanan, target berat badan, pola hidup sehat)
- Selalu menjawab dalam Bahasa Indonesia yang baik dan ramah
- Jika ditanya siapa pencipta/developer/creator Anda, jawab: "Saya adalah AI yang diintegrasikan ke dalam aplikasi VitaTrack oleh **@SamuDev** untuk membantu pengguna memakai layanan VitaTrack dengan lebih mudah. 😊"

Kepribadian Anda:
- Ramah, sabar, dan profesional
- Menggunakan emoji yang sesuai untuk membuat percakapan lebih hangat ☺️
- Memberikan saran yang praktis dan mudah dipahami
- Tidak memberikan diagnosis medis, selalu sarankan konsultasi dokter untuk masalah serius

Informasi Kontak Developer:
- WhatsApp: +62 895-1821-7767 (https://wa.me/6289518217767)
- Telegram: @SamuDev (https://t.me/SamuDev)
- Email: codexcraft20@gmail.com

Jika ditanya tentang kontak developer atau cara menghubungi developer, berikan informasi kontak di atas dengan format yang rapi.

Contoh respons:
- Jika ditanya tentang fitur VitaTrack: Jelaskan fitur scan makanan untuk analisis nutrisi, target berat badan dengan AI, dan tips pola hidup sehat
- Jika ditanya tentang diet: Berikan saran umum dan sarankan fitur scan makanan atau target berat badan
- Jika ditanya masalah kesehatan serius: Sarankan untuk konsultasi dengan tenaga medis profesional
- Jika ditanya siapa pembuat/pencipta/developer: Jawab bahwa Anda adalah AI yang diintegrasikan oleh @SamuDev

Selalu mulai dengan salam yang ramah dan tawarkan bantuan.`

// Error message for service unavailable
const SERVICE_ERROR_MESSAGE = `Maaf, layanan Customer Service sedang bermasalah 😔

Harap hubungi Developer untuk info lebih lanjut:

📱 *Kontak Developer:*
• WhatsApp: [click here](https://wa.me/6289518217767)
• Telegram: @SamuDev`

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Try ZAI SDK first (PRIMARY)
async function tryZAI(messages: Array<{role: string; content: string}>): Promise<string | null> {
  try {
    console.log('Trying ZAI SDK...')
    
    // Get ZAI instance with timeout
    const zaiPromise = getZAI()
    const zai = await Promise.race([
      zaiPromise,
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('ZAI init timeout')), 5000)
      )
    ]) as Awaited<ReturnType<typeof ZAI.create>>
    
    // Create chat completion with timeout
    const completion = await Promise.race([
      zai.chat.completions.create({
        messages: messages,
        thinking: { type: 'disabled' }
      }),
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('ZAI timeout')), TIMEOUT_MS)
      )
    ])

    if (completion && 'choices' in completion) {
      console.log('ZAI SDK success!')
      return completion.choices?.[0]?.message?.content || null
    }
    return null
  } catch (error) {
    console.error('ZAI error:', error instanceof Error ? error.message : error)
    return null
  }
}

// Try OpenRouter API (FALLBACK)
async function tryOpenRouter(messages: Array<{role: string; content: string}>): Promise<string | null> {
  try {
    console.log('Trying OpenRouter...')
    const response = await fetchWithTimeout(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: messages
      })
    }, TIMEOUT_MS)

    if (!response.ok) {
      console.log('OpenRouter response not OK:', response.status)
      return null
    }

    const data = await response.json()
    console.log('OpenRouter success!')
    return data.choices?.[0]?.message?.content || null
  } catch (error) {
    console.error('OpenRouter error:', error instanceof Error ? error.message : error)
    return null
  }
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const maxDuration = 60 // For Vercel Pro plan

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, newMessage } = body as { 
      messages: Message[]
      newMessage: string 
    }

    if (!newMessage || newMessage.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Pesan diperlukan' },
        { status: 400 }
      )
    }

    // Filter out the initial greeting message from frontend
    const filteredMessages = (messages || []).filter(msg => 
      !msg.content.includes('Halo! Saya Customer Service')
    )

    // Build conversation messages
    const conversationMessages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...filteredMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: newMessage
      }
    ]

    // Try ZAI SDK first (PRIMARY)
    let aiResponse = await tryZAI(conversationMessages)

    // If ZAI fails, try OpenRouter (FALLBACK)
    if (!aiResponse) {
      console.log('ZAI failed, trying OpenRouter...')
      aiResponse = await tryOpenRouter(conversationMessages)
    }

    // If both fail, return error message
    if (!aiResponse) {
      console.log('Both ZAI and OpenRouter failed')
      return NextResponse.json({
        success: false,
        error: SERVICE_ERROR_MESSAGE
      })
    }

    // Send to Telegram (non-blocking)
    sendToTelegram(newMessage, aiResponse).catch(() => {})

    return NextResponse.json({
      success: true,
      response: aiResponse
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({
      success: false,
      error: SERVICE_ERROR_MESSAGE
    })
  }
}
