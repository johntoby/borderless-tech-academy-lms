'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Calendar, CheckCircle, Clock, AlertCircle, Star, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, isOverdue, getDaysUntil } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Assignment {
  id: string; title: string; description: string; dueDate: string; maxScore: number
  course: { id: string; title: string; cohort: string }; _count: { submissions: number }
}

interface Submission { assignmentId: string; status: 'PENDING' | 'REVIEWED'; score: number | null }

type FilterKey = 'all' | 'pending' | 'submitted' | 'graded'

function dueColor(days: number, overdue: boolean) {
  if (overdue) return 'text-[#F87171]'
  if (days < 1) return 'text-[#F87171]'
  if (days <= 3) return 'text-[#FBBF24]'
  return 'text-[#4ADE80]'
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [subMap, setSubMap] = useState<Map<string, Submission>>(new Map())
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKey>('all')

  useEffect(() => {
    Promise.all([fetch('/api/assignments').then(r => r.json()), fetch('/api/student/dashboard').then(r => r.json())])
      .then(([a, d]) => {
        setAssignments(a)
        const m = new Map<string, Submission>()
        d.mySubmissions?.forEach((s: Submission) => m.set(s.assignmentId, s))
        setSubMap(m); setLoading(false)
      })
  }, [])

  function getStatus(a: Assignment) {
    const sub = subMap.get(a.id)
    if (!sub) return isOverdue(a.dueDate) ? 'overdue' : 'pending'
    return sub.status === 'REVIEWED' ? 'graded' : 'submitted'
  }

  const filtered = assignments.filter(a => {
    const s = getStatus(a)
    if (filter === 'pending') return s === 'pending' || s === 'overdue'
    if (filter === 'submitted') return s === 'submitted'
    if (filter === 'graded') return s === 'graded'
    return true
  })

  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => { const s = getStatus(a); return s === 'pending' || s === 'overdue' }).length,
    submitted: assignments.filter(a => getStatus(a) === 'submitted').length,
    graded: assignments.filter(a => getStatus(a) === 'graded').length,
  }

  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'graded', label: 'Graded' },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="cursor-blink text-xl font-bold text-[#F1F5F9] tracking-tight">Assignments</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">Submit your work and track grades</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 p-1 bg-[#0D1426] rounded-xl w-fit border border-[#1E3A5F]">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === f.key
                ? 'bg-[#00D4FF] text-[#06121F] shadow-[0_0_12px_rgba(0,212,255,0.35)]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]'
            )}
          >
            {f.label}
            <span className={cn('px-1.5 py-0.5 rounded-md text-[10px] tabular-nums', filter === f.key ? 'bg-[#06121F]/15' : 'bg-[#1E293B] text-[#64748B]')}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
      ) : !filtered.length ? (
        <Card className="text-center py-16">
          <ClipboardList size={36} className="mx-auto mb-3 text-[#475569]" />
          <p className="text-[#94A3B8] text-sm font-medium">{filter !== 'all' ? 'No assignments in this category' : 'No assignments yet'}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => {
            const status = getStatus(a)
            const sub = subMap.get(a.id)
            const overdue = isOverdue(a.dueDate)
            const days = getDaysUntil(a.dueDate)

            return (
              <div
                key={a.id}
                className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 hover:border-[#2D5680] hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.4)] transition-all duration-200 animate-fade-in group"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {status === 'graded'    && <CheckCircle size={14} className="text-[#22C55E] shrink-0" />}
                      {status === 'submitted' && <Clock size={14} className="text-[#FBBF24] shrink-0" />}
                      {status === 'overdue'   && <AlertCircle size={14} className="text-[#F87171] shrink-0" />}
                      {status === 'pending'   && <Clock size={14} className={cn('shrink-0', days <= 2 ? 'text-[#FBBF24]' : 'text-[#475569]')} />}
                      <h3 className="font-semibold text-[#F1F5F9] text-sm">{a.title}</h3>
                      {status === 'graded' && sub?.score !== null && (
                        <Badge variant="success" className="gap-1">
                          <Star size={10} /> {sub?.score}/{a.maxScore}
                        </Badge>
                      )}
                      {status === 'pending'   && <Badge variant="amber" dot>Pending</Badge>}
                      {status === 'submitted' && <Badge variant="info" dot>Submitted</Badge>}
                    </div>
                    <p className="text-xs text-[#94A3B8] line-clamp-1 mb-2">{a.description}</p>
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="text-[#64748B]">{a.course.title}</span>
                      <Badge variant="amber" className="text-[10px]">{a.course.cohort}</Badge>
                      <span className={cn('flex items-center gap-1 font-medium', dueColor(days, overdue))} style={{ fontFamily: 'var(--font-mono)' }}>
                        <Calendar size={10} />
                        {overdue ? `closed · ${formatDate(a.dueDate)}` : `${days}d · ${formatDate(a.dueDate)}`}
                      </span>
                    </div>
                  </div>
                  <Link href={`/dashboard/assignments/${a.id}`} className="shrink-0">
                    <Button
                      size="sm"
                      variant={status === 'pending' && !overdue ? 'primary' : 'secondary'}
                    >
                      {status === 'graded' ? 'View Grade' : status === 'submitted' ? 'View' : 'Submit'}
                      <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
