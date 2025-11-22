'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import {
  sendClientEmail,
  getEmailTemplates,
} from '@/app/actions/client-communication'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  message: string
}

interface EmailClientSectionProps {
  clientId: string
  clientEmail: string
  clientName: string
}

export function EmailClientSection({
  clientId,
  clientEmail,
  clientName,
}: EmailClientSectionProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    const result = await getEmailTemplates()
    if (result.success && result.data) {
      setTemplates(result.data)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSubject(template.subject)
      setMessage(template.message)
    }
  }

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please provide both subject and message')
      return
    }

    setLoading(true)
    setSent(false)

    const result = await sendClientEmail(
      clientId,
      subject,
      message,
      selectedTemplate || undefined
    )

    if (result.success) {
      setSent(true)
      // Clear form after 3 seconds
      setTimeout(() => {
        setSubject('')
        setMessage('')
        setSelectedTemplate('')
        setSent(false)
      }, 3000)
    } else {
      alert(result.error || 'Failed to send email')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Send Email to {clientName}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Sending to: <span className="font-medium">{clientEmail}</span>
        </p>

        <div className="space-y-4">
          {/* Template Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Template (Optional)
            </label>
            <Select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Choose a template to pre-fill the subject and message
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={10}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your message will be formatted in a professional email template
            </p>
          </div>

          {/* Success Message */}
          {sent && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                ✓ Email sent successfully!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSubject('')
                setMessage('')
                setSelectedTemplate('')
              }}
              disabled={loading}
            >
              Clear
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={loading || !subject.trim() || !message.trim()}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Email Templates Reference */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Templates
        </h3>
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-3 bg-gray-50 rounded border border-gray-200"
            >
              <p className="text-sm font-medium text-gray-900">{template.name}</p>
              <p className="text-xs text-gray-600 mt-1">
                Subject: {template.subject}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
