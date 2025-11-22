'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PacketStatus, PacketType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getAllPacketsForAdmin, generatePacketPDF } from '@/app/actions/packet-storage';

interface PacketWithUser {
  id: string;
  type: PacketType;
  status: PacketStatus;
  version: number;
  fileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
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
}

export default function PacketReviewPage() {
  const [packets, setPackets] = useState<PacketWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PacketStatus[]>([
    PacketStatus.DRAFT,
    PacketStatus.UNPUBLISHED,
  ]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPackets();
  }, [statusFilter, typeFilter]);

  const loadPackets = async () => {
    setLoading(true);
    const result = await getAllPacketsForAdmin({
      status: statusFilter.length > 0 ? statusFilter : undefined,
    });

    if (result.success && result.packets) {
      setPackets(result.packets as any);
    }
    setLoading(false);
  };

  const handleGeneratePDF = async (packetId: string) => {
    if (!confirm('Generate PDF for this packet? This may take a moment.')) {
      return;
    }

    const result = await generatePacketPDF(packetId);

    if (result.success) {
      alert('PDF generated successfully!');
      loadPackets();
    } else {
      alert(`Failed to generate PDF: ${result.error}`);
    }
  };

  const filteredPackets = packets.filter((packet) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      packet.user.name?.toLowerCase().includes(query) ||
      packet.user.email.toLowerCase().includes(query) ||
      packet.type.toLowerCase().includes(query)
    );
  });

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

  const formatPacketType = (type: PacketType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Packet Review Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Review and edit draft and unpublished packets
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search by client name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Types</option>
              {Object.values(PacketType).map((type) => (
                <option key={type} value={type}>
                  {formatPacketType(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter.join(',')}
              onChange={(e) => {
                const values = e.target.value.split(',').filter(Boolean);
                setStatusFilter(values as PacketStatus[]);
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value={[PacketStatus.DRAFT, PacketStatus.UNPUBLISHED].join(',')}>
                Draft & Unpublished
              </option>
              <option value={PacketStatus.DRAFT}>Draft Only</option>
              <option value={PacketStatus.UNPUBLISHED}>Unpublished Only</option>
              <option value={Object.values(PacketStatus).join(',')}>All Statuses</option>
            </select>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('');
                setStatusFilter([PacketStatus.DRAFT, PacketStatus.UNPUBLISHED]);
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Packets</div>
          <div className="text-2xl font-bold">{filteredPackets.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Draft</div>
          <div className="text-2xl font-bold text-yellow-600">
            {filteredPackets.filter((p) => p.status === PacketStatus.DRAFT).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Unpublished</div>
          <div className="text-2xl font-bold text-orange-600">
            {filteredPackets.filter((p) => p.status === PacketStatus.UNPUBLISHED).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Needs Review</div>
          <div className="text-2xl font-bold text-blue-600">
            {
              filteredPackets.filter(
                (p) => p.status === PacketStatus.DRAFT || p.status === PacketStatus.UNPUBLISHED
              ).length
            }
          </div>
        </Card>
      </div>

      {/* Packet List */}
      {loading ? (
        <div className="text-center py-12">Loading packets...</div>
      ) : filteredPackets.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium">No packets found</p>
            <p className="text-sm mt-1">
              Try adjusting your filters or check back later
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPackets.map((packet) => (
            <Card key={packet.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {formatPacketType(packet.type)}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusBadgeColor(
                        packet.status
                      )}`}
                    >
                      {packet.status}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      v{packet.version}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Client:</span>{' '}
                      {packet.user.name || 'Unknown'} ({packet.user.email})
                    </div>
                    {packet.user.population && (
                      <div>
                        <span className="font-medium">Population:</span>{' '}
                        {packet.user.population.replace(/_/g, ' ')}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {new Date(packet.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(packet.updatedAt).toLocaleDateString()}
                    </div>
                    {packet.modifier && (
                      <div>
                        <span className="font-medium">Last Modified By:</span>{' '}
                        {packet.modifier.name || 'Unknown'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!packet.fileUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGeneratePDF(packet.id)}
                    >
                      Generate PDF
                    </Button>
                  )}
                  {packet.fileUrl && (
                    <Link
                      href={packet.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline">
                        View PDF
                      </Button>
                    </Link>
                  )}
                  <Link href={`/admin/packets/${packet.id}`}>
                    <Button size="sm">Review & Edit</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
