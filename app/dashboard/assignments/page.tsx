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
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Assignments</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Submit your work and track grades</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 p-1 bg-[#F1F5F9] rounded-xl w-fit border border-[#E2E8F0]">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === f.key
                ? 'bg-[#1D4ED8] text-white shadow-sm shadow-[rgba(29,78,216,0.25)]'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white'
            )}
          >
            {f.label}
            <span className={cn('px-1.5 py-0.5 rounded-md text-[10px] tabular-nums', filter === f.key ? 'bg-white/20' : 'bg-[#E2E8F0] text-[#94A3B8]')}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
      ) : !filtered.length ? (
        <Card className="text-center py-16">
          <ClipboardList size={36} className="mx-auto mb-3 text-[#CBD5E1]" />
          <p className="text-[#64748B] text-sm font-medium">{filter !== 'all' ? 'No assignments in this category' : 'No assignments yet'}</p>
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
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-200 animate-fade-in group"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {status === 'graded'    && <CheckCircle size={14} className="text-[#10B981] shrink-0" />}
                      {status === 'submitted' && <Clock size={14} className="text-[#F59E0B] shrink-0" />}
                      {status === 'overdue'   && <AlertCircle size={14} className="text-[#EF4444] shrink-0" />}
                      {status === 'pending'   && <Clock size={14} className={cn('shrink-0', days <= 2 ? 'text-[#F59E0B]' : 'text-[#CBD5E1]')} />}
                      <h3 className="font-semibold text-[#0F172A] text-sm">{a.title}</h3>
                      {status === 'graded' && sub?.score !== null && (
                        <span className="flex items-center gap-1 text-xs font-medium text-[#059669] bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.18)] px-2 py-0.5 rounded-full">
                          <Star size={10} /> {sub?.score}/{a.maxScore}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-1 mb-2">{a.description}</p>
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="text-[#94A3B8]">{a.course.title}</span>
                      <Badge variant="info" className="text-[10px]">{a.course.cohort}</Badge>
                      <span className={cn('flex items-center gap-1', overdue && status === 'pending' ? 'text-[#EF4444]' : 'text-[#94A3B8]')}>
                        <Calendar size={10} />
                        {overdue ? `Closed ${formatDate(a.dueDate)}` : `${days}d · ${formatDate(a.dueDate)}`}
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
