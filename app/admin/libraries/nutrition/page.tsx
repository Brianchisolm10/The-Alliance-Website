'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { NutritionLibraryForm } from '@/components/admin/nutrition-library-form';
import {
  searchNutritionItems,
  deleteNutritionItem,
  getNutritionCategories,
} from '@/app/actions/libraries';
import {
  NutritionLibraryItem,
  NutritionSearchFilters,
} from '@/lib/libraries/types';

export default function NutritionLibraryPage() {
  const [items, setItems] = useState<NutritionLibraryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<
    NutritionLibraryItem | undefined
  >();
  const [categories, setCategories] = useState<string[]>([]);

  const [filters, setFilters] = useState<NutritionSearchFilters>({
    query: '',
    category: '',
    allergens: [],
    dietaryTags: [],
    populations: [],
  });

  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    loadItems();
    loadCategories();
  }, [filters, page]);

  const loadItems = async () => {
    setLoading(true);
    const result = await searchNutritionItems(filters, page, limit);
    if (result.success && result.data) {
      setItems(result.data.items);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    const result = await getNutritionCategories();
    if (result.success && result.data) {
      setCategories(result.data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nutrition item?'))
      return;

    const result = await deleteNutritionItem(id);
    if (result.success) {
      loadItems();
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (item: NutritionLibraryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(undefined);
    loadItems();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nutrition Library</h1>
        <Button
          onClick={() => {
            setEditingItem(undefined);
            setShowForm(true);
          }}
        >
          Add Nutrition Item
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search nutrition items..."
              value={filters.query}
              onChange={(e) =>
                setFilters({ ...filters, query: e.target.value })
              }
            />
          </div>

          <div>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  query: '',
                  category: '',
                  allergens: [],
                  dietaryTags: [],
                  populations: [],
                })
              }
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Nutrition Items List */}
      {loading ? (
        <div className="text-center py-12">Loading nutrition items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No nutrition items found. Add your first item to get started.
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                    <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                      <div>
                        <span className="font-medium">Protein:</span>{' '}
                        {item.macros.protein}g
                      </div>
                      <div>
                        <span className="font-medium">Carbs:</span>{' '}
                        {item.macros.carbs}g
                      </div>
                      <div>
                        <span className="font-medium">Fats:</span>{' '}
                        {item.macros.fats}g
                      </div>
                      <div>
                        <span className="font-medium">Calories:</span>{' '}
                        {item.macros.calories}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {item.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {item.servingSize}
                      </span>
                      {item.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.allergens.length > 0 && (
                      <div className="text-xs text-red-600 mt-2">
                        Allergens: {item.allergens.join(', ')}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Populations: {item.populations.join(', ')}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Form Dialog */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingItem ? 'Edit Nutrition Item' : 'Add Nutrition Item'}
              </h2>
              <NutritionLibraryForm
                item={editingItem}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(undefined);
                }}
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
