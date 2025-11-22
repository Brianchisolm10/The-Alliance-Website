import { Suspense } from 'react';
import { PublicLayout } from '@/components/layouts/public-layout';
import { DonationConfirmation } from '@/components/impact/donation-confirmation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const metadata = {
  title: 'Donation Confirmation | AFYA Wellness',
  description: 'Thank you for your donation.',
};

export default function DonationSuccessPage() {
  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={<LoadingSpinner />}>
            <DonationConfirmation />
          </Suspense>
        </div>
      </div>
    </PublicLayout>
  );
}
