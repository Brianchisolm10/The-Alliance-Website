import { Suspense } from 'react';
import { getPrograms } from '@/app/actions/content-management';
import { ProgramManagementClient } from './program-management-client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const metadata = {
  title: 'Program Management | AFYA Admin',
  description: 'Manage wellness programs',
};

export default async function ProgramManagementPage() {
  const result = await getPrograms();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Program Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage wellness programs
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ProgramManagementClient 
          initialPrograms={result.success && result.programs ? result.programs : []} 
        />
      </Suspense>
    </div>
  );
}
