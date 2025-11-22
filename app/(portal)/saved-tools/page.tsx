import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSavedToolResults } from '@/app/actions/tools'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Calculator, 
  Heart, 
  Droplets, 
  Activity,
  Utensils,
  Baby,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

const toolIcons: Record<string, any> = {
  'BMR/TDEE Calculator': Calculator,
  'Heart Rate Zones': Heart,
  'Hydration & Sleep Snapshot': Droplets,
  'Recovery Check-in': Activity,
  'Plate Builder': Utensils,
  'Youth Corner': Baby,
}

const toolLinks: Record<string, string> = {
  'BMR/TDEE Calculator': '/tools/bmr-tdee',
  'Heart Rate Zones': '/tools/heart-rate-zones',
  'Hydration & Sleep Snapshot': '/tools/hydration-sleep',
  'Recovery Check-in': '/tools/recovery-checkin',
  'Plate Builder': '/tools/plate-builder',
  'Youth Corner': '/tools/youth-corner',
}

export default async function SavedToolsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const savedResults = await getSavedToolResults(session.user.id)

  // Group results by tool name
  const groupedResults = savedResults.reduce((acc: any, result: any) => {
    if (!acc[result.toolName]) {
      acc[result.toolName] = []
    }
    acc[result.toolName].push(result)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Tool Results</h1>
          <p className="mt-2 text-gray-600">
            View and manage your saved health tool calculations
          </p>
        </div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Explore Tools
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {savedResults.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([toolName, results]: [string, any]) => {
            const Icon = toolIcons[toolName] || Calculator
            const toolLink = toolLinks[toolName] || '/tools'

            return (
              <div key={toolName}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{toolName}</h2>
                  </div>
                  <Link
                    href={toolLink}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Use tool
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((result: any) => (
                    <Card key={result.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {new Date(result.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </CardTitle>
                        <CardDescription>
                          {new Date(result.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          {toolName === 'BMR/TDEE Calculator' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">BMR:</span>
                                <span className="font-semibold">{result.data.bmr} cal/day</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">TDEE:</span>
                                <span className="font-semibold">{result.data.tdee} cal/day</span>
                              </div>
                              {result.data.activityLevel && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Activity:</span>
                                  <span className="font-semibold capitalize">{result.data.activityLevel}</span>
                                </div>
                              )}
                            </>
                          )}
                          {toolName === 'Heart Rate Zones' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Max HR:</span>
                                <span className="font-semibold">{result.data.maxHR} bpm</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Resting HR:</span>
                                <span className="font-semibold">{result.data.restingHR} bpm</span>
                              </div>
                              {result.data.zones && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-xs text-gray-500 mb-1">Training Zones</p>
                                  {Object.entries(result.data.zones).slice(0, 3).map(([zone, range]: [string, any]) => (
                                    <div key={zone} className="flex justify-between text-xs">
                                      <span className="text-gray-600">{zone}:</span>
                                      <span>{range.min}-{range.max} bpm</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                          {toolName === 'Hydration & Sleep Snapshot' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Hydration Goal:</span>
                                <span className="font-semibold">{result.data.hydrationGoal} oz/day</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sleep Score:</span>
                                <span className="font-semibold">{result.data.sleepScore}/100</span>
                              </div>
                              {result.data.sleepHours && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Sleep Hours:</span>
                                  <span className="font-semibold">{result.data.sleepHours} hrs</span>
                                </div>
                              )}
                            </>
                          )}
                          {toolName === 'Recovery Check-in' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Recovery Score:</span>
                                <span className="font-semibold">{result.data.score}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-semibold capitalize ${
                                  result.data.status === 'excellent' ? 'text-green-600' :
                                  result.data.status === 'good' ? 'text-blue-600' :
                                  result.data.status === 'fair' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {result.data.status}
                                </span>
                              </div>
                              {result.data.recommendation && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-xs text-gray-600">{result.data.recommendation}</p>
                                </div>
                              )}
                            </>
                          )}
                          {toolName === 'Plate Builder' && (
                            <>
                              {result.data.totalCalories && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Calories:</span>
                                  <span className="font-semibold">{result.data.totalCalories} cal</span>
                                </div>
                              )}
                              {result.data.macros && (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Protein:</span>
                                    <span className="font-semibold">{result.data.macros.protein}g</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Carbs:</span>
                                    <span className="font-semibold">{result.data.macros.carbs}g</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Fats:</span>
                                    <span className="font-semibold">{result.data.macros.fats}g</span>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          {toolName === 'Youth Corner' && (
                            <>
                              {result.data.ageGroup && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Age Group:</span>
                                  <span className="font-semibold">{result.data.ageGroup}</span>
                                </div>
                              )}
                              {result.data.activityRecommendation && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-xs text-gray-600">{result.data.activityRecommendation}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <Calculator className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">No saved results yet</h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                Use our health tools and save your results to track your wellness metrics over time.
                All your saved calculations will appear here for easy reference.
              </p>
              <div className="mt-8">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Explore Health Tools
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access to Tools */}
      {savedResults.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Access to Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(toolLinks).map(([toolName, link]) => {
                const Icon = toolIcons[toolName] || Calculator
                return (
                  <Link
                    key={toolName}
                    href={link}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white hover:bg-blue-100 transition-colors text-center"
                  >
                    <Icon className="h-6 w-6 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">{toolName}</span>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
