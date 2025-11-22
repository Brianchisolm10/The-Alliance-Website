'use client'

import { useEffect, useState } from 'react'

const healthFacts = [
  {
    icon: '💧',
    fact: 'Drinking water first thing in the morning helps kickstart your metabolism and flush out toxins.',
  },
  {
    icon: '🏃',
    fact: 'Just 30 minutes of moderate exercise daily can reduce the risk of chronic diseases by up to 50%.',
  },
  {
    icon: '😴',
    fact: 'Adults need 7-9 hours of quality sleep per night for optimal physical and mental health.',
  },
  {
    icon: '🥗',
    fact: 'Eating a rainbow of colorful fruits and vegetables ensures you get a variety of essential nutrients.',
  },
  {
    icon: '🧘',
    fact: 'Regular meditation and mindfulness practices can reduce stress and improve overall well-being.',
  },
  {
    icon: '💪',
    fact: 'Strength training twice a week helps maintain muscle mass and bone density as you age.',
  },
  {
    icon: '🌞',
    fact: 'Getting 10-15 minutes of sunlight daily helps your body produce vitamin D naturally.',
  },
  {
    icon: '🫀',
    fact: 'Laughing regularly can boost your immune system and improve cardiovascular health.',
  },
  {
    icon: '🥤',
    fact: 'Staying hydrated improves concentration, energy levels, and physical performance.',
  },
  {
    icon: '🚶',
    fact: 'Taking short walking breaks every hour can improve circulation and reduce sedentary health risks.',
  },
  {
    icon: '🍎',
    fact: 'Eating whole foods instead of processed foods can significantly improve your energy and health.',
  },
  {
    icon: '🧠',
    fact: 'Regular physical activity increases blood flow to the brain, improving memory and cognitive function.',
  },
]

export function HealthFactsSidebar() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % healthFacts.length)
        setIsAnimating(false)
      }, 500)
    }, 6000) // Change fact every 6 seconds

    return () => clearInterval(interval)
  }, [])

  const currentFact = healthFacts[currentFactIndex]

  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:w-96 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Did You Know?
          </h3>
          <p className="text-sm text-gray-600">
            Health tips while you sign in
          </p>
        </div>

        <div
          className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-500 ${
            isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          <div className="text-6xl mb-4 text-center">{currentFact.icon}</div>
          <p className="text-gray-700 text-center leading-relaxed">
            {currentFact.fact}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {healthFacts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => {
                  setCurrentFactIndex(index)
                  setIsAnimating(false)
                }, 500)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentFactIndex
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to fact ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-8 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold text-blue-600">AFYA</span> is committed to
            making wellness accessible to everyone, everywhere.
          </p>
        </div>
      </div>
    </div>
  )
}
