import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { pickupAddress, deliveryAddress } = await request.json()
    
    console.log('Empfangene Adressen:', { pickupAddress, deliveryAddress })
    
    if (!pickupAddress || !deliveryAddress) {
      return NextResponse.json({ error: 'Beide Adressen sind erforderlich' }, { status: 400 })
    }

    // Versuche zuerst OpenRouteService (kostenlos + KI-optimiert)
    const orsApiKey = process.env.OPENROUTESERVICE_API_KEY
    if (orsApiKey) {
      const orsDistance = await getOpenRouteServiceDistance(pickupAddress, deliveryAddress, orsApiKey)
      if (orsDistance) {
        console.log('OpenRouteService erfolgreich:', orsDistance)
        return NextResponse.json({ 
          distance: orsDistance,
          pickupCoords: null,
          deliveryCoords: null,
          source: 'openrouteservice',
          message: 'Distanz berechnet mit OpenRouteService (KI-optimiert)'
        })
      }
    }

    // Fallback: Google Maps Distance Matrix API
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY
    if (googleApiKey) {
      const googleDistance = await getGoogleDistance(pickupAddress, deliveryAddress, googleApiKey)
      if (googleDistance) {
        console.log('Google Maps Distance Matrix erfolgreich:', googleDistance)
        return NextResponse.json({ 
          distance: googleDistance,
          pickupCoords: null,
          deliveryCoords: null,
          source: 'google_maps',
          message: 'Distanz berechnet mit Google Maps'
        })
      }
    }
    
    // Fallback: Verbesserte Geocoding + Präzise Distanzberechnung
    console.log('Premium Services nicht verfügbar, verwende verbesserte Geocoding + präzise Berechnung')
    let pickupCoords = await geocodeAddress(pickupAddress)
    let deliveryCoords = await geocodeAddress(deliveryAddress)
    
    // Fallback: Versuche nur mit Stadt und PLZ
    if (!pickupCoords) {
      console.log('Fallback für Abholung: Versuche nur Stadt und PLZ')
      const pickupParts = pickupAddress.split(',')
      if (pickupParts.length >= 2) {
        const cityPart = pickupParts[1].trim()
        pickupCoords = await geocodeAddress(cityPart)
      }
    }
    
    if (!deliveryCoords) {
      console.log('Fallback für Ziel: Versuche nur Stadt und PLZ')
      const deliveryParts = deliveryAddress.split(',')
      if (deliveryParts.length >= 2) {
        const cityPart = deliveryParts[1].trim()
        deliveryCoords = await geocodeAddress(cityPart)
      }
    }
    
    if (!pickupCoords || !deliveryCoords) {
      console.log('Beide Fallbacks fehlgeschlagen, versuche Schätzung')
      
            // Fallback: Schätze Distanz basierend auf deutschen Großstädten
            const estimatedDistance = await estimateDistanceBetweenCities(pickupAddress, deliveryAddress)
      
      if (estimatedDistance) {
        return NextResponse.json({ 
          distance: estimatedDistance,
          pickupCoords: null,
          deliveryCoords: null,
          estimated: true,
          source: 'city_estimation',
          message: 'Distanz geschätzt basierend auf Städten'
        })
      }
      
      return NextResponse.json({ 
        error: 'Adressen konnten nicht gefunden werden. Bitte überprüfen Sie die Eingabe oder geben Sie manuell die Kilometer ein.',
        details: {
          pickupFound: !!pickupCoords,
          deliveryFound: !!deliveryCoords,
          pickupAddress,
          deliveryAddress
        }
      }, { status: 400 })
    }
    
    // Präzise Distanzberechnung mit mehreren Methoden
    const haversineDistance = await calculateDistance(pickupCoords, deliveryCoords)
    const vincentyDistance = await calculateVincentyDistance(pickupCoords, deliveryCoords)
    
    // Verwende die präzisere Berechnung
    const distance = Math.max(haversineDistance, vincentyDistance || 0)
    
    console.log('Erfolgreiche Berechnung:', { 
      haversine: haversineDistance, 
      vincenty: vincentyDistance, 
      final: distance,
      pickupCoords, 
      deliveryCoords 
    })
    
    return NextResponse.json({ 
      distance: Math.round(distance), // Kilometer auf ganze Zahl runden
      pickupCoords,
      deliveryCoords,
      source: 'enhanced_geocoding',
      message: 'Distanz berechnet mit verbesserter Geocoding + präziser Mathematik'
    })
    
  } catch (error) {
    console.error('Fehler bei der Distanzberechnung:', error)
    return NextResponse.json({ error: 'Fehler bei der Distanzberechnung' }, { status: 500 })
  }
}

