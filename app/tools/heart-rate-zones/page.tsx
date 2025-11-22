'use client'

import { PublicLayout } from '@/components/layouts/public-layout'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SaveResultButton } from '@/components/tools/save-result-button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HeartRateZone {
  name: string
  percentage: [number, number]
  color: string
  description: string
  benefits: string
}

const zones: HeartRateZone[] = [
  {
    name: 'Zone 1: Very Light',
    percentage: [50, 60],
    color: '#93c5fd',
    description: 'Warm-up and recovery',
    benefits: 'Improves overall health and aids recovery',
  },
  {
    name: 'Zone 2: Light',
    percentage: [60, 70],
    color: '#60a5fa',
    description: 'Fat burning and endurance',
    benefits: 'Builds aerobic base and burns fat efficiently',
  },
  {
    name: 'Zone 3: Moderate',
    percentage: [70, 80],
    color: '#3b82f6',
    description: 'Aerobic development',
    benefits: 'Improves cardiovascular efficiency',
  },
  {
    name: 'Zone 4: Hard',
    percentage: [80, 90],
    color: '#f59e0b',
    description: 'Anaerobic threshold',
    benefits: 'Increases performance capacity and speed',
  },
  {
    name: 'Zone 5: Maximum',
    percentage: [90, 100],
    color: '#ef4444',
    description: 'Maximum effort',
    benefits: 'Develops maximum performance and power',
  },
]

export default function HeartRateZones() {
  const [age, setAge] = useState('')
  const [restingHR, setRestingHR] = useState('')
  const [results, setResults] = useState<Array<{ zone: HeartRateZone; range: [number, number] }> | null>(null)

  const calculateZones = () => {
    const ageNum = parseFloat(age)
    const restingNum = parseFloat(restingHR)

    if (!ageNum || !restingNum) {
      return
    }

    // Calculate max heart rate (220 - age)
    const maxHR = 220 - ageNum

    // Calculate heart rate reserve (HRR)
    const hrr = maxHR - restingNum

    // Calculate zones using Karvonen formula
    const calculatedZones = zones.map((zone) => {
      const lowerBound = Math.round(hrr * (zone.percentage[0] / 100) + restingNum)
      const upperBound = Math.round(hrr * (zone.percentage[1] / 100) + restingNum)
      return {
        zone,
        range: [lowerBound, upperBound] as [number, number],
      }
    })

    setResults(calculatedZones)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateZones()
  }

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Link */}
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Heart Rate Zones Calculator</h1>
            <p className="mt-2 text-gray-600">
              Calculate your personalized heart rate training zones
            </p>
          </div>

          {/* Calculator Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Enter your details to calculate your heart rate zones</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      id="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your age"
                      required
                      min="1"
                      max="120"
                    />
                  </div>

                  {/* Resting Heart Rate */}
                  <div>
                    <label htmlFor="restingHR" className="block text-sm font-medium text-gray-700 mb-2">
                      Resting Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      id="restingHR"
                      value={restingHR}
                      onChange={(e) => setRestingHR(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your resting HR"
                      required
                      min="30"
                      max="120"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Measure first thing in the morning before getting out of bed
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Calculate Zones
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <>
              {/* Visual Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Your Heart Rate Zones</CardTitle>
                  <CardDescription>
                    Max HR: {220 - parseFloat(age)} bpm | Resting HR: {restingHR} bpm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.map(({ zone, range }) => (
                      <div key={zone.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: zone.color }}
                            />
                            <span className="font-medium text-gray-900">{zone.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {range[0]} - {range[1]} bpm
                          </span>
                        </div>
                        <div className="relative h-8 bg-gray-100 rounded-md overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-md"
                            style={{
                              width: `${zone.percentage[1] - zone.percentage[0]}%`,
                              backgroundColor: zone.color,
                              opacity: 0.8,
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">{zone.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Zone Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map(({ zone, range }) => (
                  <Card key={zone.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span>{zone.name}</span>
                      </CardTitle>
                      <CardDescription>
                        {range[0]} - {range[1]} bpm ({zone.percentage[0]}-{zone.percentage[1]}% of max HR)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{zone.benefits}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <SaveResultButton
                  toolName="Heart Rate Zones"
                  data={{
                    age,
                    restingHR,
                    maxHR: 220 - parseFloat(age),
                    zones: results.map(({ zone, range }) => ({
                      name: zone.name,
                      range,
                      percentage: zone.percentage,
                    })),
                    timestamp: new Date().toISOString(),
                  }}
                />
              </div>

              {/* Tips */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Training Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Spend most of your training time in Zones 2-3 for building endurance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Use Zone 4-5 sparingly for high-intensity interval training</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Always warm up in Zone 1 before intense exercise</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Use a heart rate monitor for accurate tracking during workouts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {!results && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-12">
                  <p>Enter your information and click Calculate to see your heart rate zones</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
