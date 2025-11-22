'use client'

import { PublicLayout } from '@/components/layouts/public-layout'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SaveResultButton } from '@/components/tools/save-result-button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra'

const activityLevels = {
  sedentary: { label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  light: { label: 'Light (exercise 1-3 days/week)', multiplier: 1.375 },
  moderate: { label: 'Moderate (exercise 3-5 days/week)', multiplier: 1.55 },
  very: { label: 'Very Active (exercise 6-7 days/week)', multiplier: 1.725 },
  extra: { label: 'Extra Active (very intense exercise daily)', multiplier: 1.9 },
}

export default function BMRTDEECalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate')
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial')
  const [results, setResults] = useState<{ bmr: number; tdee: number } | null>(null)

  const calculateBMR = () => {
    const ageNum = parseFloat(age)
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)

    if (!ageNum || !weightNum || !heightNum) {
      return
    }

    // Convert to metric if needed
    const weightKg = unit === 'imperial' ? weightNum * 0.453592 : weightNum
    const heightCm = unit === 'imperial' ? heightNum * 2.54 : heightNum

    // Mifflin-St Jeor Equation
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161
    }

    const tdee = bmr * activityLevels[activityLevel].multiplier

    setResults({ bmr: Math.round(bmr), tdee: Math.round(tdee) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateBMR()
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
            <h1 className="text-3xl font-bold text-gray-900">BMR/TDEE Calculator</h1>
            <p className="mt-2 text-gray-600">
              Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Enter your details to calculate your energy needs</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Unit Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit System
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setUnit('imperial')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          unit === 'imperial'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Imperial
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit('metric')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          unit === 'metric'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Metric
                      </button>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          gender === 'male'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          gender === 'female'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

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

                  {/* Weight */}
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter your weight in ${unit === 'imperial' ? 'pounds' : 'kilograms'}`}
                      required
                      min="1"
                      step="0.1"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                      Height ({unit === 'imperial' ? 'inches' : 'cm'})
                    </label>
                    <input
                      type="number"
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter your height in ${unit === 'imperial' ? 'inches' : 'centimeters'}`}
                      required
                      min="1"
                      step="0.1"
                    />
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Level
                    </label>
                    <select
                      id="activity"
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(activityLevels).map(([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate
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
                      <CardTitle>Your BMR</CardTitle>
                      <CardDescription>Basal Metabolic Rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600">{results.bmr}</div>
                      <div className="text-sm text-gray-600 mt-2">calories per day</div>
                      <p className="mt-4 text-sm text-gray-700">
                        This is the number of calories your body burns at rest to maintain vital functions.
                      </p>
                      <div className="mt-4 pt-4 border-t">
                        <SaveResultButton
                          toolName="BMR/TDEE Calculator"
                          data={{
                            gender,
                            age,
                            weight,
                            height,
                            unit,
                            activityLevel,
                            bmr: results.bmr,
                            tdee: results.tdee,
                            timestamp: new Date().toISOString(),
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your TDEE</CardTitle>
                      <CardDescription>Total Daily Energy Expenditure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-green-600">{results.tdee}</div>
                      <div className="text-sm text-gray-600 mt-2">calories per day</div>
                      <p className="mt-4 text-sm text-gray-700">
                        This is your total caloric needs including your activity level. Use this to maintain your current weight.
                      </p>
                      <div className="mt-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight Loss (500 cal deficit):</span>
                          <span className="font-semibold">{results.tdee - 500} cal/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight Gain (500 cal surplus):</span>
                          <span className="font-semibold">{results.tdee + 500} cal/day</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500 py-12">
                      <p>Enter your information and click Calculate to see your results</p>
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
