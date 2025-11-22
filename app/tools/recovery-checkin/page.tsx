'use client'

import { PublicLayout } from '@/components/layouts/public-layout'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SaveResultButton } from '@/components/tools/save-result-button'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface RecoveryMetric {
  label: string
  description: string
}

const metrics: Record<string, RecoveryMetric> = {
  soreness: {
    label: 'Muscle Soreness',
    description: 'How sore are your muscles?',
  },
  energy: {
    label: 'Energy Level',
    description: 'How energetic do you feel?',
  },
  sleep: {
    label: 'Sleep Quality',
    description: 'How well did you sleep last night?',
  },
  mood: {
    label: 'Mood',
    description: 'How is your overall mood?',
  },
  stress: {
    label: 'Stress Level',
    description: 'How stressed do you feel?',
  },
}

export default function RecoveryCheckin() {
  const [responses, setResponses] = useState<Record<string, number>>({
    soreness: 3,
    energy: 3,
    sleep: 3,
    mood: 3,
    stress: 3,
  })
  const [results, setResults] = useState<{
    score: number
    status: 'poor' | 'fair' | 'good' | 'excellent'
    recommendations: string[]
  } | null>(null)

  const handleSliderChange = (metric: string, value: number) => {
    setResponses((prev) => ({ ...prev, [metric]: value }))
  }

  const calculateRecovery = () => {
    // Calculate average score (invert stress and soreness as lower is better)
    const invertedStress = 6 - responses.stress
    const invertedSoreness = 6 - responses.soreness
    
    const totalScore = (
      invertedSoreness +
      responses.energy +
      responses.sleep +
      responses.mood +
      invertedStress
    ) / 5

    const percentage = Math.round((totalScore / 5) * 100)

    let status: 'poor' | 'fair' | 'good' | 'excellent'
    let recommendations: string[] = []

    if (percentage >= 80) {
      status = 'excellent'
      recommendations = [
        'Your recovery is excellent! You\'re ready for high-intensity training.',
        'Maintain your current sleep and nutrition habits.',
        'Consider a challenging workout today.',
      ]
    } else if (percentage >= 60) {
      status = 'good'
      recommendations = [
        'Good recovery status. You can train at moderate to high intensity.',
        'Focus on proper nutrition and hydration today.',
        'Ensure you get quality sleep tonight.',
      ]
    } else if (percentage >= 40) {
      status = 'fair'
      recommendations = [
        'Your recovery is fair. Consider a lighter training day.',
        'Prioritize sleep and stress management.',
        'Include active recovery activities like walking or yoga.',
        'Stay well-hydrated and eat nutrient-dense foods.',
      ]
    } else {
      status = 'poor'
      recommendations = [
        'Your recovery is poor. Take a rest day or do very light activity only.',
        'Focus on sleep - aim for 8-9 hours tonight.',
        'Practice stress-reduction techniques (meditation, deep breathing).',
        'Ensure proper nutrition and hydration.',
        'Consider gentle stretching or foam rolling.',
      ]
    }

    // Add specific recommendations based on individual metrics
    if (responses.soreness >= 4) {
      recommendations.push('High soreness detected. Consider massage, foam rolling, or ice bath.')
    }
    if (responses.energy <= 2) {
      recommendations.push('Low energy. Check your nutrition and consider a rest day.')
    }
    if (responses.sleep <= 2) {
      recommendations.push('Poor sleep quality. Prioritize sleep hygiene and earlier bedtime.')
    }
    if (responses.stress >= 4) {
      recommendations.push('High stress levels. Practice relaxation techniques and reduce training volume.')
    }

    setResults({ score: percentage, status, recommendations })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateRecovery()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'good':
        return <CheckCircle className="h-8 w-8 text-blue-600" />
      case 'fair':
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />
      case 'poor':
        return <AlertCircle className="h-8 w-8 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Recovery Check-in</h1>
            <p className="mt-2 text-gray-600">
              Assess your recovery status and get personalized training recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assessment Form */}
            <Card>
              <CardHeader>
                <CardTitle>How Are You Feeling?</CardTitle>
                <CardDescription>Rate each metric on a scale of 1-5</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {Object.entries(metrics).map(([key, metric]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {metric.label}
                      </label>
                      <p className="text-xs text-gray-500 mb-3">{metric.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-500 w-12">
                          {key === 'soreness' || key === 'stress' ? 'Low' : 'Poor'}
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={responses[key]}
                          onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 w-12 text-right">
                          {key === 'soreness' || key === 'stress' ? 'High' : 'Great'}
                        </span>
                      </div>
                      <div className="flex justify-center mt-2">
                        <span className="text-sm font-semibold text-blue-600">{responses[key]}</span>
                      </div>
                    </div>
                  ))}

                  <Button type="submit" className="w-full">
                    Check Recovery Status
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recovery Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-4xl font-bold text-gray-900">{results.score}%</div>
                          <div className={`text-lg font-semibold capitalize ${getStatusColor(results.status)}`}>
                            {results.status}
                          </div>
                        </div>
                        {getStatusIcon(results.status)}
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            results.status === 'excellent'
                              ? 'bg-green-600'
                              : results.status === 'good'
                              ? 'bg-blue-600'
                              : results.status === 'fair'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${results.score}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                      <CardDescription>Personalized guidance based on your recovery status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {results.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <span className="mr-2 text-blue-600 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recovery Strategies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="font-medium">General recovery tips:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Prioritize 7-9 hours of quality sleep</li>
                          <li>• Stay hydrated throughout the day</li>
                          <li>• Eat nutrient-dense, anti-inflammatory foods</li>
                          <li>• Include active recovery (walking, swimming, yoga)</li>
                          <li>• Practice stress management techniques</li>
                          <li>• Consider massage or foam rolling</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-center">
                    <SaveResultButton
                      toolName="Recovery Check-in"
                      data={{
                        responses,
                        score: results.score,
                        status: results.status,
                        timestamp: new Date().toISOString(),
                      }}
                    />
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500 py-12">
                      <p>Complete the assessment to see your recovery status and recommendations</p>
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
