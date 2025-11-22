'use client'

import { PublicLayout } from '@/components/layouts/public-layout'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SaveResultButton } from '@/components/tools/save-result-button'
import Link from 'next/link'
import { ArrowLeft, Droplets, Moon } from 'lucide-react'

export default function HydrationSleepSnapshot() {
  const [weight, setWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState<'low' | 'moderate' | 'high'>('moderate')
  const [sleepHours, setSleepHours] = useState('')
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good')
  const [results, setResults] = useState<{
    hydration: number
    sleepScore: number
    sleepFeedback: string
  } | null>(null)

  const calculateResults = () => {
    const weightNum = parseFloat(weight)
    const sleepNum = parseFloat(sleepHours)

    if (!weightNum || !sleepNum) {
      return
    }

    // Hydration calculation (oz per day)
    // Base: weight * 0.5, adjusted for activity
    const activityMultiplier = {
      low: 0.5,
      moderate: 0.6,
      high: 0.7,
    }
    const hydrationOz = Math.round(weightNum * activityMultiplier[activityLevel])

    // Sleep score calculation
    const qualityScore = {
      poor: 25,
      fair: 50,
      good: 75,
      excellent: 100,
    }
    
    let sleepScore = qualityScore[sleepQuality]
    
    // Adjust based on hours (optimal 7-9 hours)
    if (sleepNum < 6) {
      sleepScore = Math.max(0, sleepScore - 30)
    } else if (sleepNum < 7) {
      sleepScore = Math.max(0, sleepScore - 15)
    } else if (sleepNum > 9) {
      sleepScore = Math.max(0, sleepScore - 10)
    }

    let sleepFeedback = ''
    if (sleepScore >= 80) {
      sleepFeedback = 'Excellent! Your sleep is supporting optimal recovery and performance.'
    } else if (sleepScore >= 60) {
      sleepFeedback = 'Good sleep habits. Consider small improvements for better recovery.'
    } else if (sleepScore >= 40) {
      sleepFeedback = 'Your sleep could use improvement. Focus on consistency and quality.'
    } else {
      sleepFeedback = 'Your sleep needs attention. Poor sleep impacts health, recovery, and performance.'
    }

    setResults({
      hydration: hydrationOz,
      sleepScore,
      sleepFeedback,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateResults()
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
            <h1 className="text-3xl font-bold text-gray-900">Hydration & Sleep Snapshot</h1>
            <p className="mt-2 text-gray-600">
              Track your hydration needs and sleep quality for optimal recovery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Enter your details to get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Weight */}
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      Body Weight (lbs)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your weight"
                      required
                      min="1"
                      step="0.1"
                    />
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Level
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'low', label: 'Low (minimal exercise)' },
                        { value: 'moderate', label: 'Moderate (regular exercise)' },
                        { value: 'high', label: 'High (intense daily training)' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="activity"
                            value={option.value}
                            checked={activityLevel === option.value}
                            onChange={(e) => setActivityLevel(e.target.value as any)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sleep Hours */}
                  <div>
                    <label htmlFor="sleep" className="block text-sm font-medium text-gray-700 mb-2">
                      Average Sleep (hours per night)
                    </label>
                    <input
                      type="number"
                      id="sleep"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter hours of sleep"
                      required
                      min="0"
                      max="24"
                      step="0.5"
                    />
                  </div>

                  {/* Sleep Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Quality
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'poor', label: 'Poor (restless, frequent waking)' },
                        { value: 'fair', label: 'Fair (some interruptions)' },
                        { value: 'good', label: 'Good (mostly restful)' },
                        { value: 'excellent', label: 'Excellent (deep, uninterrupted)' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            value={option.value}
                            checked={sleepQuality === option.value}
                            onChange={(e) => setSleepQuality(e.target.value as any)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Get Recommendations
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  {/* Hydration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span>Daily Hydration Goal</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600">{results.hydration} oz</div>
                      <div className="text-sm text-gray-600 mt-2">
                        ({Math.round(results.hydration / 8)} cups per day)
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-gray-700">
                        <p className="font-medium">Tips for staying hydrated:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Start your day with a glass of water</li>
                          <li>• Drink water before, during, and after exercise</li>
                          <li>• Keep a water bottle with you throughout the day</li>
                          <li>• Increase intake in hot weather or during illness</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sleep */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Moon className="h-5 w-5 text-indigo-500" />
                        <span>Sleep Score</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end space-x-2">
                        <div className="text-4xl font-bold text-indigo-600">{results.sleepScore}</div>
                        <div className="text-gray-600 pb-1">/100</div>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${results.sleepScore}%` }}
                          />
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-700">{results.sleepFeedback}</p>
                      <div className="mt-4 space-y-2 text-sm text-gray-700">
                        <p className="font-medium">Sleep optimization tips:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Aim for 7-9 hours per night</li>
                          <li>• Maintain a consistent sleep schedule</li>
                          <li>• Create a dark, cool sleeping environment</li>
                          <li>• Avoid screens 1 hour before bed</li>
                          <li>• Limit caffeine after 2 PM</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-center">
                    <SaveResultButton
                      toolName="Hydration & Sleep Snapshot"
                      data={{
                        weight,
                        activityLevel,
                        sleepHours,
                        sleepQuality,
                        hydrationGoal: results.hydration,
                        sleepScore: results.sleepScore,
                        timestamp: new Date().toISOString(),
                      }}
                    />
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500 py-12">
                      <p>Enter your information to get personalized hydration and sleep recommendations</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
