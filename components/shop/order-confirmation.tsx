'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCart } from '@/lib/cart/cart-context';

interface OrderDetails {
  id: string;
  email: string;
  total: number;
  donationAmount: number | null;
  donationArea: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    // Clear the cart
    clearCart();

    // Fetch order details
    fetchOrderDetails(sessionId);
  }, [sessionId, clearCart]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/orders/session/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data);
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

  if (error || !order) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <Package className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'We could not find your order details.'}
          </p>
          <Button onClick={() => router.push('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="p-8 text-center bg-green-50 border-green-200">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-md">
          <Mail className="h-4 w-4" />
          <span>Confirmation sent to <strong>{order.email}</strong></span>
        </div>
      </Card>

      {/* Order Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Order Details
        </h2>
        
        <div className="space-y-4">
          {/* Order ID and Date */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono font-medium">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Items */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                ${((order.total - (order.donationAmount || 0)) / 100).toFixed(2)}
              </span>
            </div>
            {order.donationAmount && order.donationAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>
                  Donation
                  {order.donationArea && ` (${order.donationArea})`}
                </span>
                <span>${(order.donationAmount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${(order.total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Donation Thank You */}
      {order.donationAmount && order.donationAmount > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Thank You for Your Donation!
          </h3>
          <p className="text-blue-800">
            Your generous donation of ${(order.donationAmount / 100).toFixed(2)}
            {order.donationArea && ` to ${order.donationArea}`} helps us make wellness
            accessible to underserved communities. You'll receive a tax receipt via email.
          </p>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          What's Next?
        </h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>You'll receive an order confirmation email shortly</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>We'll send you tracking information once your order ships</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Expect delivery within 5-7 business days</span>
          </li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push('/shop')}
          variant="outline"
          className="flex-1"
        >
          Continue Shopping
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
