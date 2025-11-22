'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { ExerciseLibraryForm } from '@/components/admin/exercise-library-form';
import {
  searchExercises,
  deleteExercise,
  getExerciseCategories,
} from '@/app/actions/libraries';
import {
  ExerciseLibraryItem,
  ExerciseSearchFilters,
  EXERCISE_DIFFICULTIES,
} from '@/lib/libraries/types';

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState<ExerciseLibraryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<
    ExerciseLibraryItem | undefined
  >();
  const [categories, setCategories] = useState<string[]>([]);

  const [filters, setFilters] = useState<ExerciseSearchFilters>({
    query: '',
    category: '',
    difficulty: '',
    populations: [],
  });

  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    loadExercises();
    loadCategories();
  }, [filters, page]);

  const loadExercises = async () => {
    setLoading(true);
    const result = await searchExercises(filters, page, limit);
    if (result.success && result.data) {
      setExercises(result.data.exercises);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    const result = await getExerciseCategories();
    if (result.success && result.data) {
      setCategories(result.data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    const result = await deleteExercise(id);
    if (result.success) {
      loadExercises();
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (exercise: ExerciseLibraryItem) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExercise(undefined);
    loadExercises();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exercise Library</h1>
        <Button
          onClick={() => {
            setEditingExercise(undefined);
            setShowForm(true);
          }}
        >
          Add Exercise
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search exercises..."
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
            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Difficulties</option>
              {EXERCISE_DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
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
                  difficulty: '',
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

      {/* Exercise List */}
      {loading ? (
        <div className="text-center py-12">Loading exercises...</div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No exercises found. Add your first exercise to get started.
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{exercise.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {exercise.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {exercise.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {exercise.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {exercise.targetMuscles.join(', ')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Populations: {exercise.populations.join(', ')}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(exercise)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(exercise.id)}
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
                {editingExercise ? 'Edit Exercise' : 'Add Exercise'}
              </h2>
              <ExerciseLibraryForm
                exercise={editingExercise}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingExercise(undefined);
                }}
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
