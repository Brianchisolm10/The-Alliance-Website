'use client';

import { useState } from 'react';
import { Testimonial } from '@prisma/client';
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
} from '@/app/actions/content-management';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

interface TestimonialManagementClientProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialManagementClient({ initialTestimonials }: TestimonialManagementClientProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (filter === 'published') return testimonial.published;
    if (filter === 'unpublished') return !testimonial.published;
    return true;
  });

  const handleOpenDialog = (testimonial?: Testimonial) => {
    setEditingTestimonial(testimonial || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      content: formData.get('content') as string,
      imageUrl: formData.get('imageUrl') as string || undefined,
      published: formData.get('published') === 'true',
      featured: formData.get('featured') === 'true',
    };

    try {
      let result;
      if (editingTestimonial) {
        result = await updateTestimonial(editingTestimonial.id, data);
      } else {
        result = await createTestimonial(data);
      }

      if (result.success) {
        toast({
          title: 'Success',
          description: `Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully`,
        });

        if (editingTestimonial) {
          setTestimonials(testimonials.map((t) => (t.id === result.testimonial!.id ? result.testimonial! : t)));
        } else {
          setTestimonials([result.testimonial!, ...testimonials]);
        }

        handleCloseDialog();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save testimonial',
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
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const result = await deleteTestimonial(id);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete testimonial',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublished = async (id: string) => {
    const result = await toggleTestimonialPublished(id);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Testimonial status updated',
      });
      setTestimonials(testimonials.map((t) => (t.id === id ? result.testimonial! : t)));
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
            All ({testimonials.length})
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            onClick={() => setFilter('published')}
          >
            Published ({testimonials.filter((t) => t.published).length})
          </Button>
          <Button
            variant={filter === 'unpublished' ? 'default' : 'outline'}
            onClick={() => setFilter('unpublished')}
          >
            Unpublished ({testimonials.filter((t) => !t.published).length})
          </Button>
        </div>
        <Button onClick={() => handleOpenDialog()}>Add Testimonial</Button>
      </div>

      {/* Testimonials List */}
      <div className="grid gap-4">
        {filteredTestimonials.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No testimonials found</p>
          </Card>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        testimonial.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {testimonial.published ? 'Published' : 'Pending Review'}
                    </span>
                    {testimonial.featured && (
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3 italic">&quot;{testimonial.content}&quot;</p>
                  <div className="text-sm text-gray-500">
                    Added: {new Date(testimonial.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublished(testimonial.id)}
                  >
                    {testimonial.published ? 'Unpublish' : 'Approve & Publish'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(testimonial)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <Input
                    name="name"
                    defaultValue={editingTestimonial?.name}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Testimonial</label>
                  <Textarea
                    name="content"
                    defaultValue={editingTestimonial?.content}
                    rows={6}
                    placeholder="Share your experience with AFYA..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                  <Input
                    name="imageUrl"
                    type="url"
                    defaultValue={editingTestimonial?.imageUrl || ''}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Profile photo or avatar for the testimonial
                  </p>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="published"
                      value="true"
                      defaultChecked={editingTestimonial?.published}
                    />
                    <span className="text-sm">Published</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      value="true"
                      defaultChecked={editingTestimonial?.featured}
                    />
                    <span className="text-sm">Featured on Homepage</span>
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
                    {isSubmitting ? 'Saving...' : editingTestimonial ? 'Update' : 'Add'}
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
