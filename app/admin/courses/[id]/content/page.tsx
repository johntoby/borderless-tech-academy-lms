'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Video, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import toast from 'react-hot-toast'

interface ContentItem {
  id: string
  title: string
  type: 'NOTE' | 'VIDEO' | 'RESOURCE'
  url: string
  description: string | null
  order: number
}

interface Course {
  id: string
  title: string
  cohort: string
}

const TYPE_ICONS = {
  NOTE: FileText,
  VIDEO: Video,
  RESOURCE: LinkIcon,
}

const TYPE_COLORS: Record<string, string> = {
  NOTE: 'text-[#60A5FA]',
  VIDEO: 'text-[#FBBF24]',
  RESOURCE: 'text-[#4ADE80]',
}

const TYPE_BG: Record<string, string> = {
  NOTE: 'bg-[rgba(59,130,246,0.10)] border border-[rgba(59,130,246,0.20)]',
  VIDEO: 'bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.22)]',
  RESOURCE: 'bg-[rgba(34,197,94,0.10)] border border-[rgba(34,197,94,0.22)]',
}

const TYPE_BADGE: Record<string, 'info' | 'amber' | 'success'> = {
  NOTE: 'info',
  VIDEO: 'amber',
  RESOURCE: 'success',
}

export default function CourseContentPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ContentItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', type: 'NOTE', url: '', description: '', order: '0' })

  useEffect(() => { loadData() }, [id])

  async function loadData() {
    const [courseRes, contentRes] = await Promise.all([
      fetch(`/api/courses/${id}`),
      fetch(`/api/courses/${id}/content`),
    ])
    const courseData = await courseRes.json()
    const contentData = await contentRes.json()
    setCourse(courseData)
    setContent(contentData)
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm({ title: '', type: 'NOTE', url: '', description: '', order: String(content.length + 1) })
    setModalOpen(true)
  }

  function openEdit(item: ContentItem) {
    setEditing(item)
    setForm({
      title: item.title,
      type: item.type,
      url: item.url,
      description: item.description || '',
      order: String(item.order),
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.url) {
      toast.error('Title and URL are required')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/courses/${id}/content/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, order: parseInt(form.order) }),
        })
        if (res.ok) { toast.success('Content updated'); setModalOpen(false); loadData() }
      } else {
        const res = await fetch(`/api/courses/${id}/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, order: parseInt(form.order) }),
        })
        if (res.ok) { toast.success('Content added'); setModalOpen(false); loadData() }
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(contentId: string) {
    if (!confirm('Delete this content item?')) return
    setDeleting(contentId)
    try {
      const res = await fetch(`/api/courses/${id}/content/${contentId}`, { method: 'DELETE' })
      if (res.ok) {
        setContent(prev => prev.filter(c => c.id !== contentId))
        toast.success('Content deleted')
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/courses">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /> Back</Button>
        </Link>
        <div>
          <h1 className="cursor-blink text-xl font-bold text-[#F1F5F9]">{course?.title || 'Course Content'}</h1>
          {course && <Badge variant="amber" className="mt-1">{course.cohort}</Badge>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[#94A3B8]">{content.length} content item{content.length !== 1 ? 's' : ''}</p>
        <Button onClick={openAdd}><Plus size={16} /> Add Content</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      ) : !content.length ? (
        <Card className="text-center py-16">
          <FileText size={48} className="mx-auto mb-3 text-[#475569]" />
          <p className="text-[#CBD5E1] font-medium">No content yet</p>
          <p className="text-[#94A3B8] text-sm mt-1">Add notes, videos, and resources for students</p>
          <Button className="mt-4" onClick={openAdd}><Plus size={16} /> Add Content</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {content.map(item => {
            const Icon = TYPE_ICONS[item.type]
            return (
              <Card key={item.id} className="flex items-center gap-4 hover:border-[rgba(0,212,255,0.25)] transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TYPE_BG[item.type]}`}>
                  <Icon size={18} className={TYPE_COLORS[item.type]} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#F1F5F9]">{item.title}</span>
                    <Badge variant={TYPE_BADGE[item.type]}>{item.type}</Badge>
                  </div>
                  {item.description && (
                    <p className="text-sm text-[#94A3B8] mt-0.5 truncate">{item.description}</p>
                  )}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00D4FF] hover:text-[#33DDFF] flex items-center gap-1 mt-1 truncate">
                    <ExternalLink size={10} /> {item.url}
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={deleting === item.id}
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Content' : 'Add Content'}>
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Introduction to Linux"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          />
          <Select
            label="Type"
            value={form.type}
            onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            options={[
              { value: 'NOTE', label: 'Note / Document' },
              { value: 'VIDEO', label: 'Video' },
              { value: 'RESOURCE', label: 'Resource / Link' },
            ]}
          />
          <Input
            label="URL"
            type="url"
            placeholder="https://youtube.com/watch?v=... or https://docs.google.com/..."
            value={form.url}
            onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
          />
          <Textarea
            label="Description (optional)"
            placeholder="Brief description of this content..."
            rows={2}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          />
          <Input
            label="Order"
            type="number"
            min="0"
            value={form.order}
            onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
          />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={saving} className="flex-1">Save</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
