import { Metadata } from 'next'
import { PublicLayout } from '@/components/layouts/public-layout'
import { ContactInfo } from '@/components/contact/contact-info'
import { ContactForm } from '@/components/contact/contact-form'
import { WellnessResourcesMap } from '@/components/contact/wellness-resources-map'
import { PartnershipsSection } from '@/components/contact/partnerships-section'

export const metadata: Metadata = {
  title: 'Contact Us | AFYA Wellness',
  description: 'Get in touch with AFYA Wellness. Find our contact information, social media, partnership opportunities, and nearby wellness resources.',
}

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              We're here to support your wellness journey. Reach out to us or find wellness resources near you.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Information */}
            <ContactInfo />

            {/* Contact Form */}
            <ContactForm />
          </div>

          {/* Partnerships Section */}
          <div className="mb-16">
            <PartnershipsSection />
          </div>

          {/* Wellness Resources Map */}
          <WellnessResourcesMap />
        </div>
      </div>
    </PublicLayout>
  )
}
