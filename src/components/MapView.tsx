/**
 * Map view component using Leaflet
 * Displays businesses on an interactive map
 */
import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Business } from '../types'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapViewProps {
  businesses: Business[]
  center?: [number, number]
  zoom?: number
  userLocation?: { lat: number; lng: number } | null
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap()
  const centerRef = useRef(center)

  useEffect(() => {
    if (center && (center[0] !== centerRef.current?.[0] || center[1] !== centerRef.current?.[1])) {
      map.setView(center, zoom || 13)
      centerRef.current = center
    }
  }, [center, zoom, map])

  return null
}

export function MapView({
  businesses,
  center = [43.6532, -79.3832], // Toronto default
  zoom = 12,
  userLocation,
}: MapViewProps) {
  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : center

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={mapCenter} zoom={zoom} />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        {businesses.map((business) => (
          <Marker key={business.id} position={[business.lat, business.lng]}>
            <Popup>
              <div className="p-2">
                <Link
                  to={`/business/${business.id}`}
                  className="font-semibold text-primary-600 hover:underline"
                >
                  {business.name}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{business.address}</p>
                <p className="text-sm text-gray-500">
                  {business.avgRating.toFixed(1)} ⭐ ({business.ratingCount} reviews)
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

