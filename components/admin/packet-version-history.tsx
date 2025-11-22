'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getPacketVersionHistory,
  restorePacketVersion,
} from '@/app/actions/packet-editing';

interface PacketVersion {
  id: string;
  version: number;
  data: any;
  fileUrl: string | null;
  modifiedBy: string;
  modifiedByUser?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  createdAt: Date;
}

interface PacketVersionHistoryProps {
  packetId: string;
  currentVersion: number;
  onRestore: () => void;
}

interface DiffItem {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
}

export function PacketVersionHistory({
  packetId,
  currentVersion,
  onRestore,
}: PacketVersionHistoryProps) {
  const [versions, setVersions] = useState<PacketVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PacketVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<PacketVersion | null>(null);

  useEffect(() => {
    loadVersions();
  }, [packetId]);

  const loadVersions = async () => {
    setLoading(true);
    const result = await getPacketVersionHistory(packetId);

    if (result.success && result.data) {
      setVersions(result.data as any);
    }
    setLoading(false);
  };

  const handleRestore = async (versionNumber: number) => {
    if (
      !confirm(
        `Are you sure you want to restore version ${versionNumber}? This will create a new version with the restored content.`
      )
    ) {
      return;
    }

    setRestoring(true);
    const result = await restorePacketVersion(packetId, versionNumber);

    if (result.success) {
      alert('Version restored successfully!');
      onRestore();
    } else {
      alert(result.error || 'Failed to restore version');
    }
    setRestoring(false);
  };

  const getVersionSummary = (data: any): string => {
    const parts: string[] = [];

    if (data.exercises) {
      parts.push(`${data.exercises.length} exercises`);
    }
    if (data.strengthProgram) {
      parts.push(`${data.strengthProgram.length} exercises`);
    }
    if (data.nutrition) {
      parts.push(`${data.nutrition.length} nutrition items`);
    }
    if (data.mealPlan) {
      parts.push(`${data.mealPlan.length} meals`);
    }
    if (data.goals) {
      parts.push(`${data.goals.length} goals`);
    }

    return parts.join(', ') || 'No content summary available';
  };

  /**
   * Calculate differences between two versions
   */
  const calculateDiff = (oldData: any, newData: any): DiffItem[] => {
    const diffs: DiffItem[] = [];

    // Helper to compare arrays
    const compareArrays = (field: string, oldArr: any[], newArr: any[]) => {
      if (!oldArr && !newArr) return;
      
      if (!oldArr && newArr) {
        diffs.push({
          field,
          oldValue: null,
          newValue: `${newArr.length} items`,
          type: 'added',
        });
        return;
      }

      if (oldArr && !newArr) {
        diffs.push({
          field,
          oldValue: `${oldArr.length} items`,
          newValue: null,
          type: 'removed',
        });
        return;
      }

      if (oldArr.length !== newArr.length) {
        diffs.push({
          field: `${field} (count)`,
          oldValue: oldArr.length,
          newValue: newArr.length,
          type: 'modified',
        });
      }

      // Compare individual items
      const maxLength = Math.max(oldArr.length, newArr.length);
      for (let i = 0; i < maxLength; i++) {
        if (i >= oldArr.length) {
          diffs.push({
            field: `${field}[${i}]`,
            oldValue: null,
            newValue: JSON.stringify(newArr[i]),
            type: 'added',
          });
        } else if (i >= newArr.length) {
          diffs.push({
            field: `${field}[${i}]`,
            oldValue: JSON.stringify(oldArr[i]),
            newValue: null,
            type: 'removed',
          });
        } else if (JSON.stringify(oldArr[i]) !== JSON.stringify(newArr[i])) {
          // Check specific fields for exercises/nutrition
          if (oldArr[i].name !== newArr[i].name) {
            diffs.push({
              field: `${field}[${i}].name`,
              oldValue: oldArr[i].name,
              newValue: newArr[i].name,
              type: 'modified',
            });
          }
          if (oldArr[i].sets !== newArr[i].sets) {
            diffs.push({
              field: `${field}[${i}].sets`,
              oldValue: oldArr[i].sets,
              newValue: newArr[i].sets,
              type: 'modified',
            });
          }
          if (oldArr[i].reps !== newArr[i].reps) {
            diffs.push({
              field: `${field}[${i}].reps`,
              oldValue: oldArr[i].reps,
              newValue: newArr[i].reps,
              type: 'modified',
            });
          }
        }
      }
    };

    // Helper to compare simple values
    const compareValue = (field: string, oldVal: any, newVal: any) => {
      if (oldVal === undefined && newVal === undefined) return;
      
      if (oldVal === undefined && newVal !== undefined) {
        diffs.push({ field, oldValue: null, newValue: newVal, type: 'added' });
      } else if (oldVal !== undefined && newVal === undefined) {
        diffs.push({ field, oldValue: oldVal, newValue: null, type: 'removed' });
      } else if (oldVal !== newVal) {
        diffs.push({ field, oldValue: oldVal, newValue: newVal, type: 'modified' });
      }
    };

    // Compare common fields
    compareValue('introduction', oldData.introduction, newData.introduction);
    compareValue('coachNotes', oldData.coachNotes, newData.coachNotes);
    
    // Compare arrays
    compareArrays('exercises', oldData.exercises, newData.exercises);
    compareArrays('strengthProgram', oldData.strengthProgram, newData.strengthProgram);
    compareArrays('nutrition', oldData.nutrition, newData.nutrition);
    compareArrays('mealPlan', oldData.mealPlan, newData.mealPlan);
    compareArrays('goals', oldData.goals, newData.goals);

    return diffs;
  };

  const renderDiffBadge = (type: DiffItem['type']) => {
    switch (type) {
      case 'added':
        return <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Added</span>;
      case 'removed':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">Removed</span>;
      case 'modified':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Modified</span>;
      default:
        return null;
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const renderVersionComparison = () => {
    if (!selectedVersion || !compareVersion) return null;

    // Calculate differences (older version first, newer version second)
    const isSelectedNewer = selectedVersion.version > compareVersion.version;
    const diffs = calculateDiff(
      isSelectedNewer ? compareVersion.data : selectedVersion.data,
      isSelectedNewer ? selectedVersion.data : compareVersion.data
    );

    const olderVersion = isSelectedNewer ? compareVersion : selectedVersion;
    const newerVersion = isSelectedNewer ? selectedVersion : compareVersion;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Version Comparison</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comparing v{olderVersion.version} → v{newerVersion.version}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {diffs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No differences found between these versions.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Changes ({diffs.length})
                  </h3>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded"></span>
                      <span>{diffs.filter(d => d.type === 'added').length} Added</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded"></span>
                      <span>{diffs.filter(d => d.type === 'modified').length} Modified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded"></span>
                      <span>{diffs.filter(d => d.type === 'removed').length} Removed</span>
                    </div>
                  </div>
                </div>

                {diffs.map((diff, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {renderDiffBadge(diff.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-2">{diff.field}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              v{olderVersion.version} (Old)
                            </div>
                            <div className={`p-2 rounded font-mono text-xs break-all ${
                              diff.type === 'removed' ? 'bg-red-50 text-red-900' : 'bg-gray-50'
                            }`}>
                              {formatValue(diff.oldValue)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              v{newerVersion.version} (New)
                            </div>
                            <div className={`p-2 rounded font-mono text-xs break-all ${
                              diff.type === 'added' ? 'bg-green-50 text-green-900' : 
                              diff.type === 'modified' ? 'bg-blue-50 text-blue-900' : 'bg-gray-50'
                            }`}>
                              {formatValue(diff.newValue)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedVersion(olderVersion);
                  setCompareVersion(null);
                }}
              >
                View v{olderVersion.version}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedVersion(newerVersion);
                  setCompareVersion(null);
                }}
              >
                View v{newerVersion.version}
              </Button>
            </div>
            <Button
              onClick={() => {
                setSelectedVersion(null);
                setCompareVersion(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading version history...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current version: {currentVersion}. View and restore previous versions below.
        </p>
      </div>

      {versions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No version history available yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {versions.map((version) => (
            <Card key={version.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">Version {version.version}</h3>
                    {version.version === currentVersion && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Modified:</span>{' '}
                      {new Date(version.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Modified By:</span>{' '}
                      {version.modifiedByUser?.name || version.modifiedByUser?.email || version.modifiedBy}
                    </div>
                    <div>
                      <span className="font-medium">Content:</span>{' '}
                      {getVersionSummary(version.data)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (selectedVersion) {
                        setCompareVersion(version);
                      } else {
                        setSelectedVersion(version);
                      }
                    }}
                  >
                    {selectedVersion ? 'Compare' : 'View'}
                  </Button>

                  {version.version !== currentVersion && (
                    <Button
                      size="sm"
                      onClick={() => handleRestore(version.version)}
                      disabled={restoring}
                    >
                      {restoring ? 'Restoring...' : 'Restore'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {renderVersionComparison()}

      {selectedVersion && !compareVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Version {selectedVersion.version} Details
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Modified: {new Date(selectedVersion.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Modified by: {selectedVersion.modifiedByUser?.name || selectedVersion.modifiedByUser?.email || selectedVersion.modifiedBy}
                  </p>
                </div>
                {selectedVersion.version !== currentVersion && (
                  <Button
                    onClick={() => handleRestore(selectedVersion.version)}
                    disabled={restoring}
                    size="sm"
                  >
                    {restoring ? 'Restoring...' : 'Restore This Version'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Summary */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Content Summary</h3>
                  <p className="text-sm text-gray-600">
                    {getVersionSummary(selectedVersion.data)}
                  </p>
                </Card>

                {/* Introduction */}
                {selectedVersion.data.introduction && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Introduction</h3>
                    <p className="text-sm text-gray-700">
                      {selectedVersion.data.introduction}
                    </p>
                  </Card>
                )}

                {/* Coach Notes */}
                {selectedVersion.data.coachNotes && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Coach Notes</h3>
                    <p className="text-sm text-gray-700">
                      {selectedVersion.data.coachNotes}
                    </p>
                  </Card>
                )}

                {/* Exercises */}
                {(selectedVersion.data.exercises || selectedVersion.data.strengthProgram) && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">
                      Exercises ({(selectedVersion.data.exercises || selectedVersion.data.strengthProgram).length})
                    </h3>
                    <div className="space-y-2">
                      {(selectedVersion.data.exercises || selectedVersion.data.strengthProgram).map((ex: any, i: number) => (
                        <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{ex.name}</div>
                          {(ex.sets || ex.reps) && (
                            <div className="text-gray-600 text-xs mt-1">
                              {ex.sets && `${ex.sets} sets`}
                              {ex.sets && ex.reps && ' × '}
                              {ex.reps && `${ex.reps} reps`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Nutrition */}
                {(selectedVersion.data.nutrition || selectedVersion.data.mealPlan) && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">
                      Nutrition ({(selectedVersion.data.nutrition || selectedVersion.data.mealPlan).length} items)
                    </h3>
                    <div className="space-y-2">
                      {(selectedVersion.data.nutrition || selectedVersion.data.mealPlan).map((item: any, i: number) => (
                        <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{item.mealType}</div>
                          {item.foods && (
                            <div className="text-gray-600 text-xs mt-1">
                              {Array.isArray(item.foods) ? item.foods.join(', ') : item.foods}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Raw Data (Collapsible) */}
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-sm text-gray-600 hover:text-gray-900">
                    View Raw JSON Data
                  </summary>
                  <Card className="p-4 bg-gray-50 mt-2">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(selectedVersion.data, null, 2)}
                    </pre>
                  </Card>
                </details>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedVersion(null)}
              >
                Close
              </Button>
              {versions.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Find another version to compare with
                    const otherVersion = versions.find(v => v.version !== selectedVersion.version);
                    if (otherVersion) {
                      setCompareVersion(otherVersion);
                    }
                  }}
                >
                  Compare with Another Version
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
