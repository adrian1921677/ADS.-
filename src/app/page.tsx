import { ClientHeader } from '@/components/ClientHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Shield, Clock, MapPin, Star, Users, Award } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ProcessStepsCarousel } from '@/components/ProcessStepsCarousel'
import Hyperspeed from '@/components/Hyperspeed'
import { hyperspeedPresets } from '@/components/hyperspeedPresets'

export const metadata: Metadata = {
  title: 'Fahrzeugüberführung Deutschland | Abdullahu Drive Solutions | #1 Service',
  description: '🚗 Professionelle Fahrzeugüberführung in ganz Deutschland! Vollversichert, termintreu & transparent. Über 10 Jahre Erfahrung. Jetzt kostenloses Angebot anfragen!',
  keywords: 'Fahrzeugüberführung Deutschland, Auto transport, Fahrzeug abholen, Auto zustellen, Wuppertal, NRW, professionell, versichert, termintreu',
  openGraph: {
    title: 'Fahrzeugüberführung Deutschland | Abdullahu Drive Solutions | #1 Service',
    description: '🚗 Professionelle Fahrzeugüberführung in ganz Deutschland! Vollversichert, termintreu & transparent.',
    type: 'website',
    url: 'https://abdullahu-drive-solutions.de',
  }
}
// animationen entfernt
// import Image from 'next/image'

