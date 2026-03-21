'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { 
  Camera, 
  Upload, 
  Scan, 
  Loader2, 
  Utensils, 
  Flame, 
  Wheat, 
  Beef, 
  Droplet,
  Heart,
  Target,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  X,
  Send,
  ArrowLeft,
  Activity,
  Weight,
  Moon,
  Sun,
  Apple,
  Dumbbell,
  ChevronRight,
  Droplets,
  Scale,
  Plus,
  Minus,
  Sparkles,
  Carrot,
  Ticket,
  Mail,
  User,
  FileText,
  RefreshCw,
  Phone,
  AtSign
} from 'lucide-react'

// ==================== THEME CONTEXT ====================
const ThemeContext = React.createContext<{
  isDark: boolean
  toggleTheme: () => void
}>({
  isDark: false,
  toggleTheme: () => {}
})

function useTheme() {
  return React.useContext(ThemeContext)
}

// ==================== MARKDOWN RENDERER ====================
function renderMarkdown(text: string): string {
  if (!text) return ''
  
  let result = text
  
  // Escape HTML first
  result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  // Bold: **text** or __text__
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>')
  
  // Italic: *text* or _text_
  result = result.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
  result = result.replace(/_([^_\n]+?)_/g, '<em>$1</em>')
  
  // Strikethrough: ~~text~~
  result = result.replace(/~~(.*?)~~/g, '<del>$1</del>')
  
  // Code: `text`
  result = result.replace(/`([^`\n]+?)`/g, '<code class="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
  
  // Links: [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:underline">$1</a>')
  
  // Line breaks
  result = result.replace(/\n/g, '<br />')
  
  return result
}

// ==================== TYPES ====================
type ViewType = 'dashboard' | 'scan-food' | 'healthy-lifestyle' | 'bmi' | 'water' | 'sleep' | 'calories' | 'recipes' | 'weight-target' | 'support-ticket' | 'create-ticket' | 'contact-developer'

interface NutritionData {
  makanan_teridentifikasi: string
  perkiraan_kalori: number
  karbohidrat_g: number
  protein_g: number
  lemak_g: number
  tingkat_kesehatan_skor: number
  porsi_saran: string
  ringkasan_saran: string
  tujuan: string
}

interface WeightPlan {
  target: string
  durasi: string
  kalori_harian: number
  olahraga: string[]
  makanan_dianjurkan: string[]
  makanan_dihindari: string[]
  tips: string[]
}

interface Ticket {
  code: string
  nama: string
  deskripsi: string
  email: string
  status: string
  createdAt: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ==================== NAVBAR COMPONENT ====================
function Navbar({ currentView, onBack }: { currentView: ViewType; onBack: () => void }) {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <nav className={`backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900/90 border-purple-500/30' 
        : 'bg-white/80 border-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {currentView !== 'dashboard' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className={`mr-1 h-8 w-8 sm:h-10 sm:w-10 ${
                  isDark ? 'hover:bg-purple-500/20' : 'hover:bg-emerald-50'
                }`}
              >
                <ArrowLeft className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-purple-400' : 'text-emerald-600'}`} />
              </Button>
            )}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* New Logo - Green & Purple Gradient */}
              <div className="relative h-9 w-9 sm:h-11 sm:w-11">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  {/* Background circle */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="riceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  {/* Circle background */}
                  <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" />
                  {/* Leaf icon */}
                  <path 
                    d="M14 28c0-8 6-14 14-14-2 4-2 8 0 12-4 2-10 6-14 2z" 
                    fill="url(#leafGradient)" 
                    opacity="0.9"
                  />
                  {/* Rice bowl icon */}
                  <ellipse cx="28" cy="30" rx="8" ry="4" fill="url(#riceGradient)" opacity="0.9" />
                  <path d="M20 30c0 4 4 7 8 7s8-3 8-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  {/* Small decorative dots */}
                  <circle cx="24" cy="26" r="1.5" fill="white" opacity="0.8" />
                  <circle cx="28" cy="24" r="1" fill="white" opacity="0.6" />
                  <circle cx="32" cy="27" r="1.2" fill="white" opacity="0.7" />
                </svg>
              </div>
              <div>
                <h1 className={`text-lg sm:text-xl font-extrabold bg-clip-text text-transparent ${
                  isDark 
                    ? 'bg-gradient-to-r from-emerald-400 via-purple-400 to-violet-400' 
                    : 'bg-gradient-to-r from-emerald-600 via-purple-600 to-violet-600'
                }`}>
                  VitaTrack
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className={`text-xs hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Live Healthy</span>
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-purple-500/20 hover:bg-purple-500/30' 
                  : 'bg-amber-100 hover:bg-amber-200'
              }`}
            >
              {isDark ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ==================== TYPING MESSAGE COMPONENT ====================
function TypingMessage({ message, isLast, speed = 5 }: { message: ChatMessage; isLast: boolean; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (message.role === 'assistant' && isLast && message.content && !message.isTyping) {
      setIsTyping(true)
      let index = 0
      setDisplayedText('')
      
      const timer = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedText(message.content.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          clearInterval(timer)
        }
      }, speed)

      return () => clearInterval(timer)
    } else {
      setDisplayedText(message.content)
      setIsTyping(false)
    }
  }, [message.content, message.role, isLast, message.isTyping, speed])

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md text-sm sm:text-base">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-md text-sm sm:text-base">
        <p 
          className="whitespace-pre-wrap prose prose-sm prose-p:my-0 prose-strong:font-bold prose-em:italic prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedText) + (isTyping ? '<span class="inline-block w-1.5 h-4 ml-0.5 bg-emerald-500 animate-pulse"></span>' : '') }}
        />
      </div>
    </div>
  )
}

