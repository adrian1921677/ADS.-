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
            group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg
            transition-all duration-500 transform hover:scale-105 active:scale-95
            ${isAnimating ? 'animate-pulse scale-105' : ''}
          `}
          aria-label="WhatsApp Kontakt"
        >
          {/* Subtle Pulsing Ring Animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" style={{ animationDuration: '3s' }}></div>
          
          {/* Icon with subtle rotation */}
          <MessageCircle className="h-8 w-8 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap translate-x-2 group-hover:translate-x-0">
            WhatsApp: {phoneNumber}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      </div>

      {/* WhatsApp Card in Contact Section */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-500 group">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {/* WhatsApp Icon with Subtle Animation */}
            <div className="relative group/icon">
              <div className="bg-green-500 p-3 rounded-full transition-all duration-500 group-hover:bg-green-600 group-hover:scale-105">
                <MessageCircle className="h-8 w-8 text-white transition-transform duration-300 group-hover/icon:rotate-6" />
              </div>
              {/* Subtle floating indicator */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-1 transition-colors duration-300 group-hover:text-green-800">
                WhatsApp Chat
              </h3>
              <p className="text-green-700 text-sm mb-3 transition-colors duration-300 group-hover:text-green-600">
                Schnelle Antwort - meist innerhalb von Minuten!
              </p>
              <div className="flex items-center space-x-2 transition-transform duration-300 group-hover:translate-x-1">
                <Phone className="h-4 w-4 text-green-600 transition-colors duration-300 group-hover:text-green-500" />
                <span className="text-green-800 font-medium transition-colors duration-300 group-hover:text-green-700">{phoneNumber}</span>
              </div>
            </div>
            
            <button
              onClick={handleClick}
              className={`
                bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold
                transition-all duration-500 transform hover:scale-105 active:scale-95
                shadow-md hover:shadow-lg group-hover:shadow-xl
                hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600
                ${isAnimating ? 'animate-pulse' : ''}
              `}
            >
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                Jetzt chatten
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
