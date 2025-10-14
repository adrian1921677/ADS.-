'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface LicensePlateInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  required?: boolean
}

export default function LicensePlateInput({
  value,
  onChange,
  placeholder = "z.B. B-AB 1234",
  className = "",
  error = false,
  required = false
}: LicensePlateInputProps) {
  const [formattedValue, setFormattedValue] = useState(value)

  // Deutsche Kennzeichen-Validierung
  const validateGermanLicensePlate = (plate: string): boolean => {
    // Entferne Leerzeichen und konvertiere zu Großbuchstaben
    const cleanPlate = plate.replace(/\s/g, '').toUpperCase()
    
    // Deutsche Kennzeichen-Format: 1-3 Buchstaben, Bindestrich, 1-2 Buchstaben, 1-4 Ziffern
    const germanPattern = /^[A-ZÄÖÜ]{1,3}-[A-ZÄÖÜ]{1,2}\s?[0-9]{1,4}[A-ZÄÖÜ]?$/
    
    return germanPattern.test(cleanPlate)
  }

  // Formatierung des Kennzeichens
  const formatLicensePlate = (input: string): string => {
    // Entferne alle Leerzeichen und konvertiere zu Großbuchstaben
    let formatted = input.replace(/\s/g, '').toUpperCase()
    
    // Füge automatisch Bindestrich hinzu wenn nicht vorhanden
    if (formatted.length > 0 && !formatted.includes('-')) {
      // Finde die Position für den Bindestrich (nach 1-3 Buchstaben)
      const match = formatted.match(/^([A-ZÄÖÜ]{1,3})([A-ZÄÖÜ]{1,2}[0-9]{1,4}[A-ZÄÖÜ]?)$/)
      if (match) {
        formatted = `${match[1]}-${match[2]}`
      }
    }
    
    // Füge Leerzeichen vor den Zahlen hinzu
    formatted = formatted.replace(/([A-ZÄÖÜ])([0-9])/g, '$1 $2')
    
    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const formatted = formatLicensePlate(inputValue)
    
    setFormattedValue(formatted)
    onChange(formatted)
  }

  useEffect(() => {
    setFormattedValue(value)
  }, [value])

  const isValid = value ? validateGermanLicensePlate(value) : true
  const showError = error || (value && !isValid)

  return (
    <div className="space-y-1">
      <Input
        value={formattedValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${showError ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
        required={required}
        maxLength={10}
      />
      {value && !isValid && (
        <p className="text-red-500 text-xs">
          Bitte geben Sie ein gültiges deutsches Kennzeichen ein (z.B. B-AB 1234)
        </p>
      )}
      {value && isValid && (
        <p className="text-green-600 text-xs">
          ✓ Gültiges Kennzeichen
        </p>
      )}
    </div>
  )
}
