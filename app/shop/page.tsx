import { Suspense } from 'react';
import { ProductsGrid } from '@/components/shop/products-grid';
import { LoadingState } from '@/components/ui/loading-spinner';

export const metadata = {
  title: 'Shop | AFYA Wellness',
  description: 'Browse health products, supplements, and wellness gear from AFYA.',
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop</h1>
          <p className="text-lg text-gray-600">
            Browse our selection of health products, supplements, and wellness gear.
            A portion of every purchase supports our mission to make wellness accessible to all.
          </p>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<LoadingState message="Loading products..." />}>
          <ProductsGrid />
        </Suspense>
      </div>
    </div>
  );
}
