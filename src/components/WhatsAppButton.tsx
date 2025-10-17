'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
  className?: string
}

export default function WhatsAppButton({ 
  phoneNumber, 
  message = "Hallo! Ich interessiere mich für Ihre Fahrzeugtransport-Services.",
  className = ""
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    setIsAnimating(true)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`
    
    // Kleine Verzögerung für Animation
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Floating WhatsApp Button */}
      <div 
        className={`
          fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        <button
          onClick={handleClick}
          className={`
            group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl
            transition-all duration-300 transform hover:scale-110 active:scale-95 whatsapp-float
            ${isAnimating ? 'animate-pulse scale-110' : ''}
          `}
          aria-label="WhatsApp Kontakt"
        >
          {/* Pulsing Ring Animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full bg-green-300 animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Icon */}
          <MessageCircle className="h-8 w-8 relative z-10" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            WhatsApp: {phoneNumber}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      </div>

      {/* WhatsApp Card in Contact Section */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {/* WhatsApp Icon with Animation */}
            <div className="relative">
              <div className="bg-green-500 p-3 rounded-full whatsapp-bounce">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              {/* Floating dots animation */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                WhatsApp Chat
              </h3>
              <p className="text-green-700 text-sm mb-3">
                Schnelle Antwort - meist innerhalb von Minuten!
              </p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-green-800 font-medium">{phoneNumber}</span>
              </div>
            </div>
            
            <button
              onClick={handleClick}
              className={`
                bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold
                transition-all duration-300 transform hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                ${isAnimating ? 'animate-pulse' : ''}
              `}
            >
              Jetzt chatten
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
