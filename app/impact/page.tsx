import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Package, Users, Award } from 'lucide-react';

const impactAreas = [
  {
    id: 'foundations',
    name: 'Foundations',
    icon: Heart,
    description: 'Support the core infrastructure that makes AFYA possible. Your contribution helps maintain our platform, develop new features, and ensure free access to underserved communities.',
    metrics: {
      served: '24+ clients',
      goal: '100 by Q3 2025',
    },
  },
  {
    id: 'equipment',
    name: 'Equipment',
    icon: Package,
    description: 'Help us provide essential fitness equipment to individuals and communities who need it most. From resistance bands to weights, your support makes wellness accessible.',
    metrics: {
      distributed: '50+ items',
      communities: '5+ states',
    },
  },
  {
    id: 'gear-drive',
    name: 'Gear Drive',
    icon: Users,
    description: 'Donate gently used athletic gear, equipment, and wellness items. Your physical donations directly support community members starting their wellness journey.',
    metrics: {
      collected: '100+ items',
      redistributed: '85%',
    },
  },
  {
    id: 'sponsorship',
    name: 'Sponsorship',
    icon: Award,
    description: 'Sponsor a community member\'s wellness journey. Your contribution provides free access to personalized programs, assessments, and ongoing support.',
    metrics: {
      sponsored: '12 clients',
      impact: '100% free access',
    },
  },
];

const socialCommitments = [
  {
    title: 'Free Access',
    description: 'Providing elite-level wellness resources to underserved communities at no cost',
  },
  {
    title: 'Transparent Operations',
    description: 'Clear communication about how donations are utilized and impact achieved',
  },
  {
    title: 'Inclusive Design',
    description: 'Programs designed for all ages, abilities, and backgrounds',
  },
  {
    title: 'Multilingual Adaptability',
    description: 'Working towards accessible content for diverse communities',
  },
];

const esgPrinciples = [
  {
    category: 'Environmental',
    items: ['Digital-first approach reducing paper waste', 'Sustainable equipment recommendations'],
  },
  {
    category: 'Social',
    items: ['Health equity focus', 'Community-driven programs', 'Free tier access'],
  },
  {
    category: 'Governance',
    items: ['Transparent operations', 'Data privacy protection', 'Ethical AI usage'],
  },
];

export default function ImpactPage() {
  return (
    <PublicLayout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Make an Impact
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Join us in making elite-level wellness accessible to everyone
            </p>
            <p className="text-lg opacity-90">
              Every contribution helps us bridge health inequities and empower communities
              with science-backed fitness and nutrition education.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Four Ways to Contribute</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose how you want to support AFYA&apos;s mission. Each area addresses
              specific needs in our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {impactAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card key={area.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{area.name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{area.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Object.entries(area.metrics).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-gray-500 capitalize">{key}</div>
                          <div className="font-semibold text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {area.id === 'gear-drive' ? (
                    <Link href="/impact/gear-drive">
                      <Button className="w-full">Donate Gear</Button>
                    </Link>
                  ) : (
                    <Link href={`/impact/donate?area=${area.id}`}>
                      <Button className="w-full">Contribute</Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Commitment */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Social Commitment
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {socialCommitments.map((commitment) => (
                <Card key={commitment.title} className="p-6">
                  <h3 className="text-lg font-bold mb-2">{commitment.title}</h3>
                  <p className="text-gray-600">{commitment.description}</p>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">
                AFYA aligns with UN Sustainable Development Goals:
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                  SDG 3: Good Health and Well-Being
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                  SDG 4: Quality Education
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-semibold">
                  SDG 10: Reduced Inequalities
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESG Principles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              ESG Principles
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {esgPrinciples.map((principle) => (
                <Card key={principle.category} className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-600">
                    {principle.category}
                  </h3>
                  <ul className="space-y-2">
                    {principle.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your support helps us continue providing free, science-backed wellness
            resources to communities that need them most.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/impact/donate">
              <Button size="lg">
                Make a Donation
              </Button>
            </Link>
            <Link href="/impact/gear-drive">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Donate Gear
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </PublicLayout>
  );
}