async function geocodeAddress(address: string) {
  try {
    console.log('Suche nach Adresse:', address)
    
    // Versuche zuerst Google Maps API
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY
    if (googleApiKey) {
      const googleResult = await geocodeWithGoogle(address, googleApiKey)
      if (googleResult) {
        console.log('Google Maps erfolgreich:', googleResult)
        return googleResult
      }
    }
    
    // Verbesserte Nominatim-Suche mit mehreren Strategien
    console.log('Google Maps nicht verfügbar, verwende verbesserte OpenStreetMap-Suche')
    
    // Strategie 1: Vollständige Adresse
    let result = await searchNominatim(address, 'full')
    if (result) return result
    
    // Strategie 2: Adresse mit "Deutschland" ergänzt
    result = await searchNominatim(`${address}, Deutschland`, 'with_country')
    if (result) return result
    
    // Strategie 3: Nur Straße und Stadt
    const parts = address.split(',')
    if (parts.length >= 2) {
      const streetCity = `${parts[0].trim()}, ${parts[1].trim()}`
      result = await searchNominatim(streetCity, 'street_city')
      if (result) return result
    }
    
    // Strategie 4: Nur Stadt und PLZ
    if (parts.length >= 2) {
      const cityZip = parts[1].trim()
      result = await searchNominatim(cityZip, 'city_zip')
      if (result) return result
    }
    
    console.log('Alle Geocoding-Strategien fehlgeschlagen für:', address)
    return null
  } catch (error) {
    console.error('Geocoding Fehler:', error)
    return null
  }
}

async function searchNominatim(query: string, strategy: string) {
  try {
    console.log(`Nominatim-Suche (${strategy}):`, query)
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&countrycodes=de&addressdetails=1&extratags=1`,
      {
        headers: {
          'User-Agent': 'AbdullahuDriveSolutions/1.0'
        }
      }
    )
    
    if (!response.ok) {
      console.error('Nominatim API Fehler:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    console.log(`Nominatim Antwort (${strategy}):`, data.length, 'Ergebnisse')
    
    if (data && data.length > 0) {
      // Wähle das beste Ergebnis basierend auf Relevanz
      const bestResult = data[0]
      const result = {
        lat: parseFloat(bestResult.lat),
        lon: parseFloat(bestResult.lon),
        importance: bestResult.importance || 0,
        display_name: bestResult.display_name
      }
      
      console.log(`Beste Koordinaten (${strategy}):`, result)
      return result
    }
    
    return null
  } catch (error) {
    console.error(`Nominatim Fehler (${strategy}):`, error)
    return null
  }
}

async function getOpenRouteServiceDistance(origin: string, destination: string, apiKey: string) {
  try {
    // Zuerst Geocoding für beide Adressen
    const originCoords = await geocodeWithOpenRouteService(origin, apiKey)
    const destCoords = await geocodeWithOpenRouteService(destination, apiKey)
    
    if (!originCoords || !destCoords) {
      console.log('OpenRouteService Geocoding fehlgeschlagen')
      return null
    }
    
    // Dann Distanzberechnung mit Matrix API
    const response = await fetch(
      `https://api.openrouteservice.org/v2/matrix/driving-car`,
      {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locations: [originCoords, destCoords],
          sources: [0],
          destinations: [1],
          metrics: ['distance']
        })
      }
    )
    
    if (!response.ok) {
      console.error('OpenRouteService Matrix API Fehler:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    
    if (data.distances && data.distances[0] && data.distances[0][0]) {
      const distanceMeters = data.distances[0][0]
      const distanceKm = Math.round(distanceMeters / 1000)
      console.log('OpenRouteService Distanz:', distanceKm, 'km')
      return distanceKm
    }
    
    console.log('OpenRouteService keine Distanzdaten')
    return null
  } catch (error) {
    console.error('OpenRouteService Fehler:', error)
    return null
  }
}

async function geocodeWithOpenRouteService(address: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}&boundary.country=DE&size=1`
    )
    
    if (!response.ok) {
      console.error('OpenRouteService Geocoding Fehler:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0]
      return [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] // [lon, lat]
    }
    
    console.log('OpenRouteService keine Geocoding-Ergebnisse')
    return null
  } catch (error) {
    console.error('OpenRouteService Geocoding Fehler:', error)
    return null
  }
}

async function getGoogleDistance(origin: string, destination: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${apiKey}&region=de`
    )
    
    if (!response.ok) {
      console.error('Google Maps Distance Matrix API Fehler:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    
    if (data.status === 'OK' && 
        data.rows && 
        data.rows.length > 0 && 
        data.rows[0].elements && 
        data.rows[0].elements.length > 0) {
      
      const element = data.rows[0].elements[0]
      
      if (element.status === 'OK' && element.distance) {
        // Konvertiere Meter zu Kilometern
        const distanceKm = Math.round(element.distance.value / 1000)
        console.log('Google Maps Distanz:', distanceKm, 'km')
        return distanceKm
      } else {
        console.log('Google Maps Distance Matrix Status:', element.status)
      }
    }
    
    console.log('Google Maps Distance Matrix keine Ergebnisse:', data.status)
    return null
  } catch (error) {
    console.error('Google Maps Distance Matrix Fehler:', error)
    return null
  }
}

