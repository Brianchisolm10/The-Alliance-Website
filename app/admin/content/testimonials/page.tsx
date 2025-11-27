import { Suspense } from 'react';
import { getTestimonials } from '@/app/actions/content-management';
import { TestimonialManagementClient } from './testimonial-management-client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const metadata = {
  title: 'Testimonial Management | AFYA Admin',
  description: 'Manage client testimonials',
};

export default async function TestimonialManagementPage() {
  const result = await getTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonial Management</h1>
          <p className="text-gray-600 mt-1">
            Review and manage client testimonials
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <TestimonialManagementClient 
          initialTestimonials={result.success && result.testimonials ? result.testimonials : []} 
        />
      </Suspense>
    </div>
  );
}
