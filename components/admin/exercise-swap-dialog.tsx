'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { swapExercise } from '@/app/actions/packet-editing';
import { searchExercises } from '@/app/actions/libraries';
import { ExerciseData } from '@/lib/pdf/types';
import { ExerciseLibraryItem } from '@/lib/libraries/types';

interface ExerciseSwapDialogProps {
  packetId: string;
  exerciseIndex: number;
  currentExercise: ExerciseData;
  population: string | null;
  onComplete: () => void;
  onCancel: () => void;
}

export function ExerciseSwapDialog({
  packetId,
  exerciseIndex,
  currentExercise,
  population,
  onComplete,
  onCancel,
}: ExerciseSwapDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<ExerciseLibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseLibraryItem | null>(
    null
  );

  useEffect(() => {
    loadExercises();
  }, [searchQuery, population]);

  const loadExercises = async () => {
    setLoading(true);
    const result = await searchExercises(
      {
        query: searchQuery,
        populations: population ? [population as any] : [],
      },
      1,
      20
    );

    if (result.success && result.data) {
      setExercises(result.data.exercises);
    }
    setLoading(false);
  };

  const handleSwap = async () => {
    if (!selectedExercise) return;

    setSwapping(true);
    const result = await swapExercise(packetId, exerciseIndex, selectedExercise.id);

    if (result.success) {
      onComplete();
    } else {
      alert(result.error || 'Failed to swap exercise');
    }
    setSwapping(false);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Swap Exercise</h2>
            <p className="text-sm text-gray-600 mt-1">
              Currently: {currentExercise.name}
            </p>
          </div>

          <div className="p-6 border-b">
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-8">Loading exercises...</div>
            ) : exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No exercises found. Try a different search.
              </div>
            ) : (
              <div className="grid gap-3">
                {exercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedExercise?.id === exercise.id
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {exercise.description}
                        </p>
                        <div className="flex gap-2 mt-2">
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
                      </div>
                      {selectedExercise?.id === exercise.id && (
                        <div className="ml-4">
                          <svg
                            className="h-6 w-6 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSwap}
              disabled={!selectedExercise || swapping}
            >
              {swapping ? 'Swapping...' : 'Swap Exercise'}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
