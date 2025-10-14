'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save, User, Car, MapPin, Calendar } from 'lucide-react'

interface OrderFormProps {
  onClose: () => void
  onOrderCreated: (order: any) => void
}

interface OrderData {
  customer: {
    name: string
    phone: string
    email: string
  }
  vehicle: {
    make: string
    model: string
    plate: string
    vin?: string
    year?: string
  }
  pickup: {
    street: string
    houseNumber: string
    postalCode: string
    city: string
    date: string
    time: string
  }
  delivery: {
    street: string
    houseNumber: string
    postalCode: string
    city: string
    date: string
    time: string
  }
  notes?: string
}

export default function OrderForm({ onClose, onOrderCreated }: OrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<OrderData>({
    customer: {
      name: '',
      phone: '',
      email: ''
    },
    vehicle: {
      make: '',
      model: '',
      plate: '',
      vin: '',
      year: ''
    },
    pickup: {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      date: '',
      time: ''
    },
    delivery: {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      date: '',
      time: ''
    },
    notes: ''
  })

  const handleInputChange = (section: keyof OrderData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: formData,
          status: 'neu'
        }),
      })

      if (response.ok) {
        const newOrder = await response.json()
        onOrderCreated(newOrder.order)
        onClose()
      } else {
        console.error('Fehler beim Erstellen des Auftrags')
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Auftrags:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Neuer Auftrag</CardTitle>
            <CardDescription>Erstelle einen neuen Fahrzeugüberführungsauftrag</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Kunde */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Kunde</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Name *"
                  value={formData.customer.name}
                  onChange={(e) => handleInputChange('customer', 'name', e.target.value)}
                  required
                />
                <Input
                  placeholder="Telefon *"
                  value={formData.customer.phone}
                  onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                  required
                />
                <Input
                  placeholder="E-Mail"
                  type="email"
                  value={formData.customer.email}
                  onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                />
              </div>
            </div>

            {/* Fahrzeug */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Fahrzeug</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  placeholder="Marke *"
                  value={formData.vehicle.make}
                  onChange={(e) => handleInputChange('vehicle', 'make', e.target.value)}
                  required
                />
                <Input
                  placeholder="Modell *"
                  value={formData.vehicle.model}
                  onChange={(e) => handleInputChange('vehicle', 'model', e.target.value)}
                  required
                />
                <Input
                  placeholder="Kennzeichen *"
                  value={formData.vehicle.plate}
                  onChange={(e) => handleInputChange('vehicle', 'plate', e.target.value)}
                  required
                />
                <Input
                  placeholder="VIN"
                  value={formData.vehicle.vin}
                  onChange={(e) => handleInputChange('vehicle', 'vin', e.target.value)}
                />
                <Input
                  placeholder="Baujahr"
                  value={formData.vehicle.year}
                  onChange={(e) => handleInputChange('vehicle', 'year', e.target.value)}
                />
              </div>
            </div>

            {/* Abholung */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Abholung</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Straße *"
                  value={formData.pickup.street}
                  onChange={(e) => handleInputChange('pickup', 'street', e.target.value)}
                  required
                />
                <Input
                  placeholder="Hausnummer *"
                  value={formData.pickup.houseNumber}
                  onChange={(e) => handleInputChange('pickup', 'houseNumber', e.target.value)}
                  required
                />
                <Input
                  placeholder="PLZ *"
                  value={formData.pickup.postalCode}
                  onChange={(e) => handleInputChange('pickup', 'postalCode', e.target.value)}
                  required
                />
                <Input
                  placeholder="Stadt *"
                  value={formData.pickup.city}
                  onChange={(e) => handleInputChange('pickup', 'city', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Datum *"
                  value={formData.pickup.date}
                  onChange={(e) => handleInputChange('pickup', 'date', e.target.value)}
                  required
                />
                <Input
                  type="time"
                  placeholder="Uhrzeit *"
                  value={formData.pickup.time}
                  onChange={(e) => handleInputChange('pickup', 'time', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Ziel */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Ziel</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Straße *"
                  value={formData.delivery.street}
                  onChange={(e) => handleInputChange('delivery', 'street', e.target.value)}
                  required
                />
                <Input
                  placeholder="Hausnummer *"
                  value={formData.delivery.houseNumber}
                  onChange={(e) => handleInputChange('delivery', 'houseNumber', e.target.value)}
                  required
                />
                <Input
                  placeholder="PLZ *"
                  value={formData.delivery.postalCode}
                  onChange={(e) => handleInputChange('delivery', 'postalCode', e.target.value)}
                  required
                />
                <Input
                  placeholder="Stadt *"
                  value={formData.delivery.city}
                  onChange={(e) => handleInputChange('delivery', 'city', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Datum *"
                  value={formData.delivery.date}
                  onChange={(e) => handleInputChange('delivery', 'date', e.target.value)}
                  required
                />
                <Input
                  type="time"
                  placeholder="Uhrzeit *"
                  value={formData.delivery.time}
                  onChange={(e) => handleInputChange('delivery', 'time', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Notizen */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notizen</h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Zusätzliche Informationen zum Auftrag..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Erstelle...' : 'Auftrag erstellen'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
