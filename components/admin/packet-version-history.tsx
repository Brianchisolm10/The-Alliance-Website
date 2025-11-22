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
  createdAt: Date;
}

interface PacketVersionHistoryProps {
  packetId: string;
  currentVersion: number;
  onRestore: () => void;
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

  const renderVersionComparison = () => {
    if (!selectedVersion || !compareVersion) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Version Comparison</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comparing v{selectedVersion.version} with v{compareVersion.version}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  Version {selectedVersion.version}
                </h3>
                <Card className="p-4 bg-gray-50">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(selectedVersion.data, null, 2)}
                  </pre>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold mb-3">
                  Version {compareVersion.version}
                </h3>
                <Card className="p-4 bg-gray-50">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(compareVersion.data, null, 2)}
                  </pre>
                </Card>
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end">
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
                      {version.modifiedBy}
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
              <h2 className="text-2xl font-bold">
                Version {selectedVersion.version} Details
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Modified: {new Date(selectedVersion.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <Card className="p-4 bg-gray-50">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(selectedVersion.data, null, 2)}
                </pre>
              </Card>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedVersion(null)}
              >
                Close
              </Button>
              {selectedVersion.version !== currentVersion && (
                <Button
                  onClick={() => handleRestore(selectedVersion.version)}
                  disabled={restoring}
                >
                  {restoring ? 'Restoring...' : 'Restore This Version'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
