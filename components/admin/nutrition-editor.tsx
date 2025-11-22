'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { NutritionData } from '@/lib/pdf/types';

interface NutritionEditorProps {
  item: NutritionData;
  onSave: (updates: Partial<NutritionData>) => void;
  onCancel: () => void;
  saving: boolean;
}

export function NutritionEditor({
  item,
  onSave,
  onCancel,
  saving,
}: NutritionEditorProps) {
  const [editedItem, setEditedItem] = useState<NutritionData>({ ...item });

  const handleSave = () => {
    onSave(editedItem);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Nutrition Item</h2>

          <div className="space-y-4">
            <div>
              <Label>Meal Type</Label>
              <Input
                value={editedItem.mealType}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, mealType: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Foods (comma-separated)</Label>
              <Input
                value={editedItem.foods.join(', ')}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    foods: e.target.value.split(',').map((f) => f.trim()),
                  })
                }
              />
            </div>

            <div>
              <Label>Portions (comma-separated)</Label>
              <Input
                value={editedItem.portions?.join(', ') || ''}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    portions: e.target.value.split(',').map((p) => p.trim()),
                  })
                }
                placeholder="e.g., 1 cup, 4 oz, 2 tbsp"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Calories</Label>
                <Input
                  type="number"
                  value={editedItem.calories || ''}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      calories: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {editedItem.macros && (
              <div>
                <Label className="mb-2 block">Macros</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Protein (g)</Label>
                    <Input
                      type="number"
                      value={editedItem.macros.protein || ''}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          macros: {
                            ...editedItem.macros!,
                            protein: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Carbs (g)</Label>
                    <Input
                      type="number"
                      value={editedItem.macros.carbs || ''}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          macros: {
                            ...editedItem.macros!,
                            carbs: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Fats (g)</Label>
                    <Input
                      type="number"
                      value={editedItem.macros.fats || ''}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          macros: {
                            ...editedItem.macros!,
                            fats: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editedItem.notes || ''}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <Label>Alternatives (comma-separated)</Label>
              <Input
                value={editedItem.alternatives?.join(', ') || ''}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    alternatives: e.target.value.split(',').map((a) => a.trim()),
                  })
                }
                placeholder="e.g., Greek yogurt, Cottage cheese"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
