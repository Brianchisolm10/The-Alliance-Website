import Link from 'next/link';
import { PublicLayout } from '@/components/layouts/public-layout';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Gear Drive Confirmation | AFYA Wellness',
  description: 'Thank you for your gear donation.',
};

export default function GearDriveSuccessPage() {
  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            {/* Success Header */}
            <Card className="p-8 text-center bg-green-50 border-green-200">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Thank You for Your Donation!
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Your gear donation submission has been received successfully.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-md">
                <Mail className="h-4 w-4" />
                <span>Confirmation email sent</span>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What Happens Next?
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Our team will review your donation within 2-3 business days
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    We&apos;ll contact you via email to coordinate pickup or dropoff
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Your donated items will be distributed to community members in need
                  </span>
                </li>
              </ul>
            </Card>

            {/* Impact Message */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Package className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Your Impact
                  </h3>
                  <p className="text-blue-800">
                    Your donated gear will help community members start or continue their
                    wellness journey. By providing equipment to those who need it most,
                    you&apos;re making fitness and wellness more accessible to everyone.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Questions?
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about your donation or need to make changes,
                please don&apos;t hesitate to reach out.
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-5 w-5" />
                <a
                  href="mailto:afya@theafya.org"
                  className="text-blue-600 hover:underline"
                >
                  afya@theafya.org
                </a>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/impact" className="flex-1">
                <Button variant="outline" className="w-full">
                  Learn More About Our Impact
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  Return to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
