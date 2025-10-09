'use client'

import { useState, useRef } from 'react'

interface ProcessStep {
  step: string
  title: string
  description: string
}

interface ProcessStepsCarouselProps {
  processSteps: ProcessStep[]
}

export function ProcessStepsCarousel({ processSteps }: ProcessStepsCarouselProps) {
  const [activeStep, setActiveStep] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToStep = (stepIndex: number) => {
    if (scrollRef.current) {
      const stepElement = scrollRef.current.children[stepIndex] as HTMLElement
      if (stepElement) {
        stepElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest', 
          inline: 'center' 
        })
      }
    }
    setActiveStep(stepIndex)
  }

  return (
    <div className="relative">
      {/* Vollbreiter Carousel Container */}
      <div className="py-16">
        <div className="relative w-full">
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-8 justify-center px-4 pt-8 overflow-x-auto scrollbar-hide" 
            style={{ scrollBehavior: 'smooth' }}
          >
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-72 md:w-80 text-center relative group snap-center"
                style={{ 
                  transform: activeStep === index ? 'scale(1.05)' : 'scale(0.95)',
                  opacity: activeStep === index ? '1' : '0.8',
                  filter: 'none',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => scrollToStep(index)}
              >
                <div className="stepper__dot bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold mx-auto mb-6 relative z-10 shadow-xl">
                  {step.step}
                </div>
                <div className="stepper__card bg-white rounded-2xl p-8 shadow-xl min-h-[200px] flex flex-col justify-center cursor-pointer transition-colors">
                  <h3 className={`text-xl font-bold text-navy-600 mb-4 transition-all duration-300 ${
                    activeStep === index ? 'text-red-600' : ''
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Vollbreiter Center Focus Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-transparent via-red-100/20 to-transparent rounded-3xl"></div>
          </div>
        </div>
      </div>
      
      {/* Geräumige Navigation */}
      <div className="flex justify-center space-x-6 mt-8">
        <button 
          onClick={() => scrollToStep(Math.max(0, activeStep - 1))}
          className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={activeStep === 0}
        >
          ←
        </button>
        <button 
          onClick={() => scrollToStep(Math.min(processSteps.length - 1, activeStep + 1))}
          className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={activeStep === processSteps.length - 1}
        >
          →
        </button>
      </div>
      
      {/* Geräumige Step Indicators */}
      <div className="flex justify-center mt-8 mb-4 space-x-3">
        {processSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToStep(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              activeStep === index 
                ? 'bg-red-500 scale-125' 
                : 'bg-red-300 hover:bg-red-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
