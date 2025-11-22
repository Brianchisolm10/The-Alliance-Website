'use client';

import { useState } from 'react';
import { ImpactArea } from '@prisma/client';
import {
  createImpactArea,
  updateImpactArea,
  deleteImpactArea,
} from '@/app/actions/content-management';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

interface ImpactAreaManagementClientProps {
  initialImpactAreas: ImpactArea[];
}

export function ImpactAreaManagementClient({ initialImpactAreas }: ImpactAreaManagementClientProps) {
  const [impactAreas, setImpactAreas] = useState<ImpactArea[]>(initialImpactAreas);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImpactArea, setEditingImpactArea] = useState<ImpactArea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metricsJson, setMetricsJson] = useState('{}');

  const handleOpenDialog = (impactArea?: ImpactArea) => {
    setEditingImpactArea(impactArea || null);
    setMetricsJson(impactArea?.metrics ? JSON.stringify(impactArea.metrics, null, 2) : '{}');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingImpactArea(null);
    setMetricsJson('{}');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Parse metrics JSON
    let metrics;
    try {
      metrics = JSON.parse(metricsJson);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid JSON format for metrics',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      metrics,
    };

    try {
      let result;
      if (editingImpactArea) {
        result = await updateImpactArea(editingImpactArea.id, data);
      } else {
        result = await createImpactArea(data);
      }

      if (result.success) {
        toast({
          title: 'Success',
          description: `Impact area ${editingImpactArea ? 'updated' : 'created'} successfully`,
        });

        if (editingImpactArea) {
          setImpactAreas(impactAreas.map((ia) => (ia.id === result.impactArea!.id ? result.impactArea! : ia)));
        } else {
          setImpactAreas([...impactAreas, result.impactArea!]);
        }

        handleCloseDialog();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save impact area',
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
    if (!confirm('Are you sure you want to delete this impact area?')) return;

    const result = await deleteImpactArea(id);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Impact area deleted successfully',
      });
      setImpactAreas(impactAreas.filter((ia) => ia.id !== id));
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete impact area',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {impactAreas.length} impact {impactAreas.length === 1 ? 'area' : 'areas'}
        </div>
        <Button onClick={() => handleOpenDialog()}>Add Impact Area</Button>
      </div>

      {/* Impact Areas List */}
      <div className="grid gap-4">
        {impactAreas.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No impact areas found</p>
            <p className="text-sm text-gray-400 mt-2">
              Create impact areas to organize donation categories
            </p>
          </Card>
        ) : (
          impactAreas.map((impactArea) => (
            <Card key={impactArea.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{impactArea.name}</h3>
                  <p className="text-gray-600 mb-3">{impactArea.description}</p>
                  
                  {impactArea.metrics && Object.keys(impactArea.metrics as object).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Metrics:</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(impactArea.metrics, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 mt-3">
                    Last updated: {new Date(impactArea.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(impactArea)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(impactArea.id)}
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
                {editingImpactArea ? 'Edit Impact Area' : 'Add Impact Area'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    defaultValue={editingImpactArea?.name}
                    placeholder="e.g., Foundations, Equipment, Sponsorship"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    name="description"
                    defaultValue={editingImpactArea?.description}
                    rows={4}
                    placeholder="Describe the impact area and how donations are used..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Metrics (JSON)
                  </label>
                  <Textarea
                    value={metricsJson}
                    onChange={(e) => setMetricsJson(e.target.value)}
                    rows={8}
                    placeholder='{"totalDonations": 0, "beneficiaries": 0}'
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter metrics as JSON. Example: {`{"totalDonations": 5000, "itemsProvided": 120}`}
                  </p>
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
                    {isSubmitting ? 'Saving...' : editingImpactArea ? 'Update' : 'Create'}
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
