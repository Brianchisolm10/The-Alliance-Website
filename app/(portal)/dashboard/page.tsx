import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDashboardData } from '@/app/actions/dashboard'
import { populationQueries } from '@/lib/db/queries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PopulationInfo } from '@/components/portal/population-info'
import Link from 'next/link'
import { 
  FileText, 
  Calculator, 
  Heart, 
  Droplets, 
  Activity,
  ClipboardList,
  TrendingUp,
  Bell,
  Download,
  ArrowRight
} from 'lucide-react'

const toolIcons: Record<string, any> = {
  'BMR/TDEE Calculator': Calculator,
  'Heart Rate Zones': Heart,
  'Hydration & Sleep Snapshot': Droplets,
  'Recovery Check-in': Activity,
}

const packetTypeLabels: Record<string, string> = {
  GENERAL: 'General Wellness',
  NUTRITION: 'Nutrition',
  TRAINING: 'Training',
  ATHLETE_PERFORMANCE: 'Athlete Performance',
  YOUTH: 'Youth',
  RECOVERY: 'Recovery',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const dashboardData = await getDashboardData()

  if (!dashboardData) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-4 text-gray-600">Unable to load dashboard data.</p>
      </div>
    )
  }

  const { packets, savedToolResults, stats } = dashboardData

  // Get user population info
  const user = await populationQueries.getUserWithPopulation(session.user.id)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name || 'there'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here&apos;s an overview of your wellness journey
        </p>
      </div>

      {/* Population Info */}
      {user?.population && (
        <PopulationInfo population={user.population} showDetails={true} />
      )}

      {/* Progress Tracking Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAssessments}/{stats.assessments}</div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Packets</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.packets}</div>
            <p className="text-xs text-gray-500">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Tools</CardTitle>
            <Calculator className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedTools}</div>
            <p className="text-xs text-gray-500">Results saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.assessments > 0 
                ? Math.round((stats.completedAssessments / stats.assessments) * 100)
                : 0}%
            </div>
            <p className="text-xs text-gray-500">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Health Packets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Health Packets</h2>
          <Link
            href="/packets"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {packets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {packets.map((packet: any) => (
              <Card key={packet.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        {packetTypeLabels[packet.type] || packet.type}
                      </CardTitle>
                      <CardDescription>
                        Created {new Date(packet.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </CardDescription>
                    </div>
                    <Link
                      href={packet.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
                      aria-label="Download packet"
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Your personalized {packetTypeLabels[packet.type]?.toLowerCase() || 'wellness'} packet
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No packets yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Complete an assessment to receive your personalized health packet
                </p>
                <Link
                  href="/assessments"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Start Assessment
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Saved Tool Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Tool Results</h2>
          <Link
            href="/tools"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Explore tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {savedToolResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {savedToolResults.map((result: any) => {
              const Icon = toolIcons[result.toolName] || Calculator
              return (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="truncate">{result.toolName}</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(result.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700">
                      {result.toolName === 'BMR/TDEE Calculator' && (
                        <div className="space-y-1">
                          <div>BMR: <span className="font-semibold">{result.data.bmr}</span></div>
                          <div>TDEE: <span className="font-semibold">{result.data.tdee}</span></div>
                        </div>
                      )}
                      {result.toolName === 'Heart Rate Zones' && (
                        <div className="space-y-1">
                          <div>Max: <span className="font-semibold">{result.data.maxHR} bpm</span></div>
                          <div>Rest: <span className="font-semibold">{result.data.restingHR} bpm</span></div>
                        </div>
                      )}
                      {result.toolName === 'Hydration & Sleep Snapshot' && (
                        <div className="space-y-1">
                          <div>Water: <span className="font-semibold">{result.data.hydrationGoal} oz</span></div>
                          <div>Sleep: <span className="font-semibold">{result.data.sleepScore}/100</span></div>
                        </div>
                      )}
                      {result.toolName === 'Recovery Check-in' && (
                        <div className="space-y-1">
                          <div>Score: <span className="font-semibold">{result.data.score}%</span></div>
                          <div className="capitalize">{result.data.status}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calculator className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No saved results</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Use our health tools and save your results for future reference
                </p>
                <Link
                  href="/tools"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Explore Health Tools
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notifications Center */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Welcome to AFYA Portal</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Start your wellness journey by completing assessments and exploring our health tools.
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
