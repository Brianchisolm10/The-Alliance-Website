'use client'

import { PublicLayout } from '@/components/layouts/public-layout'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Users, Activity, Apple, Brain } from 'lucide-react'

interface AgeGroup {
  range: string
  sleepHours: string
  activityMinutes: string
  screenTime: string
  nutritionTips: string[]
  activityIdeas: string[]
}

const ageGroups: Record<string, AgeGroup> = {
  '6-12': {
    range: '6-12 years',
    sleepHours: '9-12 hours',
    activityMinutes: '60+ minutes daily',
    screenTime: 'Max 2 hours recreational',
    nutritionTips: [
      'Focus on whole foods: fruits, vegetables, whole grains',
      'Limit sugary drinks and snacks',
      'Eat breakfast every day',
      'Include protein with each meal',
      'Stay hydrated with water',
    ],
    activityIdeas: [
      'Team sports (soccer, basketball, baseball)',
      'Swimming and water activities',
      'Bike riding',
      'Playground activities',
      'Dance or martial arts classes',
      'Active games (tag, hide and seek)',
    ],
  },
  '13-17': {
    range: '13-17 years',
    sleepHours: '8-10 hours',
    activityMinutes: '60+ minutes daily',
    screenTime: 'Max 2 hours recreational',
    nutritionTips: [
      'Eat balanced meals with protein, carbs, and healthy fats',
      'Don\'t skip meals, especially breakfast',
      'Choose nutrient-dense snacks',
      'Stay hydrated during sports and activities',
      'Limit processed foods and fast food',
      'Fuel properly before and after workouts',
    ],
    activityIdeas: [
      'Organized sports and athletics',
      'Strength training (with proper guidance)',
      'Running or jogging',
      'Yoga or Pilates',
      'Hiking or outdoor adventures',
      'Group fitness classes',
    ],
  },
}

export default function YouthCorner() {
  const [selectedAge, setSelectedAge] = useState<'6-12' | '13-17'>('13-17')
  const ageGroup = ageGroups[selectedAge]

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
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
            <h1 className="text-3xl font-bold text-gray-900">Youth Corner</h1>
            <p className="mt-2 text-gray-600">
              Age-appropriate health and fitness guidance for young athletes
            </p>
          </div>

          {/* Age Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Age Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedAge('6-12')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    selectedAge === '6-12'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ages 6-12
                </button>
                <button
                  onClick={() => setSelectedAge('13-17')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    selectedAge === '13-17'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ages 13-17
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sleep */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Brain className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span>Sleep Needs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600 mb-2">{ageGroup.sleepHours}</div>
                <p className="text-sm text-gray-700">
                  Quality sleep is essential for growth, learning, and athletic performance. Maintain a consistent bedtime routine.
                </p>
              </CardContent>
            </Card>

            {/* Physical Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Physical Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">{ageGroup.activityMinutes}</div>
                <p className="text-sm text-gray-700">
                  Include a mix of aerobic activities, muscle strengthening, and bone strengthening exercises.
                </p>
              </CardContent>
            </Card>

            {/* Screen Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <span>Screen Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 mb-2">{ageGroup.screenTime}</div>
                <p className="text-sm text-gray-700">
                  Limit recreational screen time. Encourage outdoor play and face-to-face social interaction.
                </p>
              </CardContent>
            </Card>

            {/* Nutrition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Apple className="h-5 w-5 text-red-600" />
                  </div>
                  <span>Nutrition Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-2">Balanced Diet</div>
                <p className="text-sm text-gray-700">
                  Growing bodies need proper nutrition. Focus on variety, balance, and moderation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {/* Nutrition Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Tips for Ages {ageGroup.range}</CardTitle>
                <CardDescription>Building healthy eating habits for life</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {ageGroup.nutritionTips.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="mr-2 text-green-600 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Activity Ideas */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Ideas</CardTitle>
                <CardDescription>Fun ways to stay active and healthy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ageGroup.activityIdeas.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg text-sm text-gray-700"
                    >
                      <Activity className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Safety First</CardTitle>
                <CardDescription>Important reminders for young athletes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Always warm up before exercise and cool down after</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Use proper equipment and protective gear for sports</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Stay hydrated before, during, and after physical activity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Listen to your body and rest when needed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Tell an adult if you experience pain or injury</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Avoid specializing in one sport too early - variety is important</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
