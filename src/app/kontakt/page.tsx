'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, Upload, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import GoogleMapsAutocomplete from '@/components/GoogleMapsAutocomplete'
 

const contactSchema = z.object({
  salutation: z.enum(['herr', 'frau']),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().min(10, 'Bitte geben Sie eine gültige Telefonnummer ein'),
  contactMethod: z.enum(['email', 'phone']).or(z.string()).refine((v) => v === 'email' || v === 'phone', 'Bitte wählen Sie eine Kontaktmethode'),
  callWindow: z.string().optional(),
  vehicleType: z.string().min(1, 'Bitte wählen Sie einen Fahrzeugtyp'),
  vehiclePlate: z.string().min(1, 'Bitte Kennzeichen angeben'),
  vehicleMakeModel: z.string().min(1, 'Bitte Marke/Modell angeben'),
  vehicleNotes: z.string().optional(),
  pickupAddress: z.string().min(5, 'Bitte Abholadresse angeben'),
  pickupDate: z.string().min(1, 'Bitte Abholdatum angeben'),
  pickupTime: z.string().min(1, 'Bitte Abholzeit angeben'),
  deliveryAddress: z.string().min(5, 'Bitte Zieladresse angeben'),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
  message: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, 'Sie müssen der Datenschutzerklärung zustimmen'),
  newsletterConsent: z.boolean().optional(),
}).superRefine((val, ctx) => {
  if (val.contactMethod === 'phone' && (!val.callWindow || val.callWindow.length === 0)) {
    ctx.addIssue({ path: ['callWindow'], code: z.ZodIssueCode.custom, message: 'Bitte Zeitfenster wählen' })
  }
})

type ContactFormData = z.infer<typeof contactSchema>

