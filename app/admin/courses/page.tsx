'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Plus, Pencil, Trash2, FileText, Layers } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Course {
  id: string; title: string; description: string; cohort: string
  weekNumber: number; isPublished: boolean; createdAt: string
  _count: { content: number; assignments: number }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', cohort: '', weekNumber: '1', isPublished: false })

  useEffect(() => { load() }, [])

  async function load() {
    const d = await fetch('/api/courses').then(r => r.json())
    setCourses(d); setLoading(false)
  }

  function openCreate() {
    setEditCourse(null)
    setForm({ title: '', description: '', cohort: '', weekNumber: '1', isPublished: false })
    setModalOpen(true)
  }

  function openEdit(c: Course) {
    setEditCourse(c)
    setForm({ title: c.title, description: c.description, cohort: c.cohort, weekNumber: String(c.weekNumber), isPublished: c.isPublished })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.description || !form.cohort) { toast.error('Title, description and cohort are required'); return }
    setSaving(true)
    try {
      const url = editCourse ? `/api/courses/${editCourse.id}` : '/api/courses'
      const res = await fetch(url, {
        method: editCourse ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, weekNumber: parseInt(form.weekNumber) }),
      })
      if (res.ok) { toast.success(editCourse ? 'Course updated' : 'Course created'); setModalOpen(false); load() }
      else { const d = await res.json(); toast.error(d.error || 'Save failed') }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course? All content and assignments will be removed.')) return
    setDeleting(id)
    try {
      if ((await fetch(`/api/courses/${id}`, { method: 'DELETE' })).ok) {
        setCourses(p => p.filter(c => c.id !== id)); toast.success('Deleted')
      }
    } finally { setDeleting(null) }
  }

  const grouped = courses.reduce<Record<string, Course[]>>((a, c) => {
    if (!a[c.cohort]) a[c.cohort] = []
    a[c.cohort].push(c)
    return a
  }, {})

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Courses</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={14} /> New Course
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-44 rounded-xl" />)}
        </div>
      ) : !courses.length ? (
        <Card className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-[#94A3B8]" />
          </div>
          <p className="text-[#475569] font-medium">No courses yet</p>
          <p className="text-[#94A3B8] text-sm mt-1">Create your first course to get started</p>
          <Button className="mt-5" onClick={openCreate}><Plus size={14} /> Create Course</Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cohort, cohortCourses]) => (
            <div key={cohort}>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-[#94A3B8]" />
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">{cohort}</span>
                <span className="text-xs text-[#94A3B8]">({cohortCourses.length})</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {cohortCourses.map(c => (
                  <div
                    key={c.id}
                    className={cn(
                      'bg-white border rounded-xl p-4 transition-all duration-200',
                      'hover:border-[#CBD5E1] hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)]',
                      c.isPublished ? 'border-[#E2E8F0]' : 'border-[#E2E8F0] opacity-90'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-[#0F172A] text-sm">{c.title}</span>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-2">{c.description}</p>
                      </div>
                      <Badge variant={c.isPublished ? 'success' : 'outline'} dot={c.isPublished}>
                        {c.isPublished ? 'Live' : 'Draft'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-4 flex-wrap">
                      <span>Week {c.weekNumber}</span>
                      <span className="flex items-center gap-1"><FileText size={11} /> {c._count.content}</span>
                      <span>{c._count.assignments} assignment{c._count.assignments !== 1 ? 's' : ''}</span>
                      <span className="ml-auto text-[#CBD5E1]">{formatDate(c.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${c.id}/content`} className="flex-1">
                        <Button size="sm" variant="secondary" className="w-full">
                          <FileText size={13} /> Content
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                        <Pencil size={13} />
                      </Button>
                      <Button size="sm" variant="danger" loading={deleting === c.id} onClick={() => handleDelete(c.id)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editCourse ? 'Edit Course' : 'New Course'}>
        <div className="space-y-4">
          <Input label="Course Title" placeholder="DevOps Cohort 3 — Linux Week" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <Textarea label="Description" placeholder="What students will learn…" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cohort" placeholder="Cohort 3" value={form.cohort} onChange={e => setForm(p => ({ ...p, cohort: e.target.value }))} />
            <Input label="Week" type="number" min="1" value={form.weekNumber} onChange={e => setForm(p => ({ ...p, weekNumber: e.target.value }))} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className={cn('w-9 h-5 rounded-full transition-colors relative', form.isPublished ? 'bg-[#1D4ED8]' : 'bg-[#E2E8F0]')}>
              <input type="checkbox" className="sr-only" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} />
              <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow', form.isPublished ? 'translate-x-4' : 'translate-x-0.5')} />
            </div>
            <span className="text-sm text-[#475569]">Publish (visible to students)</span>
          </label>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleSave} loading={saving} className="flex-1">Save</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
