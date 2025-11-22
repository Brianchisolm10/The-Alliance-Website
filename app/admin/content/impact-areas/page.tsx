import { Suspense } from 'react';
import { getImpactAreas } from '@/app/actions/content-management';
import { ImpactAreaManagementClient } from './impact-area-management-client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const metadata = {
  title: 'Impact Area Management | AFYA Admin',
  description: 'Manage impact areas and metrics',
};

export default async function ImpactAreaManagementPage() {
  const result = await getImpactAreas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Impact Area Management</h1>
          <p className="text-gray-600 mt-1">
            Update impact area descriptions and metrics
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ImpactAreaManagementClient 
          initialImpactAreas={result.success ? result.impactAreas : []} 
        />
      </Suspense>
    </div>
  );
}
