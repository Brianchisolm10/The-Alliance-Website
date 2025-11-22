'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-spinner'
import { ProductFormDialog } from '@/components/admin/product-form-dialog'
import {
  getProducts,
  deleteProduct,
  updateInventory,
} from '@/app/actions/product-management'
import { Product } from '@prisma/client'

export function ProductManagementClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
  }, [filter, search])

  async function loadProducts() {
    setLoading(true)
    const result = await getProducts({
      published: filter === 'all' ? undefined : filter === 'published',
      search: search || undefined,
    })

    if (result.success && result.data) {
      setProducts(result.data)
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    const result = await deleteProduct(id)
    if (result.success) {
      loadProducts()
    } else {
      alert(result.error || 'Failed to delete product')
    }
  }

  async function handleInventoryUpdate(id: string, newInventory: number) {
    const result = await updateInventory(id, newInventory)
    if (result.success) {
      loadProducts()
    } else {
      alert(result.error || 'Failed to update inventory')
    }
  }

  const filteredProducts = products

  if (loading) {
    return <LoadingState message="Loading products..." />
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'published' ? 'default' : 'outline'}
              onClick={() => setFilter('published')}
              size="sm"
            >
              Published
            </Button>
            <Button
              variant={filter === 'unpublished' ? 'default' : 'outline'}
              onClick={() => setFilter('unpublished')}
              size="sm"
            >
              Unpublished
            </Button>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create Product
        </Button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No products found</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-6">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-3">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-lg">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Inventory:</span>
                    <Input
                      type="number"
                      value={product.inventory}
                      onChange={(e) =>
                        handleInventoryUpdate(
                          product.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 h-8 text-sm"
                      min="0"
                    />
                  </div>
                </div>

                {product.stripeProductId && (
                  <p className="text-xs text-gray-500">
                    Stripe: {product.stripeProductId.substring(0, 20)}...
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <ProductFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadProducts}
      />

      {/* Edit Dialog */}
      {editingProduct && (
        <ProductFormDialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          product={editingProduct}
          onSuccess={() => {
            setEditingProduct(null)
            loadProducts()
          }}
        />
      )}
    </div>
  )
}
