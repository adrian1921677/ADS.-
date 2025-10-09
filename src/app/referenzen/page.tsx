import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Quote, Users, Award, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReferenzenPage() {
  const testimonials = [
    {
      name: 'Autohaus Muster GmbH',
      location: 'München',
      type: 'Autohaus',
      rating: 5,
      vehicles: '15 Fahrzeuge/Monat',
      duration: 'Seit 2018',
      quote: 'Seit Jahren arbeiten wir mit Abdullahu Drive Solutions zusammen. Zuverlässig, pünktlich und unkompliziert. Die Zusammenarbeit ist sehr professionell und wir können uns immer auf sie verlassen.',
      services: ['Fahrzeugüberführung DE', 'Zulassungsservice'],
      contact: 'Herr Schmidt, Geschäftsführer'
    },
    {
      name: 'Privatkunde Schmidt',
      location: 'Berlin',
      type: 'Privatkunde',
      rating: 5,
      vehicles: '1 Fahrzeug',
      duration: '2023',
      quote: 'Mein neues Auto wurde perfekt von Hamburg nach Berlin überführt. Sehr professionell! Die Kommunikation war transparent und ich wurde regelmäßig über den Status informiert.',
      services: ['Fahrzeugüberführung DE'],
      contact: 'Familie Schmidt'
    },
    {
      name: 'Flottenmanager Weber',
      location: 'Frankfurt',
      type: 'Firmenkunde',
      rating: 5,
      vehicles: '50+ Fahrzeuge/Jahr',
      duration: 'Seit 2019',
      quote: 'Für unsere Firmenflotte vertrauen wir auf Abdullahu Drive Solutions. Immer termintreu und zuverlässig. Die Kosten sind transparent und die Qualität stimmt.',
      services: ['Fahrzeugüberführung Deutschland', 'Zulassungsservice'],
      contact: 'Herr Weber, Flottenmanager'
    },
    {
      name: 'Autohaus Premium',
      location: 'Stuttgart',
      type: 'Autohaus',
      rating: 5,
      vehicles: '25 Fahrzeuge/Monat',
      duration: 'Seit 2020',
      quote: 'Exzellente Zusammenarbeit! Die Fahrzeuge kommen immer pünktlich und in einwandfreiem Zustand an. Besonders der Zulassungsservice spart uns viel Zeit.',
      services: ['Fahrzeugüberführung DE', 'Zulassungsservice', 'Abhol- & Zustellservice'],
      contact: 'Frau Müller, Inhaberin'
    },
    {
      name: 'Privatkunde Müller',
      location: 'Hamburg',
      type: 'Privatkunde',
      rating: 5,
      vehicles: '2 Fahrzeuge',
      duration: '2022',
      quote: 'Hervorragender Service! Mein Cabrio wurde sicher von München nach Hamburg überführt. Die Dokumentation war sehr detailliert und ich fühlte mich gut betreut.',
      services: ['Fahrzeugüberführung DE'],
      contact: 'Herr Müller'
    },
    {
      name: 'Leasing Company AG',
      location: 'Düsseldorf',
      type: 'Leasingunternehmen',
      rating: 5,
      vehicles: '100+ Fahrzeuge/Jahr',
      duration: 'Seit 2021',
      quote: 'Als Leasingunternehmen sind wir auf zuverlässige Partner angewiesen. Abdullahu Drive Solutions erfüllt alle unsere Anforderungen und ist ein wichtiger Partner geworden.',
      services: ['Fahrzeugüberführung Deutschland', 'Zulassungsservice'],
      contact: 'Herr Klein, Operations Manager'
    }
  ]

  const stats = [
    {
      number: '500+',
      label: 'Zufriedene Kunden',
      icon: <Users className="h-8 w-8 text-primary-600" />
    },
    {
      number: '2000+',
      label: 'Erfolgreiche Überführungen',
      icon: <Award className="h-8 w-8 text-primary-600" />
    },
    {
      number: '4.9/5',
      label: 'Durchschnittliche Bewertung',
      icon: <Star className="h-8 w-8 text-primary-600" />
    },
    {
      number: '98%',
      label: 'Termintreue',
      icon: <CheckCircle className="h-8 w-8 text-primary-600" />
    }
  ]

  const customerTypes = [
    {
      title: 'Autohäuser',
      description: 'Über 50 Autohäuser vertrauen auf unsere Dienstleistungen',
      count: '50+',
      services: ['Regelmäßige Überführungen', 'Zulassungsservice', 'Flexible Terminplanung']
    },
    {
      title: 'Privatkunden',
      description: 'Hunderte zufriedene Privatkunden',
      count: '300+',
      services: ['Einzelüberführungen', 'Persönliche Betreuung', 'Transparente Kommunikation']
    },
    {
      title: 'Firmenkunden',
      description: 'Flottenmanager und Leasingunternehmen',
      count: '25+',
      services: ['Großvolumen', 'Spezielle Anforderungen', 'Langfristige Partnerschaften']
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              Referenzen
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Über 500 zufriedene Kunden vertrauen auf unsere Dienstleistungen. 
              Lesen Sie, was unsere Kunden über uns sagen.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Unsere Erfolge in Zahlen</h2>
            <p className="text-xl text-neutral-600">
              Zahlen, die für Qualität und Zuverlässigkeit sprechen
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Unsere Kunden</h2>
            <p className="text-xl text-neutral-600">
              Von Privatkunden bis zu großen Unternehmen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{type.title}</CardTitle>
                  <div className="text-4xl font-bold text-primary-600 mb-2">{type.count}</div>
                  <CardDescription className="text-base">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left">
                    {type.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-accent-500" />
                        <span className="text-sm text-neutral-600">{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Kundenstimmen</h2>
            <p className="text-xl text-neutral-600">
              Was unsere Kunden über uns sagen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {testimonial.location} • {testimonial.type}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-accent-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-neutral-500 space-y-1">
                    <div>{testimonial.vehicles}</div>
                    <div>{testimonial.duration}</div>
                    <div>{testimonial.contact}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Quote className="h-8 w-8 text-primary-200 absolute -top-2 -left-2" />
                    <p className="text-neutral-700 italic pl-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-neutral-900">Genutzte Services:</div>
                    <div className="flex flex-wrap gap-1">
                      {testimonial.services.map((service, serviceIndex) => (
                        <span 
                          key={serviceIndex}
                          className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Warum uns Kunden vertrauen</h2>
            <p className="text-xl text-neutral-600">
              Unsere Grundsätze für langfristige Partnerschaften
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Zuverlässigkeit</h3>
              <p className="text-neutral-600 text-sm">
                98% Termintreue und pünktliche Ausführung
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Qualität</h3>
              <p className="text-neutral-600 text-sm">
                Höchste Standards bei jeder Überführung
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Partnerschaft</h3>
              <p className="text-neutral-600 text-sm">
                Langfristige Beziehungen zu unseren Kunden
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Zufriedenheit</h3>
              <p className="text-neutral-600 text-sm">
                4.9/5 Sterne durchschnittliche Bewertung
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Werden Sie unser nächster zufriedener Kunde
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Lassen Sie sich von unseren Referenzen überzeugen und kontaktieren Sie uns 
            für ein unverbindliches Angebot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
              <Link href="/kontakt">Jetzt anfragen</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/leistungen">Leistungen ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
