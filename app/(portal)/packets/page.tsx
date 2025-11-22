import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { FileText, Download, Calendar, Eye } from 'lucide-react'

const packetTypeLabels: Record<string, string> = {
  GENERAL: 'General Wellness',
  NUTRITION: 'Nutrition',
  TRAINING: 'Training',
  ATHLETE_PERFORMANCE: 'Athlete Performance',
  YOUTH: 'Youth',
  RECOVERY: 'Recovery',
}

const packetTypeDescriptions: Record<string, string> = {
  GENERAL: 'Comprehensive wellness guidance tailored to your lifestyle',
  NUTRITION: 'Personalized nutrition plan and dietary recommendations',
  TRAINING: 'Custom training program based on your fitness goals',
  ATHLETE_PERFORMANCE: 'Elite-level performance optimization strategies',
  YOUTH: 'Age-appropriate wellness and fitness guidance',
  RECOVERY: 'Injury recovery and rehabilitation protocols',
}

export default async function PacketsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const packets = await prisma.packet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      assessment: {
        select: {
          type: true,
          completed: true,
          createdAt: true,
        },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Health Packets</h1>
        <p className="mt-2 text-gray-600">
          Access and download your personalized wellness packets
        </p>
      </div>

      {packets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {packets.map((packet: any) => (
            <Card key={packet.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-600 p-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {packetTypeLabels[packet.type] || packet.type}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {packetTypeDescriptions[packet.type] || 'Personalized wellness packet'}
                      </CardDescription>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Created {new Date(packet.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        {packet.assessment && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Assessment Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={packet.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Link>
                    <Link
                      href={packet.fileUrl}
                      download
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Packet Type</p>
                    <p className="mt-1 text-gray-600">{packetTypeLabels[packet.type]}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Last Updated</p>
                    <p className="mt-1 text-gray-600">
                      {new Date(packet.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Status</p>
                    <p className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">No packets available yet</h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                Complete an assessment to receive your personalized health packet. Our system will generate
                a comprehensive wellness plan based on your responses.
              </p>
              <div className="mt-8">
                <Link
                  href="/assessments"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Start Your First Assessment
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="rounded-lg bg-blue-600 p-2 h-fit">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">About Your Health Packets</h3>
              <p className="mt-2 text-sm text-gray-700">
                Your health packets are personalized PDF documents generated from your assessment responses.
                Each packet contains tailored recommendations, exercise programs, nutrition guidance, and
                wellness strategies designed specifically for your goals and needs.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Download and save packets for offline access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Share with healthcare providers or trainers as needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>New packets are generated when you complete additional assessments</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