async function geocodeWithGoogle(address: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&region=de`
    )
    
    if (!response.ok) {
      console.error('Google Maps API Fehler:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0]
      return {
        lat: result.geometry.location.lat,
        lon: result.geometry.location.lng
      }
    }
    
    console.log('Google Maps keine Ergebnisse:', data.status)
    return null
  } catch (error) {
    console.error('Google Maps Geocoding Fehler:', error)
    return null
  }
}

async function calculateDistance(coord1: { lat: number; lon: number }, coord2: { lat: number; lon: number }) {
  // Haversine-Formel für Distanzberechnung zwischen zwei Koordinaten
  const R = 6371 // Erdradius in Kilometern
  const dLat = toRad(coord2.lat - coord1.lat)
  const dLon = toRad(coord2.lon - coord1.lon)
  const lat1 = toRad(coord1.lat)
  const lat2 = toRad(coord2.lat)

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRad(deg: number) {
  return deg * (Math.PI / 180)
}

// Vincenty-Formel für höchste Präzision (bis zu 0.5mm Genauigkeit)
async function calculateVincentyDistance(coord1: { lat: number; lon: number }, coord2: { lat: number; lon: number }) {
  const a = 6378137.0 // WGS84 semi-major axis
  const f = 1/298.257223563 // WGS84 flattening
  const b = (1 - f) * a // semi-minor axis
  
  const L = toRad(coord2.lon - coord1.lon)
  const U1 = Math.atan((1 - f) * Math.tan(toRad(coord1.lat)))
  const U2 = Math.atan((1 - f) * Math.tan(toRad(coord2.lat)))
  
  const sinU1 = Math.sin(U1)
  const cosU1 = Math.cos(U1)
  const sinU2 = Math.sin(U2)
  const cosU2 = Math.cos(U2)
  
  let lambda = L
  let lambdaP = 2 * Math.PI
  let iterLimit = 100
  
  let cosSqAlpha, sinSigma, cos2SigmaM, cosSigma, sigma
  
  do {
    const sinLambda = Math.sin(lambda)
    const cosLambda = Math.cos(lambda)
    
    sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + 
                        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * 
                        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda))
    
    if (sinSigma === 0) return 0 // co-incident points
    
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda
    sigma = Math.atan2(sinSigma, cosSigma)
    
    const sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma
    cosSqAlpha = 1 - sinAlpha * sinAlpha
    cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha
    
    if (isNaN(cos2SigmaM)) cos2SigmaM = 0 // equatorial line
    
    const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
    lambdaP = lambda
    lambda = L + (1 - C) * f * sinAlpha * 
             (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * 
             (-1 + 2 * cos2SigmaM * cos2SigmaM)))
  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0)
  
  if (iterLimit === 0) return null // formula failed to converge
  
  const uSq = cosSqAlpha * (a * a - b * b) / (b * b)
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))
  const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * 
                   (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * 
                   (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)))
  
  const s = b * A * (sigma - deltaSigma)
  
  return s / 1000 // Convert to kilometers
}

// Schätze Distanz zwischen deutschen Städten
async function estimateDistanceBetweenCities(address1: string, address2: string): Promise<number | null> {
  const germanCities = {
    'berlin': { lat: 52.5200, lon: 13.4050 },
    'hamburg': { lat: 53.5511, lon: 9.9937 },
    'münchen': { lat: 48.1351, lon: 11.5820 },
    'köln': { lat: 50.9375, lon: 6.9603 },
    'frankfurt': { lat: 50.1109, lon: 8.6821 },
    'stuttgart': { lat: 48.7758, lon: 9.1829 },
    'düsseldorf': { lat: 51.2277, lon: 6.7735 },
    'leipzig': { lat: 51.3397, lon: 12.3731 },
    'dortmund': { lat: 51.5136, lon: 7.4653 },
    'essen': { lat: 51.4556, lon: 7.0116 },
    'bremen': { lat: 53.0793, lon: 8.8017 },
    'dresden': { lat: 51.0504, lon: 13.7373 },
    'hannover': { lat: 52.3759, lon: 9.7320 },
    'nürnberg': { lat: 49.4521, lon: 11.0767 },
    'duisburg': { lat: 51.4344, lon: 6.7623 },
    'bochum': { lat: 51.4818, lon: 7.2162 },
    'wuppertal': { lat: 51.2562, lon: 7.1508 },
    'bielefeld': { lat: 52.0302, lon: 8.5325 },
    'bonn': { lat: 50.7374, lon: 7.0982 },
    'münster': { lat: 51.9607, lon: 7.6261 }
  }
  
  // Extrahiere Städtenamen aus den Adressen
  const getCityFromAddress = (address: string): string | null => {
    const lowerAddress = address.toLowerCase()
    for (const city of Object.keys(germanCities)) {
      if (lowerAddress.includes(city)) {
        return city
      }
    }
    return null
  }
  
  const city1 = getCityFromAddress(address1)
  const city2 = getCityFromAddress(address2)
  
  if (city1 && city2 && city1 !== city2) {
    const coords1 = germanCities[city1 as keyof typeof germanCities]
    const coords2 = germanCities[city2 as keyof typeof germanCities]
    
    if (coords1 && coords2) {
      const distance = await calculateDistance(coords1, coords2)
      console.log(`Geschätzte Distanz zwischen ${city1} und ${city2}: ${Math.round(distance)} km`)
      return Math.round(distance)
    }
  }
  
  return null
}
