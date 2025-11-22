'use client';

import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart/cart-context';
import { useRouter } from 'next/navigation';

export function ShoppingCart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <Button onClick={() => router.push('/shop')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200"
          >
            {/* Product Image */}
            <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 truncate pr-2">
                  {item.name}
                </h3>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-lg font-bold text-gray-900 mb-3">
                ${(item.price / 100).toFixed(2)}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-lg font-bold text-gray-900">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold text-gray-900">Subtotal</span>
          <span className="font-bold text-gray-900">
            ${(totalPrice / 100).toFixed(2)}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <Button
            onClick={() => router.push('/shop/checkout')}
            className="w-full"
            size="lg"
          >
            Proceed to Checkout
          </Button>
          <Button
            onClick={() => router.push('/shop')}
            variant="outline"
            className="w-full"
          >
            Continue Shopping
          </Button>
          <button
            onClick={clearCart}
            className="w-full text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
