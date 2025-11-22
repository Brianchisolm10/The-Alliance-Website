'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LibrariesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Content Libraries</h1>
      <p className="text-gray-600 mb-8">
        Manage exercise and nutrition libraries used for packet generation
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/libraries/exercises">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Exercise Library</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Manage exercises with progressions, regressions, and population-specific
                  safety rules
                </p>
                <Button size="sm">Manage Exercises →</Button>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/libraries/nutrition">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Nutrition Library</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Manage nutrition items with macros, allergens, and dietary restrictions
                </p>
                <Button size="sm">Manage Nutrition →</Button>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
