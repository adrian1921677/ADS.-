import { ClientHeader } from '@/components/ClientHeader'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Award, Heart, Shield, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns | Abdullahu Drive Solutions',
  description: 'Familiengeführtes Unternehmen für sichere Fahrzeugüberführungen. Lernen Sie die Familie Abdullahu und unser Team kennen.',
}

export default function UeberUnsPage() {
  const values = [
    {
      title: 'Familiengeführt',
      description: 'Als Familienunternehmen stehen persönliche Beziehungen und Vertrauen im Mittelpunkt unserer Arbeit.',
      icon: <Heart className="h-8 w-8 text-accent-500" />
    },
    {
      title: 'Zuverlässig',
      description: 'Termintreue und pünktliche Ausführung sind für uns selbstverständlich.',
      icon: <Clock className="h-8 w-8 text-accent-500" />
    },
    {
      title: 'Transparent',
      description: 'Offene Kommunikation und klare Preise ohne versteckte Kosten.',
      icon: <Shield className="h-8 w-8 text-accent-500" />
    }
  ]

  const team = [
    {
      name: 'Adrian Abdullahu',
      role: 'Fahrer · Entwickler · Administrativ',
      description: 'Fahrpraxis und Technik – verantwortlich für Entwicklung und administrative Prozesse.',
      image: ''
    },
    {
      name: 'Jeton Abdullahu',
      role: 'Fahrer',
      description: 'Zuverlässiger Fahrer für deutschlandweite Überführungen.',
      image: ''
    },
    {
      name: 'Chantal Abdullahu Kraus',
      role: 'Disposition',
      description: 'Koordination von Terminen, Routen und Kommunikation mit Kunden und Fahrern.',
      image: ''
    },
    {
      name: 'Paul Abdullahu Kraus',
      role: 'Fahrer',
      description: 'Sichere Fahrzeugüberführungen mit Fokus auf Pünktlichkeit und Dokumentation.',
      image: ''
    },
    {
      name: 'Manuela Abdullahu',
      role: 'Disposition',
      description: 'Planung, Kundensupport und reibungslose Abläufe im Tagesgeschäft.',
      image: ''
    }
  ]


  const stats = [
    {
      number: '2000+',
      label: 'Erfolgreiche Überführungen',
      icon: <Award className="h-8 w-8 text-primary-600" />
    },
    {
      number: '500+',
      label: 'Zufriedene Kunden',
      icon: <Users className="h-8 w-8 text-primary-600" />
    },
    {
      number: '10+',
      label: 'Jahre Erfahrung',
      icon: <Clock className="h-8 w-8 text-primary-600" />
    },
    {
      number: '16',
      label: 'Bundesländer',
      icon: <MapPin className="h-8 w-8 text-primary-600" />
    }
  ]

  return (
    <>
      <ClientHeader />
      <main id="main" className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              Über uns
            </h1>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">Unsere Geschichte</h2>
              <div className="space-y-6 text-neutral-600">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0"></div>
                    Junges dynamisches Unternehmen
                  </h3>
                  <p>
                    Modern und zukunftsorientiert nutzen wir neueste Technologien für 
                    optimale Kundenbetreuung. Unser junges Team bringt frische Ideen 
                    und hohe Motivation mit.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0"></div>
                    Familiär
                  </h3>
                  <p>
                    Als Familienunternehmen stehen persönliche Beziehungen im Mittelpunkt. 
                    Wir behandeln jeden Kunden individuell und bieten direkte 
                    Kommunikation mit den Entscheidungsträgern.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0"></div>
                    Viel Arbeitserfahrung
                  </h3>
                  <p>
                    Jahrzehntelange Branchenerfahrung ermöglicht professionelle 
                    Durchführung auch komplexer Überführungen. Bewährte Lösungen 
                    und schnelle Reaktion auf unvorhergesehene Ereignisse.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-neutral-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="bg-primary-600 text-white rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    A
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Familie Abdullahu</h3>
                  <p className="text-primary-600 font-semibold mb-4">Gründer & Geschäftsführer</p>
                  <p className="text-neutral-600 text-sm">
                    &ldquo;Unser Ziel ist es, Fahrzeugüberführungen so einfach und zuverlässig 
                    zu machen, als würden Sie Ihr Auto selbst fahren.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Unsere Werte</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Diese Grundsätze leiten uns in allem, was wir tun.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-2xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Unser Team</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Die Menschen hinter Abdullahu Drive Solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-neutral-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-16 w-16 text-neutral-400" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary-600 font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Unsere Erfolge in Zahlen</h2>
            <p className="text-xl text-primary-100">
              Zahlen, die für sich sprechen
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">
            Lernen Sie uns kennen
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Möchten Sie mehr über unsere Dienstleistungen erfahren oder haben Sie Fragen? 
            Wir freuen uns auf Ihre Nachricht!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
              <Link href="/kontakt">Kontakt aufnehmen</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
              <Link href="/referenzen">Referenzen ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

        <Footer />
      </main>
    </>
  )
}