// ==================== FLOATING CHAT COMPONENT ====================
function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya Customer Service VitaTrack, ada yang bisa saya bantu? ☺️'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          newMessage: userMessage
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.error || 'Maaf, terjadi kesalahan. Silakan coba lagi. 😔'
        }])
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Maaf, koneksi bermasalah. Silakan coba lagi. 😔' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white z-50 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        size="icon"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      {/* Chat Window */}
      <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 overflow-hidden border border-gray-100 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
      }`}>
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Customer Service</h3>
                <p className="text-[10px] sm:text-xs text-white/80">VitaTrack Support</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="h-[260px] sm:h-[300px] p-3 sm:p-4 bg-gray-50">
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <TypingMessage 
                key={idx} 
                message={msg} 
                isLast={idx === messages.length - 1}
                speed={5}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-2 sm:p-3 border-t bg-white">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              className="flex-1 border-gray-200 focus:ring-emerald-500 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-9 w-9 sm:h-10 sm:w-10"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// ==================== FEATURE CARD COMPONENT ====================
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  image, 
  onClick 
}: { 
  icon: React.ElementType
  title: string
  description: string
  color: string
  image?: string
  onClick: () => void 
}) {
  const { isDark } = useTheme()
  
  return (
    <Card 
      className={`group cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-0.5 ${
        isDark ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:bg-white'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {image ? (
          <div className="aspect-[3/2] relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}>
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
              </div>
              <p className="text-[10px] sm:text-xs text-white/90">{description}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm sm:text-base mb-1 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{title}</h3>
                <p className={`text-xs sm:text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
              </div>
              <ChevronRight className={`h-4 w-4 sm:h-5 sm:w-5 transition-all flex-shrink-0 ${isDark ? 'text-gray-600 group-hover:text-purple-400' : 'text-gray-300 group-hover:text-gray-400'} group-hover:translate-x-0.5`} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== DASHBOARD VIEW ====================
function DashboardView({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  const { isDark } = useTheme()
  
  const features = [
    {
      icon: Scan,
      title: 'Scan Food',
      description: 'Analisis nutrisi makanan',
      color: 'from-emerald-400 to-teal-500',
      image: '/images/food-scan.png',
      view: 'scan-food' as ViewType
    },
    {
      icon: Activity,
      title: 'Healthy Lifestyle',
      description: 'Tips pola hidup sehat',
      color: 'from-teal-400 to-cyan-500',
      image: '/images/healthy-lifestyle.png',
      view: 'healthy-lifestyle' as ViewType
    },
  ]

  const quickFeatures = [
    {
      icon: Target,
      title: 'Target Berat Badan',
      description: 'Rencana diet dengan AI',
      color: 'from-rose-400 to-pink-500',
      view: 'weight-target' as ViewType
    },
    {
      icon: Scale,
      title: 'BMI Calculator',
      description: 'Cek indeks massa tubuh',
      color: 'from-blue-400 to-indigo-500',
      view: 'bmi' as ViewType
    },
    {
      icon: Droplets,
      title: 'Water Tracker',
      description: 'Pantau asupan air',
      color: 'from-cyan-400 to-blue-500',
      view: 'water' as ViewType
    },
    {
      icon: Moon,
      title: 'Sleep Tracker',
      description: 'Pantau kualitas tidur',
      color: 'from-violet-400 to-purple-500',
      view: 'sleep' as ViewType
    },
    {
      icon: Flame,
      title: 'Calorie Goals',
      description: 'Target kalori harian',
      color: 'from-orange-400 to-red-500',
      view: 'calories' as ViewType
    },
    {
      icon: Carrot,
      title: 'Resep Sehat',
      description: 'Ide makanan sehat',
      color: 'from-green-400 to-emerald-500',
      view: 'recipes' as ViewType
    },
  ]

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-4 sm:p-6 text-white shadow-lg transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700' 
          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
              Selamat Datang! 👋
            </h2>
            <p className={`text-xs sm:text-sm md:text-base ${isDark ? 'text-purple-200' : 'text-emerald-100'}`}>
              Pantau kesehatan Anda dengan VitaTrack
            </p>
          </div>
          <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-full flex items-center justify-center ${
            isDark ? 'bg-white/20' : 'bg-white/20'
          }`}>
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div>
        <h3 className={`text-sm sm:text-base font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Fitur Utama</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              image={feature.image}
              onClick={() => onNavigate(feature.view)}
            />
          ))}
        </div>
      </div>

      {/* Quick Features */}
      <div>
        <h3 className={`text-sm sm:text-base font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Fitur Lainnya</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {quickFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              onClick={() => onNavigate(feature.view)}
            />
          ))}
        </div>
      </div>

      {/* Support Ticket Section */}
      <div>
        <h3 className={`text-sm sm:text-base font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bantuan</h3>
        <div className="space-y-2 sm:space-y-3">
          <Card 
            className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              isDark ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white'
            }`}
            onClick={() => onNavigate('support-ticket')}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                  <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Support Tiket</h4>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Laporkan masalah atau keluhan</p>
                </div>
                <ChevronRight className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              </div>
            </CardContent>
          </Card>

          {/* Contact Developer */}
          <Card 
            className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              isDark ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white'
            }`}
            onClick={() => onNavigate('contact-developer')}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-purple-400 to-violet-500 flex items-center justify-center shadow-sm">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Kontak Developer</h4>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Hubungi tim pengembang</p>
                </div>
                <ChevronRight className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Health Tips */}
      <Card className={`border-0 shadow-sm transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-900/50 to-violet-900/50' 
          : 'bg-gradient-to-r from-amber-50 to-yellow-50'
      }`}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDark ? 'bg-purple-500/30' : 'bg-amber-100'
            }`}>
              <Sparkles className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-amber-500'}`} />
            </div>
            <div>
              <h4 className={`font-semibold text-sm sm:text-base mb-1 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Tips Hari Ini</h4>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Minum air minimal 8 gelas sehari untuk menjaga tubuh tetap terhidrasi dan meningkatkan metabolisme. 💧
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== SUPPORT TICKET VIEW ====================
function SupportTicketView({ tickets, onNavigate }: { tickets: Ticket[]; onNavigate: (view: ViewType) => void }) {
  return (
    <div className="p-3 sm:p-4 max-w-2xl mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-orange-500" />
            Support Tiket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs sm:text-sm text-gray-500">
            Laporkan masalah atau keluhan Anda. Tim kami akan merespons dalam 1x24 jam.
          </p>

          {/* Create Ticket Button */}
          <Button
            onClick={() => onNavigate('create-ticket')}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Tiket Baru
          </Button>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <Ticket className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Belum ada tiket</p>
              <p className="text-gray-400 text-xs mt-1">Buat tiket pertama Anda untuk melaporkan masalah</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-600">Kode</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-600">Masalah</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, idx) => (
                    <tr key={ticket.code} className={idx !== tickets.length - 1 ? 'border-b border-gray-100' : ''}>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {ticket.code}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600">
                        <p className="line-clamp-1">{ticket.deskripsi}</p>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
                          ticket.status === 'Terkirim' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== CREATE TICKET VIEW ====================
function CreateTicketView({ onBack, onTicketCreated }: { onBack: () => void; onTicketCreated: (ticket: Ticket) => void }) {
  const [nama, setNama] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null)

  const handleSubmit = async () => {
    if (!deskripsi.trim() || !email.trim()) {
      alert('Deskripsi dan email wajib diisi!')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: nama.trim() || 'Anonim',
          deskripsi: deskripsi.trim(),
          email: email.trim()
        })
      })

      const data = await response.json()

      if (data.success && data.ticket) {
        setCreatedTicket(data.ticket)
        setShowSuccess(true)
      } else {
        alert('Terjadi kesalahan. Silakan coba lagi.')
      }
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessClose = () => {
    if (createdTicket) {
      onTicketCreated(createdTicket)
    }
    setShowSuccess(false)
  }

  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Buat Tiket Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-gray-600 text-sm flex items-center gap-1">
              <User className="h-3 w-3" />
              Nama <span className="text-gray-400">(opsional)</span>
            </Label>
            <Input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="border-gray-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-gray-600 text-sm flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Deskripsi Masalah <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan masalah atau keluhan Anda..."
              className="border-gray-200 min-h-[100px]"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-gray-600 text-sm flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Alamat Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="border-gray-200"
            />
            <p className="text-[10px] text-gray-400">Email untuk menerima balasan tiket</p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!deskripsi.trim() || !email.trim() || isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Kirim Tiket
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md text-center w-[calc(100%-32px)]">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <DialogTitle className="text-lg sm:text-xl">Berhasil! ✅</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <p className="text-gray-600 text-sm">
              Ini kode tiket Anda:
            </p>
            <p className="text-xl sm:text-2xl font-bold font-mono bg-gray-100 py-2 rounded-lg">
              {createdTicket?.code}
            </p>
            
            <div className="text-sm text-gray-600 space-y-2 pt-2">
              <p>Masalah Anda sudah terkirim ke admin <span className="font-semibold">@SamuDev</span> 📨</p>
              <p className="text-xs">
                Silahkan cek Notifikasi email menggunakan alamat email yang anda berikan secara berkala. 
                Jika belum dibalas dalam 1x24 jam, silahkan tekan tombol <strong>Lapor ulang</strong> - 
                otomatis akan spam admin @SamuDev untuk buka laporan 😤
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleSuccessClose}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 w-full"
            >
              Oke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== CONTACT DEVELOPER VIEW ====================
function ContactDeveloperView() {
  const contacts = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      value: '+62 895-1821-7767',
      link: 'https://wa.me/6289518217767',
      icon: () => (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      value: '@SamuDev',
      link: 'https://t.me/SamuDev',
      icon: () => (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'email',
      name: 'Email',
      value: 'codexcraft20@gmail.com',
      link: 'mailto:codexcraft20@gmail.com',
      icon: () => <Mail className="h-6 w-6" />,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ]

  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
            <AtSign className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Kontak Developer</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Ada pertanyaan atau masalah? Hubungi developer VitaTrack
          </p>
        </CardContent>
      </Card>

      {/* Contact Cards */}
      <div className="space-y-2 sm:space-y-3">
        {contacts.map((contact) => {
          const IconComponent = contact.icon
          return (
            <a
              key={contact.id}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-r ${contact.color} flex items-center justify-center shadow-sm text-white`}>
                      <IconComponent />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{contact.name}</h4>
                      <p className={`text-xs sm:text-sm ${contact.textColor} truncate`}>{contact.value}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </a>
          )
        })}
      </div>

      {/* Info Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-violet-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">Tips</h4>
              <p className="text-xs text-gray-600">
                Untuk respon cepat, hubungi via WhatsApp atau Telegram. Developer akan merespon dalam 1x24 jam. 🚀
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== WEIGHT TARGET VIEW ====================
function WeightTargetView() {
  const [currentWeight, setCurrentWeight] = useState(70)
  const [targetWeight, setTargetWeight] = useState(65)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(25)
  const [gender, setGender] = useState('pria')
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<WeightPlan | null>(null)

  const generatePlan = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/weight-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentWeight, targetWeight, height, age, gender })
      })
      const data = await response.json()
      if (data.success) {
        setPlan(data.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2">
            <Target className="h-5 w-5 text-rose-500" />
            Target Berat Badan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-gray-600 text-sm">Berat Saat Ini</Label>
              <span className="text-sm font-semibold text-gray-800">{currentWeight} kg</span>
            </div>
            <Slider value={[currentWeight]} onValueChange={([v]) => setCurrentWeight(v)} min={40} max={150} step={1} className="py-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-gray-600 text-sm">Target Berat</Label>
              <span className="text-sm font-semibold text-emerald-600">{targetWeight} kg</span>
            </div>
            <Slider value={[targetWeight]} onValueChange={([v]) => setTargetWeight(v)} min={40} max={150} step={1} className="py-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-gray-600 text-sm">Tinggi Badan</Label>
              <span className="text-sm font-semibold text-gray-800">{height} cm</span>
            </div>
            <Slider value={[height]} onValueChange={([v]) => setHeight(v)} min={100} max={220} step={1} className="py-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-gray-600 text-sm">Umur</Label>
              <span className="text-sm font-semibold text-gray-800">{age} tahun</span>
            </div>
            <Slider value={[age]} onValueChange={([v]) => setAge(v)} min={10} max={80} step={1} className="py-2" />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-sm">Jenis Kelamin</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full border-gray-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pria">Pria</SelectItem>
                <SelectItem value="wanita">Wanita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generatePlan} disabled={isLoading} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold">
            {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Membuat Rencana...</> : <><Sparkles className="h-4 w-4 mr-2" /> Buat Rencana AI</>}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <Card className="border-0 shadow-sm animate-in fade-in-50 duration-300">
          <CardContent className="p-4 space-y-3">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-500">Target Anda</p>
              <p className="text-lg font-semibold text-gray-800">{plan.target}</p>
              <p className="text-xs text-gray-500">Estimasi: {plan.durasi}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                <p className="font-bold text-gray-800">{plan.kalori_harian}</p>
                <p className="text-[10px] text-gray-500">Kalori/hari</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <Dumbbell className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                <p className="font-bold text-gray-800">{plan.olahraga.length}</p>
                <p className="text-[10px] text-gray-500">Jenis Olahraga</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 text-sm mb-2">🏃 Olahraga Rekomendasi</h4>
              <div className="flex flex-wrap gap-1">
                {plan.olahraga.map((o, i) => (
                  <span key={i} className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{o}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 text-sm mb-2">🥗 Makanan Dianjurkan</h4>
              <div className="flex flex-wrap gap-1">
                {plan.makanan_dianjurkan.map((m, i) => (
                  <span key={i} className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{m}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 text-sm mb-2">🚫 Makanan Dihindari</h4>
              <div className="flex flex-wrap gap-1">
                {plan.makanan_dihindari.map((m, i) => (
                  <span key={i} className="text-[10px] sm:text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{m}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 text-sm mb-2">💡 Tips</h4>
              <ul className="space-y-1">
                {plan.tips.map((t, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600">Kalo butuh informasi lebih lanjut, hubungi <span className="font-semibold text-emerald-600">Customer Service</span> ya! 😊</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ==================== OTHER VIEWS (Simplified) ====================
function BMIView() {
  const [weight, setWeight] = useState(60)
  const [height, setHeight] = useState(170)
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState('')

  const calculateBMI = () => {
    const bmiValue = weight / Math.pow(height / 100, 2)
    setBmi(Math.round(bmiValue * 10) / 10)
    if (bmiValue < 18.5) setCategory('Kurus')
    else if (bmiValue < 25) setCategory('Normal')
    else if (bmiValue < 30) setCategory('Gemuk')
    else setCategory('Obesitas')
  }

  const getCategoryColor = () => {
    if (!bmi) return 'text-gray-400'
    if (bmi < 18.5) return 'text-blue-500'
    if (bmi < 25) return 'text-emerald-500'
    if (bmi < 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2"><Scale className="h-5 w-5 text-blue-500" />BMI Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between"><Label className="text-gray-600 text-sm">Berat Badan</Label><span className="text-sm font-semibold text-emerald-600">{weight} kg</span></div>
            <Slider value={[weight]} onValueChange={([v]) => setWeight(v)} min={30} max={150} step={1} className="py-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><Label className="text-gray-600 text-sm">Tinggi Badan</Label><span className="text-sm font-semibold text-emerald-600">{height} cm</span></div>
            <Slider value={[height]} onValueChange={([v]) => setHeight(v)} min={100} max={250} step={1} className="py-2" />
          </div>
          <Button onClick={calculateBMI} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold">Hitung BMI</Button>
        </CardContent>
      </Card>
      {bmi && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">BMI Anda</p>
            <p className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">{bmi}</p>
            <p className={`text-lg sm:text-xl font-semibold ${getCategoryColor()}`}>{category}</p>
            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600">
                {bmi < 18.5 && "Tips: Perbanyak makan makanan bergizi dan berolahraga."}
                {bmi >= 18.5 && bmi < 25 && "Selamat! Berat badan Anda ideal. Pertahankan pola hidup sehat!"}
                {bmi >= 25 && bmi < 30 && "Tips: Kurangi makanan berlemak dan perbanyak olahraga."}
                {bmi >= 30 && "Tips: Konsultasikan dengan dokter untuk program penurunan berat badan."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function WaterView() {
  const [glasses, setGlasses] = useState(0)
  const goal = 8
  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2"><Droplets className="h-5 w-5 text-cyan-500" />Water Tracker</CardTitle></CardHeader>
        <CardContent className="text-center py-6">
          <img src="/images/water.png" alt="Water" className="h-24 w-24 sm:h-32 sm:w-32 mx-auto mb-4 object-contain" />
          <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">{glasses} / {goal}</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">Gelas air hari ini</p>
          <Progress value={(glasses / goal) * 100} className="h-2 sm:h-3 mb-4" />
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => setGlasses(Math.max(0, glasses - 1))} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-cyan-200 hover:bg-cyan-50"><Minus className="h-5 w-5 text-cyan-500" /></Button>
            <Button size="lg" onClick={() => setGlasses(Math.min(goal, glasses + 1))} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"><Plus className="h-5 w-5 text-white" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SleepView() {
  const [hours, setHours] = useState(7)
  const getInfo = () => {
    if (hours >= 7) return { label: 'Baik', color: 'text-emerald-500', desc: 'Tidur Anda sudah cukup!' }
    if (hours >= 5) return { label: 'Cukup', color: 'text-yellow-500', desc: 'Coba tidur lebih awal.' }
    return { label: 'Kurang', color: 'text-red-500', desc: 'Anda butuh lebih banyak tidur!' }
  }
  const info = getInfo()
  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2"><Moon className="h-5 w-5 text-violet-500" />Sleep Tracker</CardTitle></CardHeader>
        <CardContent className="text-center py-6">
          <img src="/images/sleep.png" alt="Sleep" className="h-24 w-24 sm:h-32 sm:w-32 mx-auto mb-4 object-contain" />
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><Label className="text-gray-600 text-sm">Jam Tidur</Label><span className="text-xl sm:text-2xl font-bold text-gray-800">{hours} jam</span></div>
            <Slider value={[hours]} onValueChange={([v]) => setHours(v)} min={1} max={12} step={1} className="py-2" />
          </div>
          <p className={`text-lg sm:text-xl font-semibold ${info.color}`}>{info.label}</p>
          <p className="text-xs sm:text-sm text-gray-500">{info.desc}</p>
        </CardContent>
      </Card>
    </div>
  )
}

function CaloriesView() {
  const [consumed, setConsumed] = useState(1200)
  const goal = 2000
  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" />Calorie Goals</CardTitle></CardHeader>
        <CardContent className="text-center py-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="45%" stroke="#f3f4f6" strokeWidth="8%" fill="none" />
              <circle cx="50%" cy="50%" r="45%" stroke="url(#gradient)" strokeWidth="8%" fill="none" strokeDasharray={`${(consumed / goal) * 283} 283`} strokeLinecap="round" />
              <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ef4444" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{consumed}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">kcal</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 rounded-xl p-3"><p className="text-[10px] sm:text-xs text-gray-500">Target</p><p className="text-base sm:text-lg font-bold text-orange-500">{goal} kcal</p></div>
            <div className="bg-emerald-50 rounded-xl p-3"><p className="text-[10px] sm:text-xs text-gray-500">Sisa</p><p className="text-base sm:text-lg font-bold text-emerald-500">{goal - consumed} kcal</p></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><Label className="text-gray-600 text-sm">Kalori dikonsumsi</Label><span className="text-sm font-semibold text-orange-500">{consumed} kcal</span></div>
            <Slider value={[consumed]} onValueChange={([v]) => setConsumed(v)} min={0} max={3000} step={50} className="py-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RecipesView() {
  const recipes = [
    { name: 'Salad Buah Segar', calories: 150, time: '10 menit', ingredients: ['Apel', 'Jeruk', 'Yogurt'], color: 'from-green-400 to-emerald-500' },
    { name: 'Smoothie Pisang', calories: 200, time: '5 menit', ingredients: ['Pisang', 'Susu', 'Madu'], color: 'from-yellow-400 to-amber-500' },
    { name: 'Oatmeal Sehat', calories: 250, time: '15 menit', ingredients: ['Oatmeal', 'Buah'], color: 'from-orange-400 to-red-500' },
    { name: 'Telur Rebus', calories: 70, time: '10 menit', ingredients: ['Telur', 'Garam'], color: 'from-amber-400 to-yellow-500' },
  ]
  return (
    <div className="p-3 sm:p-4 max-w-lg mx-auto space-y-4">
      <img src="/images/recipes.png" alt="Recipes" className="h-20 w-20 sm:h-24 sm:w-24 mx-auto object-contain" />
      <div className="text-center"><h2 className="text-lg sm:text-xl font-bold text-gray-800">Resep Sehat</h2><p className="text-xs sm:text-sm text-gray-500">Ide makanan sehat untuk Anda</p></div>
      <div className="space-y-3">
        {recipes.map((recipe, idx) => (
          <Card key={idx} className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <div className={`w-2 bg-gradient-to-b ${recipe.color}`} />
                <div className="flex-1 p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{recipe.name}</h4>
                    <span className="text-[10px] sm:text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{recipe.calories} kcal</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-2">⏱ {recipe.time}</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ing, i) => (<span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ing}</span>))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ScanFoodView() {
  const [goal, setGoal] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<NutritionData | null>(null)
  const [modal, setModal] = useState({ open: false, type: 'info' as const, title: '', message: '' })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) { setModal({ open: true, type: 'warning', title: 'File Terlalu Besar', message: 'Ukuran file maksimal 4MB.' }); return }
    const reader = new FileReader()
    reader.onload = (e) => { const result = e.target?.result; if (result && typeof result === 'string') { setImagePreview(result); setImageBase64(result); setResult(null) } }
    reader.readAsDataURL(file)
  }, [])

  const handleScanFood = async () => {
    if (!goal) { setModal({ open: true, type: 'warning', title: 'Pilih Tujuan', message: 'Silakan pilih tujuan kesehatan.' }); return }
    if (!imageBase64) { setModal({ open: true, type: 'warning', title: 'Pilih Gambar', message: 'Silakan pilih gambar makanan.' }); return }
    setIsLoading(true); setResult(null)
    try {
      const response = await fetch('/api/scan-food', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: imageBase64, goal }) })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Gagal menganalisis gambar')
      setResult(data.data)
      setModal({ open: true, type: 'success', title: 'Berhasil!', message: 'Makanan berhasil dianalisis!' })
    } catch (error) { setModal({ open: true, type: 'error', title: 'Gagal', message: error instanceof Error ? error.message : 'Terjadi kesalahan' }) }
    finally { setIsLoading(false) }
  }

  return (
    <div className="p-3 sm:p-4 max-w-xl mx-auto space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center gap-2"><Scan className="h-5 w-5 text-emerald-500" />Scan Makanan</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-600 text-sm">Pilih Tujuan</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger className="w-full border-gray-200 bg-white"><SelectValue placeholder="Pilih tujuan Anda" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="diet">Diet Ketat</SelectItem>
                <SelectItem value="weightloss">Menurunkan Berat Badan</SelectItem>
                <SelectItem value="healthy">Hidup Sehat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-auto py-3 border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600 text-sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-2" /> Galeri</Button>
            <Button variant="outline" className="flex-1 h-auto py-3 border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600 text-sm" onClick={() => cameraInputRef.current?.click()}><Camera className="h-4 w-4 mr-2" /> Kamera</Button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </div>
          {imagePreview && <div className="flex justify-center"><img src={imagePreview} alt="Preview" className="max-h-40 rounded-xl shadow-sm" /></div>}
          <Button onClick={handleScanFood} disabled={!imageBase64 || !goal || isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold">
            {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Memproses...</> : <><Scan className="h-4 w-4 mr-2" /> Scan Sekarang</>}
          </Button>
        </CardContent>
      </Card>
      {result && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2"><Utensils className="h-5 w-5 text-emerald-500" /><h4 className="font-semibold text-gray-800">{result.makanan_teridentifikasi}</h4></div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-orange-50 rounded-lg p-2 text-center"><Flame className="h-4 w-4 mx-auto text-orange-500 mb-1" /><p className="font-bold text-gray-800">{result.perkiraan_kalori}</p><p className="text-[10px] text-gray-500">Kalori</p></div>
              <div className="bg-emerald-50 rounded-lg p-2 text-center"><Heart className="h-4 w-4 mx-auto text-emerald-500 mb-1" /><p className="font-bold text-gray-800">{result.tingkat_kesehatan_skor}/5</p><p className="text-[10px] text-gray-500">Skor</p></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-amber-50 rounded-lg p-2 text-center"><Wheat className="h-3 w-3 mx-auto text-amber-500 mb-1" /><p className="font-semibold">{result.karbohidrat_g}g</p><p className="text-[10px] text-gray-500">Karbo</p></div>
              <div className="bg-red-50 rounded-lg p-2 text-center"><Beef className="h-3 w-3 mx-auto text-red-500 mb-1" /><p className="font-semibold">{result.protein_g}g</p><p className="text-[10px] text-gray-500">Protein</p></div>
              <div className="bg-blue-50 rounded-lg p-2 text-center"><Droplet className="h-3 w-3 mx-auto text-blue-500 mb-1" /><p className="font-semibold">{result.lemak_g}g</p><p className="text-[10px] text-gray-500">Lemak</p></div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3"><p className="text-xs font-semibold text-emerald-700 mb-1">Saran:</p><p className="text-xs text-gray-600">{result.ringkasan_saran}</p></div>
          </CardContent>
        </Card>
      )}
      <Dialog open={modal.open} onOpenChange={(open) => setModal(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md text-center w-[calc(100%-32px)]">
          <DialogHeader>
            <div className="flex justify-center mb-3">{modal.type === 'success' ? <CheckCircle className="h-10 w-10 text-emerald-500" /> : modal.type === 'warning' ? <AlertCircle className="h-10 w-10 text-yellow-500" /> : <AlertCircle className="h-10 w-10 text-red-500" />}</div>
            <DialogTitle className="text-base sm:text-lg">{modal.title}</DialogTitle>
          </DialogHeader>
          <p className="text-xs sm:text-sm text-gray-600 py-2">{modal.message}</p>
          <DialogFooter className="sm:justify-center"><Button onClick={() => setModal(prev => ({ ...prev, open: false }))} className="bg-gradient-to-r from-emerald-500 to-teal-500">Oke</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function HealthyLifestyleView() {
  const tips = [
    { id: 'weight', icon: Weight, title: 'Menurunkan Berat Badan', color: 'from-blue-400 to-cyan-500', content: '✓ Defisit kalori 500-750/hari\n✓ Olahraga 150 menit/minggu\n✓ Perbanyak protein & serat' },
    { id: 'sleep', icon: Moon, title: 'Tidur Berkualitas', color: 'from-violet-400 to-purple-500', content: '🌙 Jadwal tidur konsisten\n🌙 Hindari kafein sebelum tidur\n🌙 Jauhi gadget 1 jam sebelum tidur' },
    { id: 'eating', icon: Apple, title: 'Pola Makan Sehat', color: 'from-green-400 to-emerald-500', content: '🥗 50% sayur, 25% protein, 25% karbo\n🥗 Makan teratur 3x + 2 snack\n🥗 Kurangi garam & gula' },
    { id: 'exercise', icon: Dumbbell, title: 'Olahraga Teratur', color: 'from-orange-400 to-red-500', content: '💪 30 menit aktivitas/hari\n💪 Campur kardio & strength\n💪 Target 10.000 langkah' },
    { id: 'mental', icon: Heart, title: 'Kesehatan Mental', color: 'from-pink-400 to-rose-500', content: '❤️ Praktikkan meditasi/yoga\n❤️ Jaga hubungan sosial\n❤️ Batasi media sosial' },
  ]
  return (
    <div className="p-3 sm:p-4 max-w-xl mx-auto space-y-4">
      <div className="text-center"><h2 className="text-lg sm:text-xl font-bold text-gray-800">Healthy Lifestyle</h2><p className="text-xs sm:text-sm text-gray-500">5 Cara Pola Hidup Sehat</p></div>
      <Accordion type="single" collapsible className="space-y-2">
        {tips.map((tip) => {
          const Icon = tip.icon
          return (
            <AccordionItem key={tip.id} value={tip.id} className="bg-white rounded-xl shadow-sm border-0 overflow-hidden">
              <AccordionTrigger className="px-3 sm:px-4 py-3 hover:no-underline hover:bg-gray-50 group">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r ${tip.color} flex items-center justify-center shadow-sm`}><Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" /></div>
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{tip.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 sm:px-4 pb-4 text-xs sm:text-sm text-gray-600 whitespace-pre-line">{tip.content}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function VitaTrack() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vitatrack_theme') === 'dark'
    }
    return false
  })
  
  // Initialize tickets from localStorage
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vitatrack_tickets')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {}
      }
    }
    return []
  })

  // Save tickets to localStorage
  useEffect(() => {
    localStorage.setItem('vitatrack_tickets', JSON.stringify(tickets))
  }, [tickets])

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev
      localStorage.setItem('vitatrack_theme', newValue ? 'dark' : 'light')
      return newValue
    })
  }

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setCurrentView('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTicketCreated = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev])
    setCurrentView('support-ticket')
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50'
      }`}>
        <Navbar currentView={currentView} onBack={handleBack} />
        
        <main className="flex-1 pb-16">
          {currentView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {currentView === 'scan-food' && <ScanFoodView />}
          {currentView === 'healthy-lifestyle' && <HealthyLifestyleView />}
          {currentView === 'bmi' && <BMIView />}
          {currentView === 'water' && <WaterView />}
          {currentView === 'sleep' && <SleepView />}
          {currentView === 'calories' && <CaloriesView />}
          {currentView === 'recipes' && <RecipesView />}
          {currentView === 'weight-target' && <WeightTargetView />}
          {currentView === 'support-ticket' && <SupportTicketView tickets={tickets} onNavigate={handleNavigate} />}
          {currentView === 'create-ticket' && <CreateTicketView onBack={handleBack} onTicketCreated={handleTicketCreated} />}
          {currentView === 'contact-developer' && <ContactDeveloperView />}
        </main>

        <FloatingChat />

        <footer className={`py-3 text-center text-xs border-t transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-900/80 border-purple-500/30 text-gray-500' 
            : 'bg-white/80 border-gray-100 text-gray-400'
        }`}>
          <p>Hak cipta by @SamuDev</p>
        </footer>
      </div>
    </ThemeContext.Provider>
  )
}
