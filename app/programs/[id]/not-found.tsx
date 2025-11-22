import Link from 'next/link'
import { PublicLayout } from '@/components/layouts/public-layout'
import { Button } from '@/components/ui/button'

export default function ProgramNotFound() {
  return (
    <PublicLayout>
      <div className="bg-white min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Program Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the program you&apos;re looking for.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/programs">
              <Button>Browse All Programs</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
