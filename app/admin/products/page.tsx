import { Suspense } from 'react'
import { ProductManagementClient } from './product-management-client'
import { LoadingState } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Product Management | AFYA Admin',
  description: 'Manage shop products and inventory',
}

export default function ProductManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <p className="mt-2 text-gray-600">
          Manage shop products, inventory, and Stripe integration
        </p>
      </div>

      <Suspense fallback={<LoadingState message="Loading products..." />}>
        <ProductManagementClient />
      </Suspense>
    </div>
  )
}
