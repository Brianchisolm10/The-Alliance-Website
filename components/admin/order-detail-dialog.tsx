'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { updateOrderStatus } from '@/app/actions/order-management'
import { OrderStatus } from '@prisma/client'

interface OrderDetailDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
  onUpdate,
}: OrderDetailDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleStatusUpdate(newStatus: OrderStatus) {
    if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      return
    }

    setLoading(true)
    setError(null)

    const result = await updateOrderStatus(order.id, newStatus)

    if (result.success) {
      onUpdate()
      onOpenChange(false)
    } else {
      setError(result.error || 'Failed to update order status')
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

  const statusOptions = [
    OrderStatus.PENDING,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">Order ID: {order.id}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {order.user?.name || 'Guest'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{order.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-3 border-b last:border-b-0"
                >
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${(item.price / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total: ${((item.price * item.quantity) / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Payment Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ${((order.total - (order.donationAmount || 0)) / 100).toFixed(2)}
                </span>
              </div>
              {order.donationAmount && (
                <div className="flex justify-between text-blue-600">
                  <span>Donation{order.donationArea && ` (${order.donationArea})`}:</span>
                  <span className="font-medium">
                    ${(order.donationAmount / 100).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${(order.total / 100).toFixed(2)}</span>
              </div>
              {order.stripePaymentId && (
                <div className="flex justify-between text-xs text-gray-500 pt-2">
                  <span>Stripe Payment ID:</span>
                  <span>{order.stripePaymentId.substring(0, 20)}...</span>
                </div>
              )}
            </div>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm space-y-1">
                <div>{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.line1}</div>
                {order.shippingAddress.line2 && (
                  <div>{order.shippingAddress.line2}</div>
                )}
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </Card>
          )}

          {/* Status Update Actions */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Update Order Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={order.status === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusUpdate(status)}
                  disabled={loading || order.status === status}
                >
                  {status}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
