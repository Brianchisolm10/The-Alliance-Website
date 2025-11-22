'use client'

import { PublicLayout } from '@/components/layouts/public-layout'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type FoodCategory = 'protein' | 'vegetables' | 'carbs' | 'fats'

interface PlateSection {
  category: FoodCategory
  percentage: number
  color: string
  label: string
  examples: string[]
}

const plateSections: PlateSection[] = [
  {
    category: 'protein',
    percentage: 25,
    color: '#ef4444',
    label: 'Protein',
    examples: ['Chicken', 'Fish', 'Tofu', 'Eggs', 'Lean beef', 'Legumes'],
  },
  {
    category: 'vegetables',
    percentage: 40,
    color: '#22c55e',
    label: 'Vegetables',
    examples: ['Broccoli', 'Spinach', 'Carrots', 'Bell peppers', 'Tomatoes', 'Kale'],
  },
  {
    category: 'carbs',
    percentage: 25,
    color: '#f59e0b',
    label: 'Carbohydrates',
    examples: ['Brown rice', 'Quinoa', 'Sweet potato', 'Whole grain bread', 'Oats', 'Pasta'],
  },
  {
    category: 'fats',
    percentage: 10,
    color: '#8b5cf6',
    label: 'Healthy Fats',
    examples: ['Avocado', 'Nuts', 'Olive oil', 'Seeds', 'Nut butter'],
  },
]

export default function PlateBuilder() {
  const [selectedFoods, setSelectedFoods] = useState<Record<FoodCategory, string[]>>({
    protein: [],
    vegetables: [],
    carbs: [],
    fats: [],
  })

  const toggleFood = (category: FoodCategory, food: string) => {
    setSelectedFoods((prev) => {
      const current = prev[category]
      if (current.includes(food)) {
        return { ...prev, [category]: current.filter((f) => f !== food) }
      } else {
        return { ...prev, [category]: [...current, food] }
      }
    })
  }

  const getTotalCalories = () => {
    // Rough estimates per serving
    const calorieEstimates = {
      protein: 150,
      vegetables: 50,
      carbs: 150,
      fats: 100,
    }

    return Object.entries(selectedFoods).reduce((total, [category, foods]) => {
      return total + foods.length * calorieEstimates[category as FoodCategory]
    }, 0)
  }

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
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
            <h1 className="text-3xl font-bold text-gray-900">Plate Builder</h1>
            <p className="mt-2 text-gray-600">
              Build a balanced meal with visual portion guidance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plate Visualization */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Plate</CardTitle>
                  <CardDescription>Visual representation of a balanced meal</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Circular Plate */}
                  <div className="relative w-full aspect-square max-w-md mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Plate background */}
                      <circle cx="100" cy="100" r="95" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
                      
                      {/* Vegetables (40% - top half) */}
                      <path
                        d="M 100 5 A 95 95 0 0 1 195 100 L 100 100 Z"
                        fill={plateSections[1].color}
                        opacity="0.8"
                      />
                      
                      {/* Protein (25% - bottom left) */}
                      <path
                        d="M 100 100 L 5 100 A 95 95 0 0 0 100 195 Z"
                        fill={plateSections[0].color}
                        opacity="0.8"
                      />
                      
                      {/* Carbs (25% - bottom right) */}
                      <path
                        d="M 100 100 L 100 195 A 95 95 0 0 0 195 100 Z"
                        fill={plateSections[2].color}
                        opacity="0.8"
                      />
                      
                      {/* Fats (10% - small circle on top) */}
                      <circle cx="100" cy="50" r="20" fill={plateSections[3].color} opacity="0.8" />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="mt-6 space-y-2">
                    {plateSections.map((section) => (
                      <div key={section.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: section.color }}
                          />
                          <span className="text-sm font-medium text-gray-700">{section.label}</span>
                        </div>
                        <span className="text-sm text-gray-600">{section.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Meal Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600">Estimated Calories</div>
                      <div className="text-3xl font-bold text-blue-600">{getTotalCalories()}</div>
                    </div>
                    
                    {Object.entries(selectedFoods).map(([category, foods]) => {
                      if (foods.length === 0) return null
                      const section = plateSections.find((s) => s.category === category)
                      return (
                        <div key={category}>
                          <div className="text-sm font-medium text-gray-700">{section?.label}</div>
                          <div className="text-sm text-gray-600">{foods.join(', ')}</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Food Selection */}
            <div className="space-y-6">
              {plateSections.map((section) => (
                <Card key={section.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: section.color }}
                      />
                      <span>{section.label}</span>
                    </CardTitle>
                    <CardDescription>{section.percentage}% of your plate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {section.examples.map((food) => (
                        <button
                          key={food}
                          onClick={() => toggleFood(section.category, food)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedFoods[section.category].includes(food)
                              ? 'text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={{
                            backgroundColor: selectedFoods[section.category].includes(food)
                              ? section.color
                              : undefined,
                          }}
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Portion Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Protein:</strong> About the size of your palm (3-4 oz)
                </div>
                <div>
                  <strong>Vegetables:</strong> Fill half your plate with colorful veggies
                </div>
                <div>
                  <strong>Carbohydrates:</strong> About the size of your fist (1 cup)
                </div>
                <div>
                  <strong>Healthy Fats:</strong> About the size of your thumb (1-2 tbsp)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}
