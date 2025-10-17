'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      title: 'Allgemeine Fragen',
      faqs: [
        {
          question: 'Was ist eine Fahrzeugüberführung?',
          answer: 'Eine Fahrzeugüberführung ist der Transport eines Fahrzeugs von einem Ort zum anderen. Wir übernehmen dabei die komplette Abholung, den Transport und die Zustellung Ihres Fahrzeugs mit vollständiger Versicherung und Dokumentation.'
        },
        {
          question: 'Welche Fahrzeuge können überführt werden?',
          answer: 'Wir überführen alle gängigen PKW-Typen: Limousinen, Kombis, SUVs, Kleinwagen, Cabrios, Coupes und Vans. Spezielle Fahrzeuge wie Oldtimer oder exotische Modelle besprechen wir gerne individuell mit Ihnen.'
        },
        {
          question: 'Wie lange dauert eine Fahrzeugüberführung?',
          answer: 'Die Dauer hängt von der Entfernung ab. Innerhalb Deutschlands sind es meist 1-3 Tage. Wir informieren Sie über den genauen Zeitplan und halten Sie während des gesamten Prozesses auf dem Laufenden.'
        },
        {
          question: 'Ist mein Fahrzeug während der Überführung versichert?',
          answer: 'Ja, Ihr Fahrzeug ist während der gesamten Überführung vollständig versichert. Wir haben eine umfassende Transportversicherung, die Schäden am Fahrzeug abdeckt. Details zur Versicherung erhalten Sie mit dem Kostenvoranschlag.'
        }
      ]
    },
    {
      title: 'Preise & Kosten',
      faqs: [
        {
          question: 'Wie werden die Preise berechnet?',
          answer: 'Unsere Preise richten sich nach der Entfernung, dem Fahrzeugtyp, der gewünschten Geschwindigkeit und eventuellen Zusatzleistungen. Wir erstellen Ihnen gerne ein unverbindliches Angebot basierend auf Ihren individuellen Anforderungen.'
        },
        {
          question: 'Gibt es versteckte Kosten?',
          answer: 'Nein, bei uns gibt es keine versteckten Kosten. Alle Preise werden transparent kommuniziert und im Kostenvoranschlag detailliert aufgeschlüsselt. Sie zahlen nur das, was vereinbart wurde.'
        },
        {
          question: 'Kann ich ein unverbindliches Angebot erhalten?',
          answer: 'Ja, gerne! Kontaktieren Sie uns telefonisch oder per E-Mail mit Ihren Wünschen. Wir erstellen Ihnen innerhalb von 24 Stunden ein detailliertes, unverbindliches Angebot.'
        },
        {
          question: 'Welche Zahlungsmethoden akzeptieren Sie?',
          answer: 'Wir akzeptieren Überweisung, SEPA-Lastschrift und bei größeren Beträgen auch Ratenzahlung. Die Zahlung erfolgt nach erfolgreicher Zustellung des Fahrzeugs.'
        }
      ]
    },
    {
      title: 'Ablauf & Termine',
      faqs: [
        {
          question: 'Wie läuft die Überführung ab?',
          answer: 'Nach Ihrer Anfrage erstellen wir ein Angebot. Nach Auftragserteilung koordinieren wir die Abholung, dokumentieren den Fahrzeugzustand, führen den Transport durch und liefern pünktlich am Zielort ab. Sie erhalten regelmäßige Updates über den Status.'
        },
        {
          question: 'Kann ich den Abhol- und Liefertermin selbst bestimmen?',
          answer: 'Ja, wir versuchen immer, Ihre Wunschtermine zu berücksichtigen. Bei sehr kurzfristigen Anfragen oder besonderen Anforderungen besprechen wir die Möglichkeiten gerne mit Ihnen.'
        },
        {
          question: 'Was passiert, wenn das Fahrzeug beschädigt ankommt?',
          answer: 'Falls trotz aller Vorsichtsmaßnahmen Schäden auftreten, sind diese durch unsere Transportversicherung abgedeckt. Wir dokumentieren den Zustand bei Abholung und Zustellung, um eventuelle Schäden zu identifizieren und schnell zu regeln.'
        },
        {
          question: 'Kann ich die Überführung verfolgen?',
          answer: 'Ja, wir halten Sie über den gesamten Prozess auf dem Laufenden. Sie erhalten Updates per E-Mail oder SMS über den aktuellen Status und können uns jederzeit kontaktieren.'
        }
      ]
    },
    {
      title: 'Zulassungsservice',
      faqs: [
        {
          question: 'Was umfasst der Zulassungsservice?',
          answer: 'Unser Zulassungsservice umfasst die komplette Abwicklung der Fahrzeugzulassung am Zielort: Behördenkontakt, Terminvereinbarung, Dokumentenprüfung, Kennzeichenbeschaffung und Fahrzeugbrief-Umschreibung.'
        },
        {
          question: 'Kann ich den Zulassungsservice auch separat buchen?',
          answer: 'Ja, der Zulassungsservice kann auch unabhängig von einer Fahrzeugüberführung gebucht werden. Wir helfen Ihnen gerne bei der Zulassung Ihres bereits am Zielort befindlichen Fahrzeugs.'
        },
        {
          question: 'Welche Unterlagen benötige ich für die Zulassung?',
          answer: 'Sie benötigen den Fahrzeugbrief, die Zulassungsbescheinigung Teil II, einen gültigen Personalausweis, eine Adressbestätigung und eventuell eine Hauptuntersuchung. Wir prüfen alle Unterlagen vorab.'
        },
        {
          question: 'Wie lange dauert die Zulassung?',
          answer: 'Die Zulassung dauert in der Regel 1-3 Werktage, je nach Verfügbarkeit der Behörden und der Komplexität des Falls. Wir informieren Sie über den genauen Zeitplan.'
        }
      ]
    }
  ]

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6 text-primary-600" />,
      title: 'Telefon',
      details: ['+49 160 4245116', 'Mo-Fr: 8:00-18:00'],
      action: 'Jetzt anrufen'
    },
    {
      icon: <Mail className="h-6 w-6 text-primary-600" />,
      title: 'E-Mail',
      details: ['info@abdullahu-drive.de', 'Antwort innerhalb 24h'],
      action: 'E-Mail senden'
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-primary-600" />,
      title: 'Kontaktformular',
      details: ['Schnelle Bearbeitung', 'Unverbindliche Beratung'],
      action: 'Formular ausfüllen'
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
              Häufige Fragen
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Hier finden Sie Antworten auf die wichtigsten Fragen zu unseren 
              Fahrzeugüberführungen und Services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex
                    const isOpen = openItems.includes(globalIndex)
                    
                    return (
                      <Card key={faqIndex} className="hover:shadow-md transition-shadow">
                        <CardHeader 
                          className="cursor-pointer"
                          onClick={() => toggleItem(globalIndex)}
                        >
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-left pr-4">
                              {faq.question}
                            </CardTitle>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-primary-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-primary-600 flex-shrink-0" />
                            )}
                          </div>
                        </CardHeader>
                        {isOpen && (
                          <CardContent className="pt-0">
                            <p className="text-neutral-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Ihre Frage nicht gefunden?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Kein Problem! Wir sind gerne für Sie da und beantworten alle Ihre Fragen persönlich.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {method.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-neutral-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <Button className="w-full">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Bereit für Ihre Fahrzeugüberführung?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Kontaktieren Sie uns für ein unverbindliches Angebot. 
            Wir beraten Sie gerne und beantworten alle Ihre Fragen!
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
