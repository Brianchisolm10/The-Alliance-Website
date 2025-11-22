'use client'

import * as React from 'react'

interface CommunityStatsProps {
  membersServed: number
  programsOffered: number
}

const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({
  end,
  duration = 2000,
  suffix = '',
}) => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t)
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuad(progress))

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export const CommunityStats: React.FC<CommunityStatsProps> = ({ membersServed, programsOffered }) => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Growing Community
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands on their wellness journey
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-16">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 sm:text-6xl">
              <AnimatedCounter end={membersServed} suffix="+" />
            </div>
            <p className="mt-4 text-xl font-medium text-gray-900">Members Served</p>
            <p className="mt-2 text-sm text-gray-600">
              Community members on their path to wellness
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 sm:text-6xl">
              <AnimatedCounter end={programsOffered} suffix="+" />
            </div>
            <p className="mt-4 text-xl font-medium text-gray-900">Programs Offered</p>
            <p className="mt-2 text-sm text-gray-600">
              Science-backed programs tailored to your needs
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
