'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PacketStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PacketEditor } from '@/components/admin/packet-editor';
import { PacketVersionHistory } from '@/components/admin/packet-version-history';
import {
  getPacketForEditing,
  publishPacket,
  unpublishPacket,
  addCoachNotes,
} from '@/app/actions/packet-editing';
import { generatePacketPDF, regeneratePDF } from '@/app/actions/packet-storage';
import { AnyPacketContent } from '@/lib/pdf/types';

interface PacketData {
  id: string;
  type: string;
  status: PacketStatus;
  version: number;
  data: AnyPacketContent;
  fileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    population: string | null;
  };
  modifier: {
    id: string;
    name: string | null;
  } | null;
  publisher: {
    id: string;
    name: string | null;
  } | null;
  versions: any[];
}

export default function PacketEditPage() {
  const params = useParams();
  const router = useRouter();
  const packetId = params.id as string;

  const [packet, setPacket] = useState<PacketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
  const [coachNotes, setCoachNotes] = useState('');
  const [showNotesEditor, setShowNotesEditor] = useState(false);

  useEffect(() => {
    loadPacket();
  }, [packetId]);

  const loadPacket = async () => {
    setLoading(true);
    const result = await getPacketForEditing(packetId);

    if (result.success && result.data) {
      setPacket(result.data as any);
      const data = result.data.data as any;
      setCoachNotes(data?.coachNotes || '');
    } else {
      alert(result.error || 'Failed to load packet');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this packet?\n\n• The packet will be visible to the client\n• The client will receive an email notification\n• The packet can be unpublished later if needed')) {
      return;
    }

    setSaving(true);
    const result = await publishPacket(packetId);

    if (result.success) {
      alert('✓ Packet published successfully!\n\nThe client has been notified via email and can now access the packet in their portal.');
      loadPacket();
    } else {
      alert(result.error || 'Failed to publish packet');
    }
    setSaving(false);
  };

  const handleUnpublish = async () => {
    if (!confirm('Are you sure you want to unpublish this packet?\n\n• The packet will be hidden from the client\n• You can make revisions and republish\n• The client will NOT be notified')) {
      return;
    }

    setSaving(true);
    const result = await unpublishPacket(packetId);

    if (result.success) {
      alert('✓ Packet unpublished successfully!\n\nThe packet is now hidden from the client and marked as UNPUBLISHED.');
      loadPacket();
    } else {
      alert(result.error || 'Failed to unpublish packet');
    }
    setSaving(false);
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    const result = await addCoachNotes(packetId, coachNotes);

    if (result.success) {
      alert('Coach notes saved successfully!');
      setShowNotesEditor(false);
      loadPacket();
    } else {
      alert(result.error || 'Failed to save notes');
    }
    setSaving(false);
  };

  const handleGeneratePDF = async () => {
    if (!confirm('Generate PDF for this packet? This may take a moment.')) {
      return;
    }

    setGeneratingPDF(true);
    const result = await generatePacketPDF(packetId);

    if (result.success) {
      alert('✓ PDF generated successfully!\n\nThe PDF is now available for download.');
      loadPacket();
    } else {
      alert(`Failed to generate PDF: ${result.error}`);
    }
    setGeneratingPDF(false);
  };

  const handleRegeneratePDF = async () => {
    if (!confirm('Regenerate PDF for this packet? This will replace the existing PDF.')) {
      return;
    }

    setGeneratingPDF(true);
    const result = await regeneratePDF(packetId);

    if (result.success) {
      alert('✓ PDF regenerated successfully!');
      loadPacket();
    } else {
      alert(`Failed to regenerate PDF: ${result.error}`);
    }
    setGeneratingPDF(false);
  };

  const getStatusBadgeColor = (status: PacketStatus) => {
    switch (status) {
      case PacketStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case PacketStatus.UNPUBLISHED:
        return 'bg-orange-100 text-orange-800';
      case PacketStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case PacketStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">Loading packet...</div>
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <p className="text-red-600">Packet not found</p>
          <Button onClick={() => router.push('/admin/packets')} className="mt-4">
            Back to Packets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/packets')}
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold">
            {packet.type.replace(/_/g, ' ')} Packet
          </h1>
          <span className={`px-3 py-1 text-sm rounded ${getStatusBadgeColor(packet.status)}`}>
            {packet.status}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
            Version {packet.version}
          </span>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-medium">Client:</span> {packet.user.name || 'Unknown'} (
            {packet.user.email})
          </div>
          {packet.user.population && (
            <div>
              <span className="font-medium">Population:</span>{' '}
              {packet.user.population.replace(/_/g, ' ')}
            </div>
          )}
          <div>
            <span className="font-medium">Last Updated:</span>{' '}
            {new Date(packet.updatedAt).toLocaleString()}
          </div>
          {packet.modifier && (
            <div>
              <span className="font-medium">Last Modified By:</span>{' '}
              {packet.modifier.name || 'Unknown'}
            </div>
          )}
          {packet.publishedAt && (
            <div>
              <span className="font-medium">Published:</span>{' '}
              {new Date(packet.publishedAt).toLocaleString()}
              {packet.publisher && ` by ${packet.publisher.name || 'Unknown'}`}
            </div>
          )}
        </div>
      </div>

      {/* Status Alert */}
      {packet.status === PacketStatus.DRAFT && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Draft Packet</h3>
              <p className="text-sm text-yellow-800">
                This packet is in draft status. Review and edit the content, then publish it to make it available to the client.
              </p>
            </div>
          </div>
        </div>
      )}

      {packet.status === PacketStatus.UNPUBLISHED && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-orange-600 mt-0.5">📝</div>
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">Unpublished Changes</h3>
              <p className="text-sm text-orange-800">
                This packet has been edited and is currently unpublished. The client cannot see these changes until you publish again.
              </p>
            </div>
          </div>
        </div>
      )}

      {packet.status === PacketStatus.PUBLISHED && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-green-600 mt-0.5">✓</div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Published</h3>
              <p className="text-sm text-green-800">
                This packet is live and visible to the client. They can download and view it in their portal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {packet.status === PacketStatus.PUBLISHED ? (
          <Button onClick={handleUnpublish} disabled={saving} variant="outline">
            {saving ? 'Unpublishing...' : 'Unpublish for Revisions'}
          </Button>
        ) : (
          <Button onClick={handlePublish} disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? 'Publishing...' : '📤 Publish & Notify Client'}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => setShowNotesEditor(!showNotesEditor)}
        >
          {showNotesEditor ? 'Hide' : 'Add'} Coach Notes
        </Button>

        {/* PDF Actions */}
        <div className="flex gap-2 ml-auto">
          {packet.fileUrl ? (
            <>
              <a
                href={packet.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  📄 View PDF
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegeneratePDF}
                disabled={generatingPDF}
              >
                {generatingPDF ? 'Regenerating...' : '🔄 Regenerate PDF'}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
            >
              {generatingPDF ? 'Generating...' : '📄 Generate PDF'}
            </Button>
          )}
        </div>
      </div>

      {/* Coach Notes Editor */}
      {showNotesEditor && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">Coach Notes</h3>
          <Textarea
            value={coachNotes}
            onChange={(e) => setCoachNotes(e.target.value)}
            rows={4}
            placeholder="Add notes for the client or internal team..."
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveNotes} disabled={saving} size="sm">
              {saving ? 'Saving...' : 'Save Notes'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotesEditor(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'edit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Edit Content
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Version History ({packet.versions.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'edit' ? (
        <PacketEditor
          packet={packet}
          onUpdate={loadPacket}
        />
      ) : (
        <PacketVersionHistory
          packetId={packet.id}
          currentVersion={packet.version}
          onRestore={loadPacket}
        />
      )}
    </div>
  );
}
