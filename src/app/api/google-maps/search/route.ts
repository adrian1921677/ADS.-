import { NextRequest, NextResponse } from 'next/server'
import { searchAddresses, getPlaceDetails } from '@/lib/google-maps'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const placeId = searchParams.get('place_id')

    if (!query && !placeId) {
      return NextResponse.json({ error: 'Query or place_id parameter required' }, { status: 400 })
    }

    if (placeId) {
      // Get place details
      const details = await getPlaceDetails(placeId)
      if (!details) {
        return NextResponse.json({ error: 'Place not found' }, { status: 404 })
      }
      return NextResponse.json(details)
    } else {
      // Search addresses
      const suggestions = await searchAddresses(query!)
      return NextResponse.json(suggestions)
    }
  } catch (error) {
    console.error('Google Maps API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