export default function KontaktPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [, setPickupAddressData] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    placeId: '',
    coordinates: { lat: 0, lng: 0 }
  })
  const [, setDeliveryAddressData] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    placeId: '',
    coordinates: { lat: 0, lng: 0 }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const contactMethod = watch('contactMethod')
  useEffect(() => {
    if (contactMethod !== 'phone') {
      setValue('callWindow', '')
    }
  }, [contactMethod, setValue])

  const handlePickupAddressSelect = (address: any) => {
    setPickupAddressData(address)
    setValue('pickupAddress', `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}`)
  }

  const handleDeliveryAddressSelect = (address: any) => {
    setDeliveryAddressData(address)
    setValue('deliveryAddress', `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}`)
  }


  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Fehler bei der Übermittlung')
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
      details: ['info@abdullahu-drive-solutions.de', 'Antwort innerhalb 24h']
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

  const vehicleTypes = [
    'PKW',
    'Kombi',
    'SUV',
    'Kleinwagen',
    'Cabrio',
    'Coupe',
    'Limousine',
    'Van',
    'Sonstiges'
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
                <CardTitle className="text-3xl text-primary-600">Anfrage stellen</CardTitle>
                <CardDescription className="text-body">
                  Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-live="polite" aria-describedby="form-hint">
                  <span id="form-hint" className="sr-only">Alle Pflichtfelder sind mit Stern gekennzeichnet.</span>
                  {/* Personal Information */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Anrede *</label>
                    <div className="flex items-center gap-6 text-sm">
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="herr" {...register('salutation')} />
                        Herr
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="frau" {...register('salutation')} />
                        Frau
                      </label>
                    </div>
                    {errors.salutation && (
                      <p className="text-red-500 text-sm mt-1">Bitte Anrede wählen</p>
                    )}
                  </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                        Telefon * <span className="text-red-500">*</span>
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
                      <label htmlFor="vehicleType" className="block text-sm font-medium text-neutral-700 mb-2">
                        Fahrzeugtyp * <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="vehicleType"
                        {...register('vehicleType')}
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.vehicleType ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      >
                        <option value="">Bitte wählen</option>
                        {vehicleTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.vehicleType && (
                        <p className="text-red-500 text-sm mt-1">{errors.vehicleType.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Fahrzeugdaten */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="vehiclePlate" className="block text-sm font-medium text-neutral-700 mb-2">
                        Kennzeichen * <span className="text-red-500">*</span>
                      </label>
                      <Input id="vehiclePlate" {...register('vehiclePlate')} placeholder="z.B. B-AB 1234" className={errors.vehiclePlate ? 'border-red-500' : ''} />
                      {errors.vehiclePlate && (
                        <p className="text-red-500 text-sm mt-1">{errors.vehiclePlate.message}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="vehicleMakeModel" className="block text-sm font-medium text-neutral-700 mb-2">
                        Marke / Modell * <span className="text-red-500">*</span>
                      </label>
                      <Input id="vehicleMakeModel" {...register('vehicleMakeModel')} placeholder="z.B. VW Golf 8" className={errors.vehicleMakeModel ? 'border-red-500' : ''} />
                      {errors.vehicleMakeModel && (
                        <p className="text-red-500 text-sm mt-1">{errors.vehicleMakeModel.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Kontaktpräferenz */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Bevorzugte Kontaktmethode *</label>
                      <div className="flex items-center gap-6 text-sm">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="email" {...register('contactMethod')} />
                          E-Mail
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="phone" {...register('contactMethod')} />
                          Telefon
                        </label>
                      </div>
                      {errors.contactMethod && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactMethod.message as string}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Gewünschtes Zeitfenster (bei Telefon)</label>
                      <select
                        {...register('callWindow')}
                        disabled={contactMethod !== 'phone'}
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${errors.callWindow ? 'border-red-500' : 'border-neutral-300'} ${contactMethod !== 'phone' ? 'bg-neutral-100 cursor-not-allowed text-neutral-500' : ''}`}
                      >
                        <option value="">Bitte wählen</option>
                        {[
                          '08:00 - 10:00',
                          '10:00 - 12:00',
                          '12:00 - 14:00',
                          '14:00 - 16:00',
                          '16:00 - 18:00',
                          '18:00 - 20:00',
                        ].map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      <p className="text-neutral-500 text-xs mt-1">Nur relevant, wenn wir Sie telefonisch erreichen sollen.</p>
                      {errors.callWindow && (
                        <p className="text-red-500 text-sm mt-1">{errors.callWindow.message as string}</p>
                      )}
                    </div>
                  </div>

                  {/* Transport Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 bg-neutral-50">
                      <div className="text-sm font-semibold text-neutral-700 mb-4">Abholung</div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse suchen *</label>
                          <GoogleMapsAutocomplete
                            onAddressSelect={handlePickupAddressSelect}
                            placeholder="Adresse eingeben (z.B. Musterstraße 123, 12345 Musterstadt)"
                          />
                          {errors.pickupAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.pickupAddress.message}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="pickupDate" className="block text-sm font-medium text-neutral-700 mb-2">Datum *</label>
                            <Input 
                              id="pickupDate" 
                              type="date" 
                              {...register('pickupDate')} 
                              className={errors.pickupDate ? 'border-red-500' : ''} 
                            />
                            {errors.pickupDate && (
                              <p className="text-red-500 text-sm mt-1">{errors.pickupDate.message}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="pickupTime" className="block text-sm font-medium text-neutral-700 mb-2">Uhrzeit *</label>
                            <Input 
                              id="pickupTime" 
                              type="time" 
                              {...register('pickupTime')} 
                              className={errors.pickupTime ? 'border-red-500' : ''} 
                            />
                            {errors.pickupTime && (
                              <p className="text-red-500 text-sm mt-1">{errors.pickupTime.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-neutral-50">
                      <div className="text-sm font-semibold text-neutral-700 mb-4">Ziel</div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse suchen *</label>
                          <GoogleMapsAutocomplete
                            onAddressSelect={handleDeliveryAddressSelect}
                            placeholder="Adresse eingeben (z.B. Beispielallee 7, 80331 München)"
                          />
                          {errors.deliveryAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="deliveryDate" className="block text-sm font-medium text-neutral-700 mb-2">Datum (optional)</label>
                            <Input 
                              id="deliveryDate" 
                              type="date" 
                              {...register('deliveryDate')} 
                              className={errors.deliveryDate ? 'border-red-500' : ''} 
                            />
                            {errors.deliveryDate && (
                              <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="deliveryTime" className="block text-sm font-medium text-neutral-700 mb-2">Uhrzeit (optional)</label>
                            <Input 
                              id="deliveryTime" 
                              type="time" 
                              {...register('deliveryTime')} 
                              className={errors.deliveryTime ? 'border-red-500' : ''} 
                            />
                            {errors.deliveryTime && (
                              <p className="text-red-500 text-sm mt-1">{errors.deliveryTime.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                      Besonderheiten / Notizen
                    </label>
                    <Textarea
                      id="message"
                      {...register('vehicleNotes')}
                      placeholder="Besonderheiten (z.B. tiefergelegt, sehr niedrig, defekt, etc.)"
                      rows={4}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Fahrzeugdokumente (optional)
                    </label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">
                        Fahrzeugbrief, Fotos oder andere relevante Dokumente hier hochladen
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="mt-2 text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    </div>
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

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="newsletterConsent"
                        {...register('newsletterConsent')}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="newsletterConsent" className="text-sm text-neutral-700">
                        Ich möchte über Neuigkeiten und Angebote per E-Mail informiert werden.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Anfrage senden'}
                    </Button>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <p className="text-green-800">
                          Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.
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
