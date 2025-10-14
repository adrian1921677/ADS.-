'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Search } from 'lucide-react'

interface AddressSuggestion {
  place_id: string
  formatted_address: string
  address_components: {
    long_name: string
    short_name: string
    types: string[]
  }[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface ParsedAddress {
  street: string
  houseNumber: string
  postalCode: string
  city: string
  state: string
  country: string
  placeId: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface GoogleMapsAutocompleteProps {
  onAddressSelect: (address: ParsedAddress) => void
  placeholder?: string
}

export default function GoogleMapsAutocomplete({ onAddressSelect, placeholder = "Adresse eingeben..." }: GoogleMapsAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const searchAddresses = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/google-maps/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      } else {
        console.error('Fehler bei der Adresssuche:', response.statusText)
        setSuggestions([])
      }
    } catch (error) {
      console.error('Fehler bei der Adresssuche:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 3) {
        searchAddresses(query)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
  }

  const parseAddressComponents = (components: any[]): ParsedAddress => {
    const result = {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      state: '',
      country: '',
      placeId: '',
      coordinates: { lat: 0, lng: 0 }
    }

    components.forEach(component => {
      const types = component.types || []
      
      if (types.includes('route')) {
        result.street = component.long_name
      } else if (types.includes('street_number')) {
        result.houseNumber = component.long_name
      } else if (types.includes('postal_code')) {
        result.postalCode = component.long_name
      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        result.city = component.long_name
      } else if (types.includes('administrative_area_level_1')) {
        result.state = component.long_name
      } else if (types.includes('country')) {
        result.country = component.long_name
      }
    })

    return result
  }

  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
    setQuery(suggestion.formatted_address)
    setIsOpen(false)
    
    try {
      // Hole detaillierte Informationen über die Adresse
      const response = await fetch(`/api/google-maps/search?place_id=${suggestion.place_id}`)
      if (response.ok) {
        const details = await response.json()
        const parsedAddress = parseAddressComponents(details.address_components)
        parsedAddress.placeId = details.place_id
        parsedAddress.coordinates = details.geometry.location
        onAddressSelect(parsedAddress)
      } else {
        // Fallback mit den verfügbaren Daten
        const parsedAddress = parseAddressComponents(suggestion.address_components)
        parsedAddress.placeId = suggestion.place_id
        parsedAddress.coordinates = suggestion.geometry.location
        onAddressSelect(parsedAddress)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Adressdetails:', error)
      // Fallback mit den verfügbaren Daten
      const parsedAddress = parseAddressComponents(suggestion.address_components)
      parsedAddress.placeId = suggestion.place_id
      parsedAddress.coordinates = suggestion.geometry.location
      onAddressSelect(parsedAddress)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.formatted_address}
                </p>
                <p className="text-xs text-gray-500">
                  Deutschland
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 3 && suggestions.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">Keine Adressen gefunden</p>
        </div>
      )}
    </div>
  )
}
