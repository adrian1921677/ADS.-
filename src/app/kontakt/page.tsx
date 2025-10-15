'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen lang sein'),
  gdprConsent: z.boolean().refine(val => val === true, 'Sie müssen der Datenschutzerklärung zustimmen'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function KontaktPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Fehler beim Senden der Nachricht')
      }

      const responseData = await response.json()
      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-live="polite" aria-describedby="form-hint">
                  <span id="form-hint" className="sr-only">Alle Pflichtfelder sind mit Stern gekennzeichnet.</span>
                  
                  {/* Name und E-Mail */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                        Name * <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Ihr vollständiger Name"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                        E-Mail * <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="ihre@email.de"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Telefon und Betreff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                        Telefon (optional)
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="+49 (0) 123 456 789"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                        Betreff (optional)
                      </label>
                      <Input
                        id="subject"
                        {...register('subject')}
                        placeholder="z.B. Angebot anfordern"
                        className={errors.subject ? 'border-red-500' : ''}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Nachricht */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                      Nachricht * <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Beschreiben Sie Ihr Anliegen oder stellen Sie Ihre Fragen..."
                      rows={6}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* GDPR Consent */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="gdprConsent"
                        {...register('gdprConsent')}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="gdprConsent" className="text-sm text-neutral-700">
                        Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                        <a href="/datenschutz" className="text-primary-600 hover:underline">
                          Datenschutzerklärung
                        </a>{' '}
                        zu. * <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {errors.gdprConsent && (
                      <p className="text-red-500 text-sm">{errors.gdprConsent.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                    </Button>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <p className="text-green-800">
                          Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-800">
                        Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
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
