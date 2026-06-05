'use client'

import { useEffect, useState } from 'react'
import { Megaphone, Plus, Trash2, Rss } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Announcement {
  id: string; title: string; body: string; createdAt: string; author: { name: string }
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', body: '' })

  useEffect(() => {
    fetch('/api/announcements').then(r => r.json()).then(d => { setAnnouncements(d); setLoading(false) })
  }, [])

  async function handleCreate() {
    if (!form.title || !form.body) { toast.error('Title and body are required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) {
        const d = await res.json()
        setAnnouncements(p => [d, ...p])
        setModalOpen(false); setForm({ title: '', body: '' }); toast.success('Posted')
      }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return
    setDeleting(id)
    try {
      if ((await fetch(`/api/announcements/${id}`, { method: 'DELETE' })).ok) {
        setAnnouncements(p => p.filter(a => a.id !== id)); toast.success('Deleted')
      }
    } finally { setDeleting(null) }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Announcements</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Broadcast updates to all students</p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={14} /> New Announcement
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      ) : !announcements.length ? (
        <Card className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
            <Rss size={24} className="text-[#94A3B8]" />
          </div>
          <p className="text-[#475569] font-medium">No announcements yet</p>
          <p className="text-[#94A3B8] text-sm mt-1">Post your first update for students</p>
          <Button className="mt-5" onClick={() => setModalOpen(true)}><Plus size={14} /> Post Announcement</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div
              key={a.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-200 animate-fade-in group"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(29,78,216,0.08)] border border-[rgba(29,78,216,0.12)] flex items-center justify-center shrink-0 mt-0.5">
                  <Megaphone size={14} className="text-[#1D4ED8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[#0F172A] text-sm">{a.title}</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={deleting === a.id}
                      onClick={() => handleDelete(a.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#94A3B8] hover:text-[#EF4444]"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                  <p className="text-sm text-[#64748B] mt-1 whitespace-pre-wrap line-clamp-3">{a.body}</p>
                  <p className="text-xs text-[#94A3B8] mt-2">
                    {a.author.name} · {formatDateTime(a.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <div className="space-y-4">
          <Input label="Title" placeholder="Announcement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <Textarea label="Body" placeholder="Write your message…" rows={6} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} />
          <div className="flex gap-3 pt-1">
            <Button onClick={handleCreate} loading={saving} className="flex-1">Post</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