export default function HomePage() {

  const services = [
    {
      title: 'Abhol- & Zustellservice (Deutschland)',
      description: 'Wir holen Ihr Fahrzeug ab und bringen es sicher und dokumentiert ans Ziel – deutschlandweit.',
      icon: <MapPin className="h-6 w-6 text-white" />,
      features: ['Deutschlandweit verfügbar', 'Versichert & dokumentiert', 'Transparente Kommunikation']
    }
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Anfrage stellen',
      description: 'Füllen Sie unser Kontaktformular aus oder rufen Sie uns an. Wir besprechen alle Details Ihrer gewünschten Fahrzeugüberführung.'
    },
    {
      step: '2',
      title: 'Termin vereinbaren',
      description: 'Wir bestätigen Ihren Termin und koordinieren die Abholung sowie die Zustellung am Zielort.'
    },
    {
      step: '3',
      title: 'Übergabe & Dokumentation',
      description: 'Bei der Abholung dokumentieren wir den Zustand Ihres Fahrzeugs und übergeben Ihnen alle notwendigen Unterlagen.'
    },
    {
      step: '4',
      title: 'Sichere Überführung',
      description: 'Ihr Fahrzeug wird professionell und versichert zum vereinbarten Zielort transportiert.'
    },
    {
      step: '5',
      title: 'Zustellung & Übergabe',
      description: 'Pünktliche Zustellung am Zielort mit vollständiger Dokumentation und Übergabe an Sie oder den Empfänger.'
    }
  ]

  const testimonials = [
    {
      name: 'Autohaus Muster',
      location: 'München',
      text: 'Wir arbeiten gerne mit Abdullahu Drive Solutions zusammen. Zuverlässig, pünktlich und unkompliziert.',
      rating: 5,
      vehicles: 'Regelmäßige Überführungen'
    },
    {
      name: 'Privatkunde Schmidt',
      location: 'Berlin',
      text: 'Mein Auto wurde perfekt von Hamburg nach Berlin überführt. Sehr professionell!',
      rating: 5,
      vehicles: '1 Fahrzeug'
    },
    {
      name: 'Flottenmanager Weber',
      location: 'Frankfurt',
      text: 'Für unsere Firmenflotte vertrauen wir auf Abdullahu Drive Solutions. Immer termintreu und zuverlässig.',
      rating: 5,
      vehicles: 'Mehrere Fahrzeuge'
    }
  ]

  return (
    <>
      <ClientHeader />
      <main id="main" className="min-h-screen bg-white">
      
      {/* SEO meta via head not supported directly here in Next 15 app dir; we rely on metadata in layout or route handlers if needed. */}
      
      {/* Hero Section – reduziert und professionell */}
      {/* Hero Section */}
      <section className="hero-section relative text-white overflow-hidden py-24 bg-gradient-to-br from-[#0C2A3A] to-[#102538]">
        {/* Hyperspeed Background */}
        <div className="absolute inset-0 z-0">
          <Hyperspeed
            effectOptions={{
              ...hyperspeedPresets.one,
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                sticks: 0x03b3c3
              }
            }}
          />
        </div>
        
        {/* Content */}
        <div className="hero-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="hero-title text-white">
            <div className="hero-text-line">Professionelle Fahrzeugüberführung von</div>
            <div className="mobile-ab-container">
              <span className="mobile-a handwritten-underline">A</span>
              <span className="mobile-nach"> nach </span>
              <span className="mobile-b handwritten-underline">B</span>
            </div>
            <div className="hero-text-line text-lg mt-4">Deutschlandweit • Vollversichert • Termintreu</div>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild className="hover-lift hover-glow px-8 py-3">
              <Link href="/kontakt">Anfrage starten</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy-600 hover-lift px-8 py-3">
              <Link href="/leistungen">Leistungen ansehen</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 justify-center text-gray-200 mt-8">
            <span className="usp-chip text-body-sm"><CheckCircle className="h-4 w-4 text-white" /> Vollständig versichert</span>
            <span className="usp-chip text-body-sm"><CheckCircle className="h-4 w-4 text-white" /> Transparent & termintreu</span>
            <span className="usp-chip text-body-sm"><CheckCircle className="h-4 w-4 text-white" /> Deutschlandweit</span>
            <span className="usp-chip text-body-sm"><CheckCircle className="h-4 w-4 text-white" /> Persönlicher Service</span>
          </div>
        </div>
      </section>

      {/* USP-Zeile */}
      <section className="section--tight bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group animate-fade-in-up stagger-1">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover-lift">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors animate-float">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">100%</div>
                <div className="text-gray-600 font-medium">Versichert</div>
              </div>
            </div>
            <div className="text-center group animate-fade-in-up stagger-2">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover-lift">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors animate-float">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Verfügbar</div>
              </div>
            </div>
            <div className="text-center group animate-fade-in-up stagger-3">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover-lift">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors animate-float">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">100%</div>
                <div className="text-gray-600 font-medium">Zufriedenheit</div>
              </div>
            </div>
            <div className="text-center group animate-fade-in-up stagger-4">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover-lift">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors animate-float">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-title text-slate-800 mb-6">Unsere Leistungen</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Professionelle Fahrzeugüberführungen mit vollem Versicherungsschutz und 
              transparenter Kommunikation.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {services.map((service, index) => (
                <div key={index} className={`group animate-fade-in-up stagger-${index + 1}`}>
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full hover-lift">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{service.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-4 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
            </li>
                      ))}
                    </ul>
                    
                    <button className="btn btn-primary w-full hover-glow">
                      <Link href="/leistungen">Mehr erfahren →</Link>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-gray-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-title text-navy-600 mb-6">So läuft die Überführung ab</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Einfach, transparent und zuverlässig – von der Anfrage bis zur Zustellung.
            </p>
          </div>
          
          <ProcessStepsCarousel processSteps={processSteps} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-title text-navy-600 mb-6">Was unsere Kunden sagen</h2>
            <p className="text-gray-600">
              Vertrauen Sie auf unsere professionellen Dienstleistungen.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:-translate-y-1">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-red-500 fill-current" />
                    ))}
                  </div>
                  <div className="relative mb-6">
                    <div className="text-6xl text-red-100 absolute -top-2 -left-2">&ldquo;</div>
                    <p className="text-gray-600 italic text-large relative z-10">&ldquo;{testimonial.text}&rdquo;</p>
                  </div>
                  <div className="border-t border-gray-100 pt-6">
                    <div className="font-semibold text-navy-600 text-large">{testimonial.name}</div>
                    <div className="text-small text-gray-600 mb-1">{testimonial.location}</div>
                    <div className="text-small text-red-500 font-medium">{testimonial.vehicles}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      </main>
    </>
  )
}