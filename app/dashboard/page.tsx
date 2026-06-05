'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { BookOpen, ClipboardList, Megaphone, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getDaysUntil, isOverdue } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DashboardData {
  courses: Array<{ id: string; title: string; cohort: string; weekNumber: number }>
  upcomingAssignments: Array<{ id: string; title: string; dueDate: string; course: { title: string } }>
  mySubmissions: Array<{ assignmentId: string; status: string; score: number | null }>
  announcements: Array<{ id: string; title: string; body: string; createdAt: string; author: { name: string } }>
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/dashboard').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  const subMap = new Map(data?.mySubmissions.map(s => [s.assignmentId, s]))
  const firstName = session?.user?.name?.split(' ')[0] ?? ''

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome header */}
      <div className="pb-6 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">
          Welcome back{firstName ? (
            <>, <span className="text-[#1D4ED8]">{firstName}</span></>
          ) : ''}
        </h1>
        <p className="text-sm text-[#64748B] mt-1.5">
          {data?.courses?.length
            ? `${data.courses.length} course${data.courses.length !== 1 ? 's' : ''} available · Keep learning`
            : 'Your learning journey starts here'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: assignments + courses */}
        <div className="lg:col-span-2 space-y-5">

          {/* Upcoming assignments */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(29,78,216,0.08)] flex items-center justify-center">
                  <ClipboardList size={13} className="text-[#1D4ED8]" />
                </div>
                <h2 className="text-sm font-semibold text-[#0F172A]">Upcoming Assignments</h2>
              </div>
              <Link href="/dashboard/assignments">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
            <div className="px-5 py-3">
              {loading ? (
                <div className="space-y-2.5 py-2">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-11" />)}
                </div>
              ) : !data?.upcomingAssignments?.length ? (
                <div className="text-center py-10">
                  <CheckCircle size={24} className="mx-auto mb-2 text-[#10B981] opacity-40" />
                  <p className="text-sm text-[#64748B]">All caught up — no upcoming assignments</p>
                </div>
              ) : (
                <div className="space-y-0.5 py-1">
                  {data.upcomingAssignments.map(a => {
                    const sub = subMap.get(a.id)
                    const days = getDaysUntil(a.dueDate)
                    const overdue = isOverdue(a.dueDate)
                    return (
                      <Link href={`/dashboard/assignments/${a.id}`} key={a.id}>
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            {sub ? (
                              <CheckCircle size={14} className="text-[#10B981] shrink-0" />
                            ) : overdue ? (
                              <AlertCircle size={14} className="text-[#EF4444] shrink-0" />
                            ) : (
                              <Clock size={14} className={cn('shrink-0', days <= 2 ? 'text-[#F59E0B]' : 'text-[#CBD5E1]')} />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#475569] group-hover:text-[#0F172A] transition-colors truncate">{a.title}</p>
                              <p className="text-xs text-[#94A3B8] truncate">{a.course.title}</p>
                            </div>
                          </div>
                          <div className="shrink-0 ml-3">
                            {sub ? (
                              <Badge variant="success" dot>Submitted</Badge>
                            ) : overdue ? (
                              <Badge variant="danger" dot>Overdue</Badge>
                            ) : (
                              <span
                                className={cn('text-xs font-medium', days <= 2 ? 'text-[#F59E0B]' : 'text-[#94A3B8]')}
                                style={{ fontFamily: 'var(--font-mono)' }}
                              >
                                {days}d left
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* My Courses */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(16,185,129,0.08)] flex items-center justify-center">
                  <BookOpen size={13} className="text-[#10B981]" />
                </div>
                <h2 className="text-sm font-semibold text-[#0F172A]">My Courses</h2>
              </div>
              <Link href="/dashboard/courses">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16" />)}
                </div>
              ) : !data?.courses?.length ? (
                <div className="text-center py-10">
                  <BookOpen size={24} className="mx-auto mb-2 text-[#CBD5E1]" />
                  <p className="text-sm text-[#64748B]">No courses available yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.courses.slice(0, 4).map(c => (
                    <Link href={`/dashboard/courses/${c.id}`} key={c.id}>
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[rgba(29,78,216,0.22)] hover:bg-white hover:shadow-sm transition-all group">
                        <p className="text-sm font-medium text-[#475569] group-hover:text-[#0F172A] transition-colors line-clamp-2 leading-snug">{c.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="info" className="text-[10px]">{c.cohort}</Badge>
                          <span
                            className="text-[10px] text-[#94A3B8]"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            Wk {c.weekNumber}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: announcements */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[rgba(139,92,246,0.08)] flex items-center justify-center">
                <Megaphone size={13} className="text-[#8B5CF6]" />
              </div>
              <h2 className="text-sm font-semibold text-[#0F172A]">Announcements</h2>
            </div>
            <Link href="/dashboard/announcements">
              <Button variant="ghost" size="sm" className="text-xs">
                All <ArrowRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="px-4 py-3 space-y-2">
            {loading ? (
              <div className="space-y-2.5">
                {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-20" />)}
              </div>
            ) : !data?.announcements?.length ? (
              <div className="text-center py-10">
                <Megaphone size={22} className="mx-auto mb-2 text-[#CBD5E1]" />
                <p className="text-sm text-[#64748B]">No announcements</p>
              </div>
            ) : (
              data.announcements.map(a => (
                <div key={a.id} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white transition-colors">
                  <p className="text-sm font-medium text-[#0F172A] leading-snug">{a.title}</p>
                  <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">{a.body}</p>
                  <p
                    className="text-[10px] text-[#94A3B8] mt-2"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {formatDate(a.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
