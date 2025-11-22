import { prisma } from '@/lib/db';
import { ProductCard } from './product-card';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function ProductsGrid() {
  let products = [];
  let error = null;

  try {
    products = await prisma.product.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error = err;
  }

  // Show error state if database connection failed
  if (error) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Shop Coming Soon
        </h3>
        <p className="text-gray-600 mb-4">
          We're setting up our shop. Check back soon for amazing wellness products!
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mt-6">
          <p className="text-sm text-blue-900">
            <strong>For Developers:</strong> The database needs to be configured.
            Run <code className="bg-blue-100 px-2 py-1 rounded">docker-compose up -d</code> and{' '}
            <code className="bg-blue-100 px-2 py-1 rounded">npx prisma db push</code> to set up.
          </p>
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Products Available
        </h3>
        <p className="text-gray-600 mb-4">
          We're currently updating our inventory. Check back soon for new items!
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto mt-6">
          <p className="text-sm text-gray-700">
            <strong>For Developers:</strong> Run{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">npx prisma db seed</code> to add sample products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
