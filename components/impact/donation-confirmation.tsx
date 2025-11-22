'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Heart, Mail, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DonationDetails {
  id: string;
  email: string;
  amount: number;
  allocation: Record<string, number>;
  createdAt: string;
}

export function DonationConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [donation, setDonation] = useState<DonationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    fetchDonationDetails(sessionId);
  }, [sessionId]);

  const fetchDonationDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/donations/session/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch donation details');
      }

      const data = await response.json();
      setDonation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <Heart className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Donation Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'We could not find your donation details.'}
          </p>
          <Button onClick={() => router.push('/impact')}>
            Return to Impact
          </Button>
        </div>
      </Card>
    );
  }

  const allocationEntries = Object.entries(donation.allocation).filter(
    ([_, percentage]) => percentage > 0
  );

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="p-8 text-center bg-green-50 border-green-200">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thank You for Your Donation!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Your generous contribution helps us make wellness accessible to everyone.
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-md">
          <Mail className="h-4 w-4" />
          <span>Tax receipt sent to <strong>{donation.email}</strong></span>
        </div>
      </Card>

      {/* Donation Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Donation Details
        </h2>
        
        <div className="space-y-4">
          {/* Donation ID and Date */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Donation ID:</span>
            <span className="font-mono font-medium">{donation.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date(donation.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Allocation */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Allocation</h3>
            <div className="space-y-3">
              {allocationEntries.map(([area, percentage]) => {
                const amount = (donation.amount * percentage) / 100;
                return (
                  <div key={area} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-medium text-gray-900 capitalize">
                        {area.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(amount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total Donation</span>
              <span>${(donation.amount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tax Information */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Download className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Tax Receipt
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              Your tax-deductible donation receipt has been sent to your email.
              Please keep this for your records. AFYA is a registered nonprofit
              organization, and your donation is tax-deductible to the extent
              allowed by law.
            </p>
            <p className="text-xs text-blue-700">
              Donation ID: {donation.id}
            </p>
          </div>
        </div>
      </Card>

      {/* Impact Message */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Impact
        </h2>
        <p className="text-gray-600 mb-4">
          Your donation of ${(donation.amount / 100).toFixed(2)} will help us:
        </p>
        <ul className="space-y-3 text-gray-600">
          {allocationEntries.map(([area]) => {
            const messages: Record<string, string> = {
              foundations: 'Maintain and improve our platform infrastructure to serve more communities',
              equipment: 'Provide essential fitness equipment to individuals who need it most',
              sponsorship: 'Sponsor wellness journeys for community members with free access to programs',
              general: 'Support our mission where it\'s needed most',
            };
            
            return (
              <li key={area} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{messages[area] || 'Support our wellness mission'}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Stay Connected
        </h2>
        <p className="text-gray-600 mb-4">
          We&apos;ll keep you updated on how your donation is making a difference in our community.
        </p>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Follow us on social media for impact updates</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Receive quarterly impact reports via email</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Join our community events and wellness programs</span>
          </li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push('/impact')}
          variant="outline"
          className="flex-1"
        >
          Learn More About Our Impact
        </Button>
        <Button
          onClick={() => router.push('/')}
          className="flex-1"
        >
          Return to Home
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
