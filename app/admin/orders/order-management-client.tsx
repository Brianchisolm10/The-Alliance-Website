'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-spinner'
import { OrderDetailDialog } from '@/components/admin/order-detail-dialog'
import { getOrders, getOrderStats } from '@/app/actions/order-management'
import { OrderStatus } from '@prisma/client'

type Order = {
  id: string
  email: string
  status: OrderStatus
  total: number
  donationAmount: number | null
  donationArea: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
  } | null
  orderItems: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      imageUrl: string | null
    }
  }>
}

export function OrderManagementClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadData()
  }, [statusFilter, search])

  async function loadData() {
    setLoading(true)
    const [ordersResult, statsResult] = await Promise.all([
      getOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
      }),
      getOrderStats(),
    ])

    if (ordersResult.success && ordersResult.data) {
      setOrders(ordersResult.data as Order[])
    }

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data)
    }

    setLoading(false)
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800'
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      case OrderStatus.REFUNDED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <LoadingState message="Loading orders..." />
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">
              ${(stats.totalRevenue / 100).toFixed(2)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Donations</div>
            <div className="text-2xl font-bold text-blue-600">
              ${(stats.totalDonations / 100).toFixed(2)}
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Input
          type="text"
          placeholder="Search by email or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === OrderStatus.PENDING ? 'default' : 'outline'}
            onClick={() => setStatusFilter(OrderStatus.PENDING)}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === OrderStatus.PROCESSING ? 'default' : 'outline'}
            onClick={() => setStatusFilter(OrderStatus.PROCESSING)}
            size="sm"
          >
            Processing
          </Button>
          <Button
            variant={statusFilter === OrderStatus.SHIPPED ? 'default' : 'outline'}
            onClick={() => setStatusFilter(OrderStatus.SHIPPED)}
            size="sm"
          >
            Shipped
          </Button>
          <Button
            variant={statusFilter === OrderStatus.DELIVERED ? 'default' : 'outline'}
            onClick={() => setStatusFilter(OrderStatus.DELIVERED)}
            size="sm"
          >
            Delivered
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || 'Guest'}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderItems.length} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${(order.total / 100).toFixed(2)}
                      </div>
                      {order.donationAmount && (
                        <div className="text-xs text-blue-600">
                          +${(order.donationAmount / 100).toFixed(2)} donation
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open: boolean) => !open && setSelectedOrder(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  )
}
