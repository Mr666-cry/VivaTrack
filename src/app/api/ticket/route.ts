import { NextRequest, NextResponse } from 'next/server'

// Telegram configuration
const TELEGRAM_BOT_TOKEN = '8528430395:AAGnHi7bI34Q-7-FHx0tYD5NICmvQcgQyb0'
const TELEGRAM_CHAT_ID = '7625804862'

// Generate random ticket code
function generateTicketCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'VT-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Send message to Telegram
async function sendToTelegram(message: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })
    return response.ok
  } catch (error) {
    console.error('Telegram error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, deskripsi, email } = body

    if (!deskripsi || !email) {
      return NextResponse.json(
        { success: false, error: 'Deskripsi dan email wajib diisi' },
        { status: 400 }
      )
    }

    const ticketCode = generateTicketCode()
    
    // Send ticket to Telegram
    const telegramMessage = `🎫 *TIKET SUPPORT BARU*

📝 *Kode Tiket:* ${ticketCode}

👤 *Nama:* ${nama || 'Anonim'}
📧 *Email:* ${email}
📝 *Masalah:*
${deskripsi}

---
📅 ${new Date().toLocaleString('id-ID')}
📱 Dari: VitaTrack App`

    const telegramSuccess = await sendToTelegram(telegramMessage)

    // Determine status based on Telegram send result
    const status = telegramSuccess ? 'Terkirim' : 'Pending'

    return NextResponse.json({
      success: true,
      ticket: {
        code: ticketCode,
        nama: nama || 'Anonim',
        deskripsi: deskripsi,
        email: email,
        status: status,
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Ticket error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
