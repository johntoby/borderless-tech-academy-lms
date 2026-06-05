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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
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
        <div className="h-8 w-48 bg-[#1E293B] rounded animate-pulse" />
        <div className="h-48 bg-[#1E293B] rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!assignment) return <div className="text-slate-400">Assignment not found</div>

  const overdue = isOverdue(assignment.dueDate)
  const canSubmit = !overdue || mySubmission !== null

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
          <h1 className="text-xl font-bold text-white">{assignment.title}</h1>
          {overdue && !mySubmission ? (
            <Badge variant="danger">Overdue</Badge>
          ) : mySubmission?.status === 'REVIEWED' ? (
            <Badge variant="success">Graded</Badge>
          ) : mySubmission ? (
            <Badge variant="warning">Submitted</Badge>
          ) : (
            <Badge variant="info">Open</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap mb-4">
          <span>{assignment.course.title}</span>
          <Badge variant="info">{assignment.course.cohort}</Badge>
          <span className={`flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-amber-400'}`}>
            <Calendar size={11} />
            {overdue ? 'Deadline passed' : 'Due'}: {formatDate(assignment.dueDate)}
          </span>
          <span>Max: <strong className="text-white">{assignment.maxScore} pts</strong></span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{assignment.description}</p>
        </div>
      </Card>

      {/* Grade result */}
      {mySubmission?.status === 'REVIEWED' && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3 mb-3">
            <Star size={20} className="text-emerald-400" />
            <h2 className="font-semibold text-white">Your Grade</h2>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {mySubmission.score} <span className="text-lg text-slate-400">/ {assignment.maxScore}</span>
          </div>
          {mySubmission.feedback && (
            <div className="bg-slate-800 rounded-lg p-3 mt-3">
              <p className="text-xs font-medium text-slate-400 mb-1">Instructor Feedback</p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{mySubmission.feedback}</p>
            </div>
          )}
        </Card>
      )}

      {/* Submission area */}
      {!overdue || mySubmission ? (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">
              {mySubmission ? 'Your Submission' : 'Submit Assignment'}
            </h2>
            {mySubmission && (
              <span className="text-xs text-slate-400">
                Submitted {formatDateTime(mySubmission.submittedAt)}
              </span>
            )}
          </div>

          {mySubmission?.status === 'REVIEWED' ? (
            /* Read-only view of submitted content */
            <div className="space-y-3">
              {mySubmission.submissionText && (
                <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap">
                  {mySubmission.submissionText}
                </div>
              )}
              {mySubmission.fileUrl && (
                <a href={mySubmission.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300">
                  <FileText size={14} /> {mySubmission.fileName || 'View file'}
                </a>
              )}
            </div>
          ) : (
            /* Submission form */
            <div className="space-y-4">
              <Textarea
                label="Text submission"
                placeholder="Write your submission here..."
                rows={6}
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={false}
              />

              <div>
                <p className="text-sm font-medium text-slate-300 mb-2">Or upload a file (PDF, DOCX, ZIP — max 10MB)</p>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                    loading={uploading}
                  >
                    <Upload size={14} /> Choose File
                  </Button>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle size={14} />
                      {uploadedFile.fileName}
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-slate-500 hover:text-red-400 ml-1"
                      >×</button>
                    </div>
                  )}
                </div>
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
                <p className="text-xs text-slate-500">Resubmitting will replace your previous submission</p>
              )}
            </div>
          )}
        </Card>
      ) : (
        <Card className="text-center py-10 border-red-500/20">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <p className="text-slate-300 font-medium">Submission Closed</p>
          <p className="text-slate-500 text-sm mt-1">The deadline for this assignment has passed</p>
        </Card>
      )}
    </div>
  )
}
