'use client';

import { useState } from 'react';
import { Population } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateNutritionInput,
  NutritionLibraryItem,
  NUTRITION_CATEGORIES,
  COMMON_ALLERGENS,
  DIETARY_TAGS,
} from '@/lib/libraries/types';
import { createNutritionItem, updateNutritionItem } from '@/app/actions/libraries';

interface NutritionLibraryFormProps {
  item?: NutritionLibraryItem;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NutritionLibraryForm({
  item,
  onSuccess,
  onCancel,
}: NutritionLibraryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateNutritionInput>({
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || '',
    macros: item?.macros || { protein: 0, carbs: 0, fats: 0, calories: 0 },
    micronutrients: item?.micronutrients || {},
    allergens: item?.allergens || [],
    dietaryTags: item?.dietaryTags || [],
    servingSize: item?.servingSize || '',
    populations: item?.populations || [],
    contraindications: item?.contraindications || [],
    alternatives: item?.alternatives || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = item
        ? await updateNutritionItem(item.id, formData)
        : await createNutritionItem(formData);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to save nutrition item');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="name">Food/Meal Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select category</option>
            {NUTRITION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="servingSize">Serving Size *</Label>
          <Input
            id="servingSize"
            value={formData.servingSize}
            onChange={(e) =>
              setFormData({ ...formData, servingSize: e.target.value })
            }
            placeholder="e.g., 1 cup, 100g"
            required
          />
        </div>
      </div>

      <div>
        <Label>Macronutrients *</Label>
        <div className="grid grid-cols-4 gap-3 mt-2">
          <div>
            <Label htmlFor="protein" className="text-xs">
              Protein (g)
            </Label>
            <Input
              id="protein"
              type="number"
              step="0.1"
              value={formData.macros.protein}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  macros: { ...formData.macros, protein: parseFloat(e.target.value) },
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="carbs" className="text-xs">
              Carbs (g)
            </Label>
            <Input
              id="carbs"
              type="number"
              step="0.1"
              value={formData.macros.carbs}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  macros: { ...formData.macros, carbs: parseFloat(e.target.value) },
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="fats" className="text-xs">
              Fats (g)
            </Label>
            <Input
              id="fats"
              type="number"
              step="0.1"
              value={formData.macros.fats}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  macros: { ...formData.macros, fats: parseFloat(e.target.value) },
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="calories" className="text-xs">
              Calories
            </Label>
            <Input
              id="calories"
              type="number"
              value={formData.macros.calories}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  macros: { ...formData.macros, calories: parseInt(e.target.value) },
                })
              }
              required
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Allergens</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {COMMON_ALLERGENS.map((allergen) => (
            <label key={allergen} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.allergens.includes(allergen)}
                onChange={(e) => {
                  const allergens = e.target.checked
                    ? [...formData.allergens, allergen]
                    : formData.allergens.filter((a) => a !== allergen);
                  setFormData({ ...formData, allergens });
                }}
              />
              <span className="text-sm">{allergen}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Dietary Tags</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {DIETARY_TAGS.map((tag) => (
            <label key={tag} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.dietaryTags.includes(tag)}
                onChange={(e) => {
                  const dietaryTags = e.target.checked
                    ? [...formData.dietaryTags, tag]
                    : formData.dietaryTags.filter((t) => t !== tag);
                  setFormData({ ...formData, dietaryTags });
                }}
              />
              <span className="text-sm">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Populations *</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {Object.values(Population).map((pop) => (
            <label key={pop} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.populations.includes(pop)}
                onChange={(e) => {
                  const populations = e.target.checked
                    ? [...formData.populations, pop]
                    : formData.populations.filter((p) => p !== pop);
                  setFormData({ ...formData, populations });
                }}
              />
              <span className="text-sm">{pop.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
}
