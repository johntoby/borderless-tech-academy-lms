'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Star, Upload, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatDateTime, isOverdue } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  maxScore: number
  course: { id: string; title: string; cohort: string }
  submissions: Submission[]
}

interface Submission {
  id: string
  submissionText: string | null
  fileUrl: string | null
  fileName: string | null
  submittedAt: string
  score: number | null
  feedback: string | null
  status: 'PENDING' | 'REVIEWED'
}

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [mySubmission, setMySubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [text, setText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<{ fileUrl: string; fileName: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/assignments/${id}`)
      .then(r => r.json())
      .then(data => {
        setAssignment(data)
        if (data.submissions?.length) {
          const sub = data.submissions[0]
          setMySubmission(sub)
          setText(sub.submissionText || '')
          if (sub.fileUrl) setUploadedFile({ fileUrl: sub.fileUrl, fileName: sub.fileName || 'File' })
        }
        setLoading(false)
      })
  }, [id])

  async function uploadFile(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setUploadedFile(data)
        toast.success('File uploaded')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } finally {
      setUploading(false)
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  async function handleSubmit() {
    if (!text.trim() && !uploadedFile) {
      toast.error('Please add a text submission or upload a file')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/assignments/${id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionText: text.trim() || null,
          fileUrl: uploadedFile?.fileUrl || null,
          fileName: uploadedFile?.fileName || null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setMySubmission(data)
        toast.success('Submitted successfully!')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Submission failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-48 rounded-xl" />
      </div>
    )
  }

  if (!assignment) return <div className="text-[#94A3B8]">Assignment not found</div>

  const overdue = isOverdue(assignment.dueDate)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/assignments">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /> Assignments</Button>
        </Link>
      </div>

      {/* Assignment card */}
      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-[#F1F5F9]">{assignment.title}</h1>
          {overdue && !mySubmission ? (
            <Badge variant="danger">Overdue</Badge>
          ) : mySubmission?.status === 'REVIEWED' ? (
            <Badge variant="success">Graded</Badge>
          ) : mySubmission ? (
            <Badge variant="info">Submitted</Badge>
          ) : (
            <Badge variant="amber">Open</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-[#94A3B8] flex-wrap mb-4">
          <span>{assignment.course.title}</span>
          <Badge variant="amber">{assignment.course.cohort}</Badge>
          <span className={`flex items-center gap-1 font-medium ${overdue ? 'text-[#F87171]' : 'text-[#FBBF24]'}`} style={{ fontFamily: 'var(--font-mono)' }}>
            <Calendar size={11} />
            {overdue ? 'deadline_passed' : 'due'}: {formatDate(assignment.dueDate)}
          </span>
          <span>Max: <strong className="text-[#F1F5F9]">{assignment.maxScore} pts</strong></span>
        </div>
        <div className="bg-[#0D1426] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-sm text-[#CBD5E1] whitespace-pre-wrap">{assignment.description}</p>
        </div>
      </Card>

      {/* Grade result */}
      {mySubmission?.status === 'REVIEWED' && (
        <Card className="border-[rgba(34,197,94,0.30)] bg-[rgba(34,197,94,0.04)]">
          <div className="flex items-center gap-3 mb-3">
            <Star size={20} className="text-[#22C55E]" />
            <h2 className="font-semibold text-[#F1F5F9]">Your Grade</h2>
          </div>
          <div className="text-3xl font-bold text-[#4ADE80] mb-2 tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
            {mySubmission.score} <span className="text-lg text-[#64748B]">/ {assignment.maxScore}</span>
          </div>
          {mySubmission.feedback && (
            <div className="bg-[#0D1426] border border-[#1E3A5F] rounded-xl p-3 mt-3">
              <p className="text-xs font-medium text-[#94A3B8] mb-1">Instructor Feedback</p>
              <p className="text-sm text-[#CBD5E1] whitespace-pre-wrap">{mySubmission.feedback}</p>
            </div>
          )}
        </Card>
      )}

      {/* Submission area */}
      {!overdue || mySubmission ? (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#F1F5F9]">
              {mySubmission ? 'Your Submission' : 'Submit Assignment'}
            </h2>
            {mySubmission && (
              <span className="text-xs text-[#64748B]" style={{ fontFamily: 'var(--font-mono)' }}>
                submitted {formatDateTime(mySubmission.submittedAt)}
              </span>
            )}
          </div>

          {mySubmission?.status === 'REVIEWED' ? (
            <div className="space-y-3">
              {mySubmission.submissionText && (
                <div className="bg-[#0D1426] border border-[#1E3A5F] rounded-xl p-4 text-sm text-[#CBD5E1] whitespace-pre-wrap">
                  {mySubmission.submissionText}
                </div>
              )}
              {mySubmission.fileUrl && (
                <a href={mySubmission.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#00D4FF] hover:text-[#33DDFF]">
                  <FileText size={14} /> {mySubmission.fileName || 'View file'}
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                label="Text submission"
                placeholder="Write your submission here..."
                rows={6}
                value={text}
                onChange={e => setText(e.target.value)}
              />

              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.12em] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  Or upload a file (PDF, DOCX, ZIP — max 10MB)
                </p>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-[#00D4FF] bg-[rgba(0,212,255,0.06)] shadow-[0_0_24px_rgba(0,212,255,0.15)]'
                      : 'border-[#1E3A5F] hover:border-[#2D5680] bg-[#0D1426]'
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${dragOver ? 'bg-[rgba(0,212,255,0.12)] border-[rgba(0,212,255,0.35)]' : 'bg-[#1E293B] border-[#1E3A5F]'}`}>
                    <Upload size={17} className={dragOver ? 'text-[#00D4FF]' : 'text-[#64748B]'} />
                  </div>
                  <p className="text-sm text-[#CBD5E1]">
                    <span className="text-[#00D4FF] font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#64748B]">PDF, DOCX or ZIP up to 10MB</p>

                  {uploading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-[#0D1426]/80 rounded-xl">
                      <span className="w-5 h-5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
                    </span>
                  )}
                </div>
                {uploadedFile && (
                  <div className="flex items-center gap-2 text-sm text-[#4ADE80] mt-3">
                    <CheckCircle size={14} />
                    {uploadedFile.fileName}
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }}
                      className="text-[#64748B] hover:text-[#F87171] ml-1"
                    >×</button>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                loading={submitting}
                disabled={overdue && !mySubmission}
                className="w-full sm:w-auto"
              >
                <Send size={14} />
                {mySubmission ? 'Resubmit' : 'Submit Assignment'}
              </Button>
              {mySubmission && (
                <p className="text-xs text-[#64748B]">Resubmitting will replace your previous submission</p>
              )}
            </div>
          )}
        </Card>
      ) : (
        <Card className="text-center py-10 border-[rgba(239,68,68,0.30)]">
          <AlertCircle size={36} className="mx-auto mb-3 text-[#F87171]" />
          <p className="text-[#CBD5E1] font-medium">Submission Closed</p>
          <p className="text-[#64748B] text-sm mt-1">The deadline for this assignment has passed</p>
        </Card>
      )}
    </div>
  )
}
