'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Star, FileText, MessageSquare, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatDateTime, isOverdue } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Submission {
  id: string
  submissionText: string | null
  fileUrl: string | null
  fileName: string | null
  submittedAt: string
  score: number | null
  feedback: string | null
  status: 'PENDING' | 'REVIEWED'
  student: { id: string; name: string; email: string; cohort: string | null }
  assignment: { id: string; title: string; maxScore: number }
}

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  maxScore: number
  course: { id: string; title: string; cohort: string }
  submissions: Submission[]
}

export default function AssignmentReviewPage() {
  const { id } = useParams<{ id: string }>()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [gradeModal, setGradeModal] = useState<Submission | null>(null)
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' })
  const [saving, setSaving] = useState(false)
  const [viewSub, setViewSub] = useState<Submission | null>(null)

  useEffect(() => { loadData() }, [id])

  async function loadData() {
    const res = await fetch(`/api/assignments/${id}`)
    const data = await res.json()
    setAssignment(data)
    setLoading(false)
  }

  function openGrade(sub: Submission) {
    setGradeModal(sub)
    setGradeForm({ score: sub.score !== null ? String(sub.score) : '', feedback: sub.feedback || '' })
  }

  async function handleGrade() {
    if (!gradeModal || gradeForm.score === '') {
      toast.error('Score is required')
      return
    }
    const score = parseInt(gradeForm.score)
    if (isNaN(score) || score < 0 || score > (assignment?.maxScore ?? 100)) {
      toast.error(`Score must be between 0 and ${assignment?.maxScore ?? 100}`)
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/submissions/${gradeModal.id}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, feedback: gradeForm.feedback }),
      })
      if (res.ok) {
        toast.success('Submission graded')
        setGradeModal(null)
        loadData()
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-40 rounded-xl" />
      </div>
    )
  }

  if (!assignment) return <div className="text-[#64748B]">Assignment not found</div>

  const pending = assignment.submissions.filter(s => s.status === 'PENDING').length
  const reviewed = assignment.submissions.filter(s => s.status === 'REVIEWED').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/assignments">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /> Back</Button>
        </Link>
        <div>
          <h1 className="cursor-blink text-xl font-bold text-[#F1F5F9]">{assignment.title}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="amber">{assignment.course.cohort}</Badge>
            <span className="text-xs text-[#94A3B8]">{assignment.course.title}</span>
            <span className="flex items-center gap-1 text-xs text-[#94A3B8]" style={{ fontFamily: 'var(--font-mono)' }}>
              <Calendar size={11} /> due: {formatDateTime(assignment.dueDate)}
            </span>
            {isOverdue(assignment.dueDate) && <Badge variant="danger">Overdue</Badge>}
          </div>
        </div>
      </div>

      {/* Assignment description */}
      <Card>
        <h2 className="text-sm font-medium text-[#94A3B8] mb-2">Assignment Description</h2>
        <p className="text-[#CBD5E1] text-sm whitespace-pre-wrap">{assignment.description}</p>
        <div className="mt-3 flex gap-4 text-xs text-[#94A3B8] flex-wrap">
          <span>Max Score: <span className="text-[#F1F5F9] font-medium">{assignment.maxScore}</span></span>
          <span>Submissions: <span className="text-[#F1F5F9] font-medium">{assignment.submissions.length}</span></span>
          <span>Pending: <span className="text-[#FBBF24] font-medium">{pending}</span></span>
          <span>Reviewed: <span className="text-[#4ADE80] font-medium">{reviewed}</span></span>
        </div>
      </Card>

      {/* Submissions */}
      <div>
        <h2 className="text-lg font-semibold text-[#F1F5F9] mb-4">Submissions</h2>
        {!assignment.submissions.length ? (
          <Card className="text-center py-12">
            <FileText size={36} className="mx-auto mb-2 text-[#475569]" />
            <p className="text-[#94A3B8]">No submissions yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {assignment.submissions.map(sub => (
              <Card key={sub.id} className="hover:border-[rgba(0,212,255,0.25)] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-[#F1F5F9]">{sub.student.name}</span>
                      {sub.student.cohort && <Badge variant="amber">{sub.student.cohort}</Badge>}
                      <Badge variant={sub.status === 'REVIEWED' ? 'success' : 'warning'}>
                        {sub.status}
                      </Badge>
                      {sub.score !== null && (
                        <span className="flex items-center gap-1 text-xs font-medium text-[#4ADE80]">
                          <Star size={11} /> {sub.score}/{assignment.maxScore}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B]">{sub.student.email} · Submitted {formatDateTime(sub.submittedAt)}</p>
                    {sub.submissionText && (
                      <p className="text-sm text-[#94A3B8] mt-2 line-clamp-2">{sub.submissionText}</p>
                    )}
                    {sub.fileUrl && (
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#00D4FF] hover:text-[#33DDFF] mt-1">
                        <Download size={11} /> {sub.fileName || 'Download file'}
                      </a>
                    )}
                    {sub.feedback && (
                      <div className="mt-2 text-xs text-[#94A3B8] bg-[#0D1426] border border-[#1E3A5F] rounded-lg p-2 flex gap-1.5">
                        <MessageSquare size={12} className="shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{sub.feedback}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => setViewSub(sub)}>
                      View
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => openGrade(sub)}>
                      <Star size={14} /> Grade
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Grade modal */}
      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title="Grade Submission">
        {gradeModal && (
          <div className="space-y-4">
            <div className="bg-[#0D1426] border border-[#1E3A5F] rounded-xl p-3">
              <p className="text-sm font-medium text-[#F1F5F9]">{gradeModal.student.name}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Submitted {formatDateTime(gradeModal.submittedAt)}</p>
            </div>
            {gradeModal.submissionText && (
              <div>
                <p className="text-xs font-medium text-[#94A3B8] mb-1">Submission Text</p>
                <div className="bg-[#0D1426] border border-[#1E3A5F] rounded-xl p-3 text-sm text-[#CBD5E1] max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {gradeModal.submissionText}
                </div>
              </div>
            )}
            {gradeModal.fileUrl && (
              <a href={gradeModal.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#00D4FF] hover:text-[#33DDFF]">
                <Download size={14} /> {gradeModal.fileName || 'View submitted file'}
              </a>
            )}
            <Input
              label={`Score (0 – ${assignment.maxScore})`}
              type="number"
              min="0"
              max={assignment.maxScore}
              placeholder="e.g. 85"
              value={gradeForm.score}
              onChange={e => setGradeForm(p => ({ ...p, score: e.target.value }))}
            />
            <Textarea
              label="Feedback (optional)"
              placeholder="Write feedback for the student..."
              rows={3}
              value={gradeForm.feedback}
              onChange={e => setGradeForm(p => ({ ...p, feedback: e.target.value }))}
            />
            <div className="flex gap-3 pt-2">
              <Button onClick={handleGrade} loading={saving} className="flex-1">Submit Grade</Button>
              <Button variant="secondary" onClick={() => setGradeModal(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* View submission modal */}
      <Modal open={!!viewSub} onClose={() => setViewSub(null)} title="Submission Details" className="max-w-2xl">
        {viewSub && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-medium text-[#F1F5F9]">{viewSub.student.name}</p>
                <p className="text-xs text-[#64748B]">{viewSub.student.email}</p>
              </div>
              <Badge variant={viewSub.status === 'REVIEWED' ? 'success' : 'warning'}>{viewSub.status}</Badge>
            </div>
            {viewSub.submissionText && (
              <div>
                <p className="text-xs font-medium text-[#94A3B8] mb-1">Submission Text</p>
                <div className="bg-[#0D1426] border border-[#1E3A5F] rounded-xl p-4 text-sm text-[#CBD5E1] whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {viewSub.submissionText}
                </div>
              </div>
            )}
            {viewSub.fileUrl && (
              <a href={viewSub.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#00D4FF] hover:text-[#33DDFF]">
                <Download size={14} /> {viewSub.fileName || 'Download file'}
              </a>
            )}
            {viewSub.score !== null && (
              <div className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.20)] rounded-xl p-3">
                <p className="text-xs font-medium text-[#4ADE80] mb-1">Score</p>
                <p className="text-lg font-bold text-[#F1F5F9]">{viewSub.score} / {assignment.maxScore}</p>
                {viewSub.feedback && <p className="text-sm text-[#CBD5E1] mt-2">{viewSub.feedback}</p>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
