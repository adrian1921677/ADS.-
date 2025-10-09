'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin, Loader2 } from 'lucide-react'

interface AddressSuggestion {
  display_name: string
  address: {
    house_number?: string
    road?: string
    postcode?: string
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
  lat: string
  lon: string
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect: (address: {
    street: string
    houseNumber: string
    postalCode: string
    city: string
  }) => void
  placeholder?: string
  className?: string
  error?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Adresse eingeben...",
  className = "",
  error = false
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value])

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/geocoding/search?q=${encodeURIComponent(query)}`
      )
      
      if (response.ok) {
        const data = await response.json()
        // Prüfen ob data ein Array ist und nicht leer
        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data)
          setShowSuggestions(true)
          setSelectedIndex(-1)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } else {
        console.error('API error:', response.status)
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Fehler bei der Adresssuche:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    const address = suggestion.address
    const street = address.road || ''
    const houseNumber = address.house_number || ''
    const postalCode = address.postcode || ''
    const city = address.city || address.town || address.village || ''

    // Setze die Adresse in die entsprechenden Felder
    onAddressSelect({
      street,
      houseNumber,
      postalCode,
      city
    })

    // Setze den Anzeigenamen als Wert
    onChange(suggestion.display_name)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleAddressSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Verzögere das Schließen, damit onClick funktioniert
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }, 150)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => value.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={`pr-10 ${error ? 'border-red-500' : ''} ${className}`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.lat}-${suggestion.lon}`}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleAddressSelect(suggestion)}
            >
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.address.road && suggestion.address.house_number && (
                      `${suggestion.address.road} ${suggestion.address.house_number}`
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.address.postcode} {suggestion.address.city || suggestion.address.town || suggestion.address.village}
                    {suggestion.address.state && `, ${suggestion.address.state}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
