'use client';

import { useState } from 'react';
import { Population } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateExerciseInput,
  ExerciseLibraryItem,
  EXERCISE_CATEGORIES,
  EXERCISE_DIFFICULTIES,
} from '@/lib/libraries/types';
import { createExercise, updateExercise } from '@/app/actions/libraries';

interface ExerciseLibraryFormProps {
  exercise?: ExerciseLibraryItem;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExerciseLibraryForm({
  exercise,
  onSuccess,
  onCancel,
}: ExerciseLibraryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateExerciseInput>({
    name: exercise?.name || '',
    description: exercise?.description || '',
    category: exercise?.category || '',
    targetMuscles: exercise?.targetMuscles || [],
    equipment: exercise?.equipment || [],
    difficulty: exercise?.difficulty || '',
    videoUrl: exercise?.videoUrl || '',
    imageUrl: exercise?.imageUrl || '',
    instructions: exercise?.instructions || '',
    regressions: exercise?.regressions || [],
    progressions: exercise?.progressions || [],
    contraindications: exercise?.contraindications || [],
    populations: exercise?.populations || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = exercise
        ? await updateExercise(exercise.id, formData)
        : await createExercise(formData);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to save exercise');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (field: keyof CreateExerciseInput, value: string) => {
    const array = value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: array });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="name">Exercise Name *</Label>
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
            {EXERCISE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty *</Label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select difficulty</option>
            {EXERCISE_DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="targetMuscles">Target Muscles (comma-separated) *</Label>
        <Input
          id="targetMuscles"
          value={formData.targetMuscles.join(', ')}
          onChange={(e) => handleArrayInput('targetMuscles', e.target.value)}
          placeholder="e.g., Quadriceps, Glutes, Hamstrings"
          required
        />
      </div>

      <div>
        <Label htmlFor="equipment">Equipment (comma-separated) *</Label>
        <Input
          id="equipment"
          value={formData.equipment.join(', ')}
          onChange={(e) => handleArrayInput('equipment', e.target.value)}
          placeholder="e.g., Barbell, Dumbbells, None"
          required
        />
      </div>

      <div>
        <Label htmlFor="instructions">Instructions *</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) =>
            setFormData({ ...formData, instructions: e.target.value })
          }
          required
          rows={5}
          placeholder="Step-by-step instructions..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={(e) =>
              setFormData({ ...formData, videoUrl: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://..."
          />
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
          {loading ? 'Saving...' : exercise ? 'Update Exercise' : 'Create Exercise'}
        </Button>
      </div>
    </form>
  );
}
