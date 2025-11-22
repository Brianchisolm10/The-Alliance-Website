'use client';

import { useState } from 'react';
import { Program, ProgramType, IntensityLevel } from '@prisma/client';
import {
  createProgram,
  updateProgram,
  deleteProgram,
  toggleProgramPublished,
} from '@/app/actions/content-management';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

interface ProgramManagementClientProps {
  initialPrograms: Program[];
}

export function ProgramManagementClient({ initialPrograms }: ProgramManagementClientProps) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');

  const filteredPrograms = programs.filter((program) => {
    if (filter === 'published') return program.published;
    if (filter === 'unpublished') return !program.published;
    return true;
  });

  const handleOpenDialog = (program?: Program) => {
    setEditingProgram(program || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProgram(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as ProgramType,
      intensity: formData.get('intensity') as IntensityLevel,
      duration: formData.get('duration') as string,
      imageUrl: formData.get('imageUrl') as string || undefined,
      published: formData.get('published') === 'true',
      featured: formData.get('featured') === 'true',
    };

    try {
      let result;
      if (editingProgram) {
        result = await updateProgram(editingProgram.id, data);
      } else {
        result = await createProgram(data);
      }

      if (result.success) {
        toast({
          title: 'Success',
          description: `Program ${editingProgram ? 'updated' : 'created'} successfully`,
        });

        if (editingProgram) {
          setPrograms(programs.map((p) => (p.id === result.program!.id ? result.program! : p)));
        } else {
          setPrograms([result.program!, ...programs]);
        }

        handleCloseDialog();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save program',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    const result = await deleteProgram(id);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Program deleted successfully',
      });
      setPrograms(programs.filter((p) => p.id !== id));
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete program',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublished = async (id: string) => {
    const result = await toggleProgramPublished(id);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Program status updated',
      });
      setPrograms(programs.map((p) => (p.id === id ? result.program! : p)));
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({programs.length})
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            onClick={() => setFilter('published')}
          >
            Published ({programs.filter((p) => p.published).length})
          </Button>
          <Button
            variant={filter === 'unpublished' ? 'default' : 'outline'}
            onClick={() => setFilter('unpublished')}
          >
            Unpublished ({programs.filter((p) => !p.published).length})
          </Button>
        </div>
        <Button onClick={() => handleOpenDialog()}>Create Program</Button>
      </div>

      {/* Programs List */}
      <div className="grid gap-4">
        {filteredPrograms.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No programs found</p>
          </Card>
        ) : (
          filteredPrograms.map((program) => (
            <Card key={program.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{program.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        program.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {program.published ? 'Published' : 'Unpublished'}
                    </span>
                    {program.featured && (
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{program.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Type: {program.type}</span>
                    <span>Intensity: {program.intensity}</span>
                    <span>Duration: {program.duration}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublished(program.id)}
                  >
                    {program.published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(program)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(program.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingProgram ? 'Edit Program' : 'Create Program'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    defaultValue={editingProgram?.name}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    name="description"
                    defaultValue={editingProgram?.description}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <Select
                      name="type"
                      defaultValue={editingProgram?.type}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="FITNESS">Fitness</option>
                      <option value="NUTRITION">Nutrition</option>
                      <option value="WELLNESS">Wellness</option>
                      <option value="YOUTH">Youth</option>
                      <option value="RECOVERY">Recovery</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Intensity</label>
                    <Select
                      name="intensity"
                      defaultValue={editingProgram?.intensity}
                      required
                    >
                      <option value="">Select intensity</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="ELITE">Elite</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <Input
                    name="duration"
                    defaultValue={editingProgram?.duration}
                    placeholder="e.g., 4 weeks, 8 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    name="imageUrl"
                    type="url"
                    defaultValue={editingProgram?.imageUrl || ''}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="published"
                      value="true"
                      defaultChecked={editingProgram?.published}
                    />
                    <span className="text-sm">Published</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      value="true"
                      defaultChecked={editingProgram?.featured}
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingProgram ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
