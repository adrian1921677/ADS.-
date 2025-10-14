'use client'

import { useState } from 'react'

interface VehicleMakeSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  required?: boolean
}

const vehicleMakes = [
  'Audi',
  'BMW',
  'Mercedes-Benz',
  'Volkswagen',
  'Porsche',
  'Opel',
  'Ford',
  'Renault',
  'Peugeot',
  'Citroën',
  'Fiat',
  'Alfa Romeo',
  'Lancia',
  'Ferrari',
  'Lamborghini',
  'Maserati',
  'Jaguar',
  'Land Rover',
  'Mini',
  'Smart',
  'Seat',
  'Škoda',
  'Hyundai',
  'Kia',
  'Toyota',
  'Honda',
  'Nissan',
  'Mazda',
  'Subaru',
  'Mitsubishi',
  'Suzuki',
  'Daihatsu',
  'Lexus',
  'Infiniti',
  'Acura',
  'Tesla',
  'Polestar',
  'Volvo',
  'Saab',
  'Dacia',
  'Lada',
  'Trabant',
  'Wartburg',
  'Barkas',
  'IFA',
  'Sonstiges'
]

export default function VehicleMakeSelect({
  value,
  onChange,
  placeholder = "Marke wählen",
  className = "",
  error = false,
  required = false
}: VehicleMakeSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMakes = vehicleMakes.filter(make =>
    make.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (make: string) => {
    onChange(make)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setSearchTerm(inputValue)
    setIsOpen(true)
    
    // Wenn der Benutzer etwas eingibt, das nicht in der Liste steht, setze es als Wert
    if (!vehicleMakes.includes(inputValue)) {
      onChange(inputValue)
    }
  }

  const handleBlur = () => {
    // Verzögere das Schließen, damit onClick funktioniert
    setTimeout(() => {
      setIsOpen(false)
      setSearchTerm('')
    }, 150)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm || value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-red-500' : 'border-neutral-300'
          } ${className}`}
          required={required}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredMakes.map((make) => (
            <div
              key={make}
              onClick={() => handleSelect(make)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900">{make}</div>
            </div>
          ))}
          {filteredMakes.length === 0 && searchTerm && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Keine Marke gefunden. &quot;{searchTerm}&quot; wird als benutzerdefinierte Marke gespeichert.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
