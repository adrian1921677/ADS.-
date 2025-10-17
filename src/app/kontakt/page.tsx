'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function KontaktPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-primary-600" />,
      title: 'Telefon',
      details: ['+49 20287021547', 'Mo-Fr: 8:00-18:00', 'Sa: 9:00-14:00']
    },
    {
      icon: <Mail className="h-6 w-6 text-primary-600" />,
      title: 'E-Mail',
      details: ['info@abdullahu-drive.de', 'Antwort innerhalb 24h']
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary-600" />,
      title: 'Adresse',
      details: ['Musterstraße 123', '12345 Musterstadt', 'Deutschland']
    },
    {
      icon: <Clock className="h-6 w-6 text-primary-600" />,
      title: 'Bürozeiten',
      details: ['Montag - Freitag: 8:00 - 18:00', 'Samstag: 9:00 - 14:00', 'Sonntag: Geschlossen']
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-[#0a2330]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-transparent"></div>
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="hero-title mb-6">Kontakt</h1>
          <p className="text-body text-gray-200 mb-8 max-w-3xl mx-auto">
            Haben Sie Fragen oder möchten Sie ein unverbindliches Angebot? Wir sind gerne für Sie da!
          </p>
        </div>
      </section>

      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-gray-50 rounded-t-xl">
                <CardTitle className="text-3xl text-primary-600">Kontakt aufnehmen</CardTitle>
                <CardDescription className="text-body">
                  Haben Sie Fragen oder möchten Sie ein unverbindliches Angebot? Schreiben Sie uns einfach eine Nachricht.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <WhatsAppButton 
              phoneNumber="+49 160 4245116"
              message="Hallo! Ich interessiere mich für Ihre Fahrzeugtransport-Services. Können Sie mir ein Angebot machen?"
            />

            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-neutral-600 text-sm mb-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  Warum Abdullahu Drive Solutions?
                </h3>
                <ul className="space-y-2 text-sm text-primary-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    <span>Über 10 Jahre Erfahrung</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    <span>Vollständig versichert</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    <span>Termintreu & zuverlässig</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    <span>Transparente Kommunikation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    <span>Deutschlandweit verfügbar</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
