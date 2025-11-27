/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ResourceType = 'gym' | 'hospital' | 'park' | 'grocery_store' | 'pharmacy'

interface Resource {
  id: string
  name: string
  type: ResourceType
  address: string
  distance?: string
  rating?: number
  isOpen?: boolean
}

const resourceTypes = [
  { value: 'gym', label: 'Gyms & Fitness Centers', icon: '🏋️' },
  { value: 'hospital', label: 'Hospitals & Clinics', icon: '🏥' },
  { value: 'park', label: 'Parks & Recreation', icon: '🌳' },
  { value: 'grocery_store', label: 'Grocery Stores', icon: '🛒' },
  { value: 'pharmacy', label: 'Pharmacies', icon: '💊' },
]

export function WellnessResourcesMap() {
  const [selectedType, setSelectedType] = useState<ResourceType>('gym')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])

  function requestLocation() {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
        // In a real implementation, you would fetch nearby places here
        fetchNearbyResources(position.coords.latitude, position.coords.longitude, selectedType)
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.')
        setLoading(false)
      }
    )
  }

  function fetchNearbyResources(_lat: number, _lng: number, type: ResourceType) {
    // Mock data - in production, this would call Google Places API
    const mockResources: Resource[] = [
      {
        id: '1',
        name: 'FitLife Gym',
        type: 'gym',
        address: '123 Fitness St, Your City',
        distance: '0.5 mi',
        rating: 4.5,
        isOpen: true,
      },
      {
        id: '2',
        name: 'PowerHouse Fitness',
        type: 'gym',
        address: '456 Strength Ave, Your City',
        distance: '1.2 mi',
        rating: 4.8,
        isOpen: true,
      },
      {
        id: '3',
        name: 'Wellness Center',
        type: 'gym',
        address: '789 Health Blvd, Your City',
        distance: '2.1 mi',
        rating: 4.3,
        isOpen: false,
      },
    ]

    setResources(mockResources.filter((r) => r.type === type))
  }

  useEffect(() => {
    if (location) {
      fetchNearbyResources(location.lat, location.lng, selectedType)
    }
  }, [selectedType, location])

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Find Wellness Resources Near You
        </h2>
        <p className="text-gray-600">
          Discover gyms, parks, health facilities, and more in your area
        </p>
      </div>

      {/* Location Button */}
      <div className="mb-6">
        <Button
          onClick={requestLocation}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Getting location...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Precise Location
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Resource Type Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {resourceTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value as ResourceType)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedType === type.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center text-gray-500">
          {location ? (
            <div className="text-center p-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-lg font-medium text-gray-900">Map View</p>
              <p className="text-sm text-gray-600 mt-1">
                Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                In production, this would display an interactive Google Maps view
              </p>
            </div>
          ) : (
            <div className="text-center p-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-700">Enable Location to See Map</p>
              <p className="text-sm text-gray-500 mt-1">
                Click &quot;Use My Precise Location&quot; to find resources near you
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resources List */}
      {location && resources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Nearby {resourceTypes.find((t) => t.value === selectedType)?.label}
          </h3>
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{resource.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {resource.distance && (
                        <span className="text-sm text-gray-500">📍 {resource.distance}</span>
                      )}
                      {resource.rating && (
                        <span className="text-sm text-gray-500">⭐ {resource.rating}</span>
                      )}
                      {resource.isOpen !== undefined && (
                        <span
                          className={`text-sm font-medium ${
                            resource.isOpen ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {resource.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {location && resources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No {resourceTypes.find((t) => t.value === selectedType)?.label.toLowerCase()} found nearby.</p>
          <p className="text-sm mt-2">Try selecting a different category.</p>
        </div>
      )}
    </Card>
  )
}
