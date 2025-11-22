'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { ExerciseSwapDialog } from '@/components/admin/exercise-swap-dialog';
import { NutritionEditor } from '@/components/admin/nutrition-editor';
import {
  updateExerciseParameters,
  updateNutritionItem,
  updatePacketContent,
} from '@/app/actions/packet-editing';
import { AnyPacketContent, ExerciseData, NutritionData } from '@/lib/pdf/types';

interface PacketEditorProps {
  packet: {
    id: string;
    type: string;
    data: AnyPacketContent;
    user: {
      population: string | null;
    };
  };
  onUpdate: () => void;
}

export function PacketEditor({ packet, onUpdate }: PacketEditorProps) {
  const [saving, setSaving] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{
    index: number;
    exercise: ExerciseData;
  } | null>(null);
  const [swappingExercise, setSwappingExercise] = useState<number | null>(null);
  const [editingNutrition, setEditingNutrition] = useState<{
    index: number;
    item: NutritionData;
  } | null>(null);

  const packetData = packet.data as any;

  // Extract exercises from packet data
  const getExercises = (): ExerciseData[] => {
    if (packetData.exercises) return packetData.exercises;
    if (packetData.strengthProgram) return packetData.strengthProgram;
    if (packetData.program && packetData.program[0]?.exercises) {
      return packetData.program[0].exercises;
    }
    return [];
  };

  // Extract nutrition from packet data
  const getNutrition = (): NutritionData[] => {
    if (packetData.nutrition) return packetData.nutrition;
    if (packetData.mealPlan) return packetData.mealPlan;
    if (packetData.nutritionStrategy) return packetData.nutritionStrategy;
    return [];
  };

  const exercises = getExercises();
  const nutrition = getNutrition();

  const handleUpdateExercise = async (
    index: number,
    updates: Partial<ExerciseData>
  ) => {
    setSaving(true);
    const result = await updateExerciseParameters(packet.id, index, updates);

    if (result.success) {
      setEditingExercise(null);
      onUpdate();
    } else {
      alert(result.error || 'Failed to update exercise');
    }
    setSaving(false);
  };

  const handleSwapComplete = () => {
    setSwappingExercise(null);
    onUpdate();
  };

  const handleUpdateNutrition = async (
    index: number,
    updates: Partial<NutritionData>
  ) => {
    setSaving(true);
    const result = await updateNutritionItem(packet.id, index, updates);

    if (result.success) {
      setEditingNutrition(null);
      onUpdate();
    } else {
      alert(result.error || 'Failed to update nutrition');
    }
    setSaving(false);
  };

  const handleUpdateGeneralContent = async (updates: Partial<AnyPacketContent>) => {
    setSaving(true);
    const result = await updatePacketContent(packet.id, updates);

    if (result.success) {
      onUpdate();
    } else {
      alert(result.error || 'Failed to update content');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* General Content Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">General Information</h2>
        
        {packetData.introduction && (
          <div className="mb-4">
            <Label>Introduction</Label>
            <Textarea
              value={packetData.introduction}
              onChange={(e) =>
                handleUpdateGeneralContent({ introduction: e.target.value })
              }
              rows={4}
              className="mt-1"
            />
          </div>
        )}

        {packetData.goals && (
          <div className="mb-4">
            <Label>Goals</Label>
            <div className="space-y-2 mt-1">
              {packetData.goals.map((goal: string, index: number) => (
                <Input
                  key={index}
                  value={goal}
                  onChange={(e) => {
                    const newGoals = [...packetData.goals];
                    newGoals[index] = e.target.value;
                    handleUpdateGeneralContent({ goals: newGoals } as any);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {packetData.coachNotes && (
          <div className="mb-4">
            <Label>Coach Notes</Label>
            <div className="mt-1 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-700">{packetData.coachNotes}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Exercise Section */}
      {exercises.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Exercises ({exercises.length})
          </h2>

          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {exercise.description}
                    </p>
                    <div className="flex gap-4 mt-3 text-sm">
                      {exercise.sets && (
                        <div>
                          <span className="font-medium">Sets:</span> {exercise.sets}
                        </div>
                      )}
                      {exercise.reps && (
                        <div>
                          <span className="font-medium">Reps:</span> {exercise.reps}
                        </div>
                      )}
                      {exercise.duration && (
                        <div>
                          <span className="font-medium">Duration:</span>{' '}
                          {exercise.duration}
                        </div>
                      )}
                      {exercise.intensity && (
                        <div>
                          <span className="font-medium">Intensity:</span>{' '}
                          {exercise.intensity}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingExercise({ index, exercise })}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSwappingExercise(index)}
                    >
                      Swap
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Nutrition Section */}
      {nutrition.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Nutrition Plan ({nutrition.length} items)
          </h2>

          <div className="space-y-4">
            {nutrition.map((item, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.mealType}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.foods.join(', ')}
                    </p>
                    {item.macros && (
                      <div className="flex gap-4 mt-2 text-sm">
                        <div>
                          <span className="font-medium">Calories:</span>{' '}
                          {item.calories}
                        </div>
                        <div>
                          <span className="font-medium">Protein:</span>{' '}
                          {item.macros.protein}g
                        </div>
                        <div>
                          <span className="font-medium">Carbs:</span>{' '}
                          {item.macros.carbs}g
                        </div>
                        <div>
                          <span className="font-medium">Fats:</span> {item.macros.fats}g
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingNutrition({ index, item })}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Exercise Edit Dialog */}
      {editingExercise && (
        <Dialog open={true} onOpenChange={() => setEditingExercise(null)}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Exercise</h2>

              <div className="space-y-4">
                <div>
                  <Label>Exercise Name</Label>
                  <Input value={editingExercise.exercise.name} disabled />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Sets</Label>
                    <Input
                      type="number"
                      value={editingExercise.exercise.sets || ''}
                      onChange={(e) =>
                        setEditingExercise({
                          ...editingExercise,
                          exercise: {
                            ...editingExercise.exercise,
                            sets: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Reps</Label>
                    <Input
                      value={editingExercise.exercise.reps || ''}
                      onChange={(e) =>
                        setEditingExercise({
                          ...editingExercise,
                          exercise: {
                            ...editingExercise.exercise,
                            reps: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., 10-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={editingExercise.exercise.duration || ''}
                      onChange={(e) =>
                        setEditingExercise({
                          ...editingExercise,
                          exercise: {
                            ...editingExercise.exercise,
                            duration: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., 30 seconds"
                    />
                  </div>

                  <div>
                    <Label>Intensity</Label>
                    <Input
                      value={editingExercise.exercise.intensity || ''}
                      onChange={(e) =>
                        setEditingExercise({
                          ...editingExercise,
                          exercise: {
                            ...editingExercise.exercise,
                            intensity: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={editingExercise.exercise.notes || ''}
                    onChange={(e) =>
                      setEditingExercise({
                        ...editingExercise,
                        exercise: {
                          ...editingExercise.exercise,
                          notes: e.target.value,
                        },
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEditingExercise(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateExercise(editingExercise.index, editingExercise.exercise)
                  }
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Exercise Swap Dialog */}
      {swappingExercise !== null && (
        <ExerciseSwapDialog
          packetId={packet.id}
          exerciseIndex={swappingExercise}
          currentExercise={exercises[swappingExercise]}
          population={packet.user.population}
          onComplete={handleSwapComplete}
          onCancel={() => setSwappingExercise(null)}
        />
      )}

      {/* Nutrition Edit Dialog */}
      {editingNutrition && (
        <NutritionEditor
          item={editingNutrition.item}
          onSave={(updates) =>
            handleUpdateNutrition(editingNutrition.index, updates)
          }
          onCancel={() => setEditingNutrition(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
