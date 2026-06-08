'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Plus, Eye, Trash2, Calendar, BookOpen, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { formatDate, isOverdue, getDaysUntil } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Assignment {
  id: string; title: string; description: string; dueDate: string; maxScore: number; createdAt: string
  course: { id: string; title: string; cohort: string }; _count: { submissions: number }
}

interface Course { id: string; title: string; cohort: string }

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState({ courseId: '', title: '', description: '', dueDate: '', maxScore: '100' })

  useEffect(() => {
    Promise.all([fetch('/api/assignments').then(r => r.json()), fetch('/api/courses').then(r => r.json())])
      .then(([a, c]) => { setAssignments(a); setCourses(c); if (c.length) setForm(p => ({ ...p, courseId: c[0].id })); setLoading(false) })
  }, [])

  async function handleCreate() {
    if (!form.courseId || !form.title || !form.description || !form.dueDate) { toast.error('All fields are required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, maxScore: parseInt(form.maxScore) }),
      })
      if (res.ok) {
        const d = await res.json(); setAssignments(p => [d, ...p]); setModalOpen(false); toast.success('Assignment created')
      } else { const d = await res.json(); toast.error(d.error || 'Failed') }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this assignment and all submissions?')) return
    setDeleting(id)
    try {
      if ((await fetch(`/api/assignments/${id}`, { method: 'DELETE' })).ok) {
        setAssignments(p => p.filter(a => a.id !== id)); toast.success('Deleted')
      }
    } finally { setDeleting(null) }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="cursor-blink text-xl font-bold text-[#F1F5F9] tracking-tight">Assignments</h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">{assignments.length} assignment{assignments.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={14} /> New Assignment
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
      ) : !assignments.length ? (
        <Card className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-[#1E3A5F] flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={24} className="text-[#64748B]" />
          </div>
          <p className="text-[#CBD5E1] font-medium">No assignments yet</p>
          <Button className="mt-5" onClick={() => setModalOpen(true)}><Plus size={14} /> Create Assignment</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => {
            const overdue = isOverdue(a.dueDate)
            const days = getDaysUntil(a.dueDate)
            return (
              <div
                key={a.id}
                className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 hover:border-[#2D5680] hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.4)] transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-[#F1F5F9] text-sm">{a.title}</h3>
                      {overdue
                        ? <Badge variant="danger" dot>Overdue</Badge>
                        : days <= 3
                          ? <Badge variant="warning" dot>Due soon</Badge>
                          : <Badge variant="info">Open</Badge>
                      }
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#94A3B8] flex-wrap">
                      <span className="flex items-center gap-1"><BookOpen size={11} /> {a.course.title}</span>
                      <Badge variant="amber">{a.course.cohort}</Badge>
                      <span className={`flex items-center gap-1 font-medium ${overdue ? 'text-[#F87171]' : 'text-[#94A3B8]'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                        <Clock size={11} /> {overdue ? `closed · ${formatDate(a.dueDate)}` : `${days}d · ${formatDate(a.dueDate)}`}
                      </span>
                      <span>{a._count.submissions} submitted</span>
                      <span>/{a.maxScore} pts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/admin/assignments/${a.id}`}>
                      <Button size="sm" variant="secondary"><Eye size={13} /> Review</Button>
                    </Link>
                    <Button size="sm" variant="danger" loading={deleting === a.id} onClick={() => handleDelete(a.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Assignment">
        <div className="space-y-4">
          <Select label="Course" value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
            options={courses.map(c => ({ value: c.id, label: `${c.title} (${c.cohort})` }))} />
          <Input label="Title" placeholder="Assignment title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <Textarea label="Description / Instructions" placeholder="Detailed instructions for students…" rows={5}
            value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="datetime-local" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            <Input label="Max Score" type="number" min="1" value={form.maxScore} onChange={e => setForm(p => ({ ...p, maxScore: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleCreate} loading={saving} className="flex-1">Create</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
