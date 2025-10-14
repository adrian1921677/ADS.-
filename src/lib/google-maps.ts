import { Client } from '@googlemaps/google-maps-services-js'

const client = new Client({})

export interface AddressSuggestion {
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

export interface PlaceDetails {
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
  name?: string
  formatted_phone_number?: string
  website?: string
}

export async function searchAddresses(query: string): Promise<AddressSuggestion[]> {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input: query,
        key: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyB6Rx2MkBr9fmxrCBTa1RKwlNNOp-p1QQE',
        language: 'de' as any,
        components: ['country:de']
      }
    })

    return response.data.predictions.map(prediction => ({
      place_id: prediction.place_id,
      formatted_address: prediction.description,
      address_components: prediction.structured_formatting ? [
        {
          long_name: prediction.structured_formatting.main_text,
          short_name: prediction.structured_formatting.main_text,
          types: ['route', 'street_address']
        },
        {
          long_name: prediction.structured_formatting.secondary_text || '',
          short_name: prediction.structured_formatting.secondary_text || '',
          types: ['locality', 'administrative_area_level_1', 'country']
        }
      ] : [],
      geometry: {
        location: {
          lat: 0,
          lng: 0
        }
      }
    }))
  } catch (error) {
    console.error('Google Maps API Error:', error)
    return []
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyB6Rx2MkBr9fmxrCBTa1RKwlNNOp-p1QQE',
        language: 'de' as any,
        fields: ['place_id', 'formatted_address', 'address_components', 'geometry', 'name', 'formatted_phone_number', 'website']
      }
    })

    const place = response.data.result
    if (!place) return null

    return {
      place_id: place.place_id || '',
      formatted_address: place.formatted_address || '',
      address_components: place.address_components || [],
      geometry: {
        location: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0
        }
      },
      name: place.name,
      formatted_phone_number: place.formatted_phone_number,
      website: place.website
    }
  } catch (error) {
    console.error('Google Maps Place Details Error:', error)
    return null
  }
}

export function parseAddressComponents(components: any[]): {
  street: string
  houseNumber: string
  postalCode: string
  city: string
  state: string
  country: string
} {
  const result = {
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    state: '',
    country: ''
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
