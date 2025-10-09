import { ClientHeader } from '@/components/ClientHeader'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Truck, MapPin, Award, Shield, Clock, Euro, FileText } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Abhol- & Zustellservice in Deutschland | Abdullahu Drive Solutions',
  description: 'Abholung und Zustellung Ihres Fahrzeugs – deutschlandweit, versichert und dokumentiert. Individuelle Kalkulation. Jetzt unverbindlich anfragen.',
  openGraph: {
    title: 'Abhol- & Zustellservice in Deutschland',
    description: 'Deutschlandweiter, versicherter Abhol- & Zustellservice für Fahrzeuge. Transparente Kommunikation und Dokumentation.',
    type: 'website',
    url: 'https://abdullahu-drive-solutions.de/leistungen'
  }
}

export default function LeistungenPage() {
  const services = [
    {
      title: 'Abhol- & Zustellservice (Deutschland)',
      description: 'Wir holen Ihr Fahrzeug ab und liefern es deutschlandweit zuverlässig an – sicher dokumentiert und versichert. Die Preise werden individuell kalkuliert.',
      icon: <Truck className="h-8 w-8 text-primary-600" />,
      features: [
        'Abholung direkt am gewünschten Standort',
        'Zustellung deutschlandweit',
        'Dokumentation des Fahrzeugzustands',
        'Vollständige Versicherung während des Transports',
        'Termintreue & transparente Kommunikation'
      ],
      pricing: 'Individuell',
      coverage: 'Deutschlandweit'
    }
  ]

  const additionalServices = [
    {
      title: 'Versicherungsschutz',
      description: 'Vollständige Haftpflicht- und Kaskoversicherung während des Transports.',
      icon: <Shield className="h-6 w-6 text-accent-500" />
    },
    {
      title: 'Dokumentation',
      description: 'Ausführliche Dokumentation des Fahrzeugzustands vor und nach dem Transport.',
      icon: <FileText className="h-6 w-6 text-accent-500" />
    },
    {
      title: '24/7 Support',
      description: 'Rund um die Uhr erreichbar für Fragen und Updates.',
      icon: <Clock className="h-6 w-6 text-accent-500" />
    },
    {
      title: 'Transparente Preise',
      description: 'Keine versteckten Kosten – alle Preise werden vorab kommuniziert.',
      icon: <Euro className="h-6 w-6 text-accent-500" />
    }
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Anfrage & Beratung',
      description: 'Kontaktieren Sie uns telefonisch oder per E-Mail. Wir beraten Sie gerne über die beste Lösung für Ihre Fahrzeugüberführung.'
    },
    {
      step: '2',
      title: 'Kostenvoranschlag',
      description: 'Wir erstellen Ihnen ein unverbindliches Angebot basierend auf Ihren Anforderungen und der gewünschten Route.'
    },
    {
      step: '3',
      title: 'Terminvereinbarung',
      description: 'Nach Auftragserteilung koordinieren wir die Abholung und Zustellung zu Ihren gewünschten Terminen.'
    },
    {
      step: '4',
      title: 'Abholung & Dokumentation',
      description: 'Bei der Abholung dokumentieren wir den Zustand Ihres Fahrzeugs und übergeben Ihnen alle notwendigen Unterlagen.'
    },
    {
      step: '5',
      title: 'Transport',
      description: 'Ihr Fahrzeug wird professionell und versichert zum vereinbarten Zielort transportiert.'
    },
    {
      step: '6',
      title: 'Zustellung',
      description: 'Pünktliche Zustellung am Zielort mit vollständiger Dokumentation und Übergabe.'
    }
  ]

  return (
    <>
      <ClientHeader />
      <main id="main" className="min-h-screen bg-white">
      
      {/* Main Services */}
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Unser Service</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Abholung und Zustellung Ihres Fahrzeugs – deutschlandweit, sicher und termintreu. Jede Fahrt ist individuell, wir erstellen ein passgenaues Angebot.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow w-full mx-auto">
                <CardHeader>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex-shrink-0">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {service.description}
                      </CardDescription>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <span className={service.pricing === 'Individuell' ? 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-sm font-semibold' : 'text-2xl font-bold text-primary-600'}>
                          {service.pricing}
                        </span>
                        <span className="text-sm text-neutral-500">{service.coverage}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button asChild className="w-full">
                      <Link href="/kontakt">Individuelles Angebot anfordern</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Zusätzliche Services</h2>
            <p className="text-xl text-neutral-600">
              Rundum-Service für Ihre Fahrzeugüberführung
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{service.title}</h3>
                <p className="text-neutral-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Unser Prozess</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Von der ersten Anfrage bis zur erfolgreichen Zustellung – 
              so läuft Ihre Fahrzeugüberführung ab.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Preise</h2>
            <p className="text-xl text-neutral-600">
              Jede Fahrt ist individuell. Sie erhalten einen transparenten Festpreis nach kurzer Anfrage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
            <Card className="text-center border-primary-600 border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Deutschland</CardTitle>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-base font-semibold">Individuelle Kalkulation</div>
                <CardDescription>Abhol- & Zustellservice</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-accent-500" />
                    <span>Deutschlandweit</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-accent-500" />
                    <span>Vollversichert & dokumentiert</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-accent-500" />
                    <span>Termintreu & transparente Kommunikation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-accent-500" />
                    <span>Preisfaktoren: Strecke, Fahrzeugtyp, Flexibilität, Abhol-/Zielort</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Bereit für Ihre Fahrzeugüberführung?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Kontaktieren Sie uns für ein unverbindliches Angebot. Wir beraten Sie gerne!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
              <Link href="/kontakt">Jetzt anfragen</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/faq">Häufige Fragen</Link>
            </Button>
          </div>
        </div>
      </section>

        <Footer />
      </main>
    </>
  )
}
