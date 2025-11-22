import { ShoppingCart } from '@/components/shop/shopping-cart';

export const metadata = {
  title: 'Shopping Cart | AFYA Wellness',
  description: 'Review your cart and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <ShoppingCart />
      </div>
    </div>
  );
}
