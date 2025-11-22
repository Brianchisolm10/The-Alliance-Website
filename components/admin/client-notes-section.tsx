'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  createClientNote,
  updateClientNote,
  deleteClientNote,
} from '@/app/actions/client-communication'

interface Note {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    email: string
  }
}

interface ClientNotesSectionProps {
  clientId: string
  notes: Note[]
  onUpdate: () => void
}

export function ClientNotesSection({
  clientId,
  notes,
  onUpdate,
}: ClientNotesSectionProps) {
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateNote = async () => {
    if (!newNote.trim()) return

    setLoading(true)
    const result = await createClientNote(clientId, newNote)

    if (result.success) {
      setNewNote('')
      onUpdate()
    } else {
      alert(result.error || 'Failed to create note')
    }

    setLoading(false)
  }

  const handleStartEdit = (note: Note) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return

    setLoading(true)
    const result = await updateClientNote(noteId, editContent)

    if (result.success) {
      setEditingNoteId(null)
      setEditContent('')
      onUpdate()
    } else {
      alert(result.error || 'Failed to update note')
    }

    setLoading(false)
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    setLoading(true)
    const result = await deleteClientNote(noteId)

    if (result.success) {
      onUpdate()
    } else {
      alert(result.error || 'Failed to delete note')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Create Note */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
        <div className="space-y-4">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add an internal note about this client..."
            rows={4}
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button onClick={handleCreateNote} disabled={loading || !newNote.trim()}>
              {loading ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Notes Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notes Timeline ({notes.length})
        </h3>
        {notes.length === 0 ? (
          <p className="text-gray-500 text-sm">No notes yet</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      disabled={loading}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateNote(note.id)}
                        disabled={loading || !editContent.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {note.author.name || note.author.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleString()}
                          {note.updatedAt !== note.createdAt && ' (edited)'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(note)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
