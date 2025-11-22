import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create super admin user
  const hashedPassword = await hash('admin123', 12)
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@theafya.org' },
    update: {},
    create: {
      email: 'admin@theafya.org',
      name: 'AFYA Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Created super admin:', superAdmin.email)

  // Create sample impact areas
  const impactAreas = [
    {
      name: 'Foundations',
      description: 'Supporting the foundational infrastructure and operations of AFYA wellness programs.',
      metrics: {
        totalFunded: 0,
        programsSupported: 0,
      },
    },
    {
      name: 'Equipment',
      description: 'Providing essential fitness and wellness equipment to underserved communities.',
      metrics: {
        totalFunded: 0,
        itemsDonated: 0,
      },
    },
    {
      name: 'Gear Drive',
      description: 'Collecting and distributing athletic gear to youth and community members in need.',
      metrics: {
        totalFunded: 0,
        itemsCollected: 0,
      },
    },
    {
      name: 'Sponsorship',
      description: 'Sponsoring individuals and groups to access premium wellness programs and services.',
      metrics: {
        totalFunded: 0,
        peopleSponsored: 0,
      },
    },
  ]

  for (const area of impactAreas) {
    await prisma.impactArea.upsert({
      where: { name: area.name },
      update: {},
      create: area,
    })
  }

  console.log('✅ Created impact areas')

  // Create sample programs
  const programs = [
    {
      name: 'Foundations Program',
      description: 'A comprehensive wellness program covering nutrition, fitness, and lifestyle fundamentals.',
      type: 'WELLNESS' as const,
      intensity: 'BEGINNER' as const,
      duration: '8 weeks',
      published: true,
      featured: true,
    },
    {
      name: 'Youth Athlete Development',
      description: 'Specialized training program for young athletes focusing on proper form, injury prevention, and performance.',
      type: 'YOUTH' as const,
      intensity: 'INTERMEDIATE' as const,
      duration: '12 weeks',
      published: true,
      featured: true,
    },
    {
      name: 'Nutrition Mastery',
      description: 'Deep dive into evidence-based nutrition strategies for optimal health and performance.',
      type: 'NUTRITION' as const,
      intensity: 'INTERMEDIATE' as const,
      duration: '6 weeks',
      published: true,
      featured: false,
    },
  ]

  for (const program of programs) {
    await prisma.program.create({
      data: program,
    })
  }

  console.log('✅ Created sample programs')

  // Create sample testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      content: 'AFYA transformed my approach to wellness. The personalized guidance and science-backed programs made all the difference.',
      published: true,
      featured: true,
    },
    {
      name: 'Marcus Williams',
      content: 'As a youth athlete, the training program helped me improve my performance while staying injury-free. Highly recommend!',
      published: true,
      featured: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    })
  }

  console.log('✅ Created sample testimonials')

  // Create sample products
  const products = [
    {
      name: 'Premium Resistance Bands Set',
      description: 'Professional-grade resistance bands with 5 different resistance levels. Perfect for strength training, rehabilitation, and mobility work.',
      price: 2999, // $29.99
      inventory: 50,
      published: true,
    },
    {
      name: 'AFYA Wellness Journal',
      description: 'Track your fitness journey, nutrition, and wellness goals with our comprehensive guided journal.',
      price: 1499, // $14.99
      inventory: 100,
      published: true,
    },
    {
      name: 'Foam Roller - High Density',
      description: 'High-density foam roller for deep tissue massage and muscle recovery. Essential for post-workout recovery.',
      price: 3499, // $34.99
      inventory: 30,
      published: true,
    },
    {
      name: 'Nutrition Guide Bundle',
      description: 'Complete nutrition guide with meal plans, recipes, and shopping lists for optimal health.',
      price: 4999, // $49.99
      inventory: 75,
      published: true,
    },
    {
      name: 'AFYA Water Bottle - 32oz',
      description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours. Stay hydrated in style.',
      price: 2499, // $24.99
      inventory: 60,
      published: true,
    },
    {
      name: 'Yoga Mat - Eco-Friendly',
      description: 'Premium eco-friendly yoga mat with excellent grip and cushioning. Perfect for yoga, pilates, and stretching.',
      price: 3999, // $39.99
      inventory: 40,
      published: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Created sample products')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
