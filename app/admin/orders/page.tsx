import { Suspense } from 'react'
import { OrderManagementClient } from './order-management-client'
import { LoadingState } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Order Management | AFYA Admin',
  description: 'Manage customer orders and fulfillment',
}

export default function OrderManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-2 text-gray-600">
          View and manage customer orders, track fulfillment, and update order status
        </p>
      </div>

      <Suspense fallback={<LoadingState message="Loading orders..." />}>
        <OrderManagementClient />
      </Suspense>
    </div>
  )
}
