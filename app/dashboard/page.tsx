'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { BookOpen, ClipboardList, Megaphone, Clock, CheckCircle, AlertCircle, ArrowRight, Bell } from 'lucide-react'
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

  const pendingCount = data
    ? data.upcomingAssignments.filter(a => !subMap.has(a.id)).length
    : 0

  const statTiles = [
    {
      label: 'Enrolled Courses',
      value: data?.courses.length ?? 0,
      icon: BookOpen,
      color: 'text-[#00D4FF]',
      bg: 'bg-[rgba(0,212,255,0.08)]',
      ring: 'hover:border-[rgba(0,212,255,0.35)] hover:shadow-[0_0_0_1px_rgba(0,212,255,0.15),0_8px_24px_-4px_rgba(0,212,255,0.12)]',
    },
    {
      label: 'Pending Assignments',
      value: pendingCount,
      icon: ClipboardList,
      color: 'text-[#FBBF24]',
      bg: 'bg-[rgba(245,158,11,0.10)]',
      ring: 'hover:border-[rgba(245,158,11,0.35)] hover:shadow-[0_0_0_1px_rgba(245,158,11,0.15),0_8px_24px_-4px_rgba(245,158,11,0.14)]',
    },
    {
      label: 'Announcements',
      value: data?.announcements.length ?? 0,
      icon: Megaphone,
      color: 'text-[#A78BFA]',
      bg: 'bg-[rgba(167,139,250,0.10)]',
      ring: 'hover:border-[rgba(167,139,250,0.35)] hover:shadow-[0_0_0_1px_rgba(167,139,250,0.15),0_8px_24px_-4px_rgba(167,139,250,0.14)]',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top bar / greeting */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#1E3A5F]">
        <div>
          <h1 className="cursor-blink text-2xl font-bold text-[#F1F5F9] leading-tight">
            Welcome back{firstName ? (
              <>, <span className="text-[#00D4FF]">{firstName}</span></>
            ) : ''}
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1.5">
            {data?.courses?.length
              ? `${data.courses.length} course${data.courses.length !== 1 ? 's' : ''} available · keep shipping`
              : 'Your learning journey starts here'
            }
          </p>
        </div>
        <button className="relative shrink-0 p-2.5 rounded-lg bg-[#111827] border border-[#1E3A5F] text-[#94A3B8] hover:text-[#00D4FF] hover:border-[rgba(0,212,255,0.35)] transition-all duration-200">
          <Bell size={16} />
          {!!data?.announcements?.length && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_6px_rgba(0,212,255,0.8)]" />
          )}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statTiles.map(({ label, value, icon: Icon, color, bg, ring }) => (
          <div
            key={label}
            className={cn(
              'bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden',
              ring
            )}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent" />
            <div className="flex items-center gap-4">
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.04] group-hover:scale-105 transition-transform duration-300', bg)}>
                <Icon size={20} className={color} />
              </div>
              <div>
                {loading ? (
                  <div className="skeleton h-7 w-10 mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-[#F1F5F9] tabular-nums">{value}</p>
                )}
                <p className="text-xs text-[#94A3B8] leading-tight">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: assignments + courses */}
        <div className="lg:col-span-2 space-y-5">

          {/* Upcoming assignments */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(0,212,255,0.08)] flex items-center justify-center">
                  <ClipboardList size={13} className="text-[#00D4FF]" />
                </div>
                <h2 className="text-sm font-semibold text-[#F1F5F9]">Upcoming Assignments</h2>
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
                  <CheckCircle size={24} className="mx-auto mb-2 text-[#22C55E] opacity-50" />
                  <p className="text-sm text-[#94A3B8]">All caught up — no upcoming assignments</p>
                </div>
              ) : (
                <div className="space-y-0.5 py-1">
                  {data.upcomingAssignments.map(a => {
                    const sub = subMap.get(a.id)
                    const days = getDaysUntil(a.dueDate)
                    const overdue = isOverdue(a.dueDate)
                    return (
                      <Link href={`/dashboard/assignments/${a.id}`} key={a.id}>
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1E293B]/50 transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            {sub ? (
                              <CheckCircle size={14} className="text-[#22C55E] shrink-0" />
                            ) : overdue ? (
                              <AlertCircle size={14} className="text-[#F87171] shrink-0" />
                            ) : (
                              <Clock size={14} className={cn('shrink-0', days <= 2 ? 'text-[#FBBF24]' : 'text-[#475569]')} />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#CBD5E1] group-hover:text-[#F1F5F9] transition-colors truncate">{a.title}</p>
                              <p className="text-xs text-[#64748B] truncate">{a.course.title}</p>
                            </div>
                          </div>
                          <div className="shrink-0 ml-3">
                            {sub ? (
                              <Badge variant="success" dot>Submitted</Badge>
                            ) : overdue ? (
                              <Badge variant="danger" dot>Overdue</Badge>
                            ) : (
                              <span
                                className={cn('text-xs font-medium', days <= 2 ? 'text-[#FBBF24]' : 'text-[#64748B]')}
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
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(34,197,94,0.08)] flex items-center justify-center">
                  <BookOpen size={13} className="text-[#4ADE80]" />
                </div>
                <h2 className="text-sm font-semibold text-[#F1F5F9]">My Courses</h2>
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
                  <BookOpen size={24} className="mx-auto mb-2 text-[#475569]" />
                  <p className="text-sm text-[#94A3B8]">No courses available yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.courses.slice(0, 4).map(c => (
                    <Link href={`/dashboard/courses/${c.id}`} key={c.id}>
                      <div className="p-3.5 rounded-xl bg-[#0D1426] border border-[#1E3A5F] hover:border-[rgba(0,212,255,0.30)] hover:bg-[#111827] hover:shadow-[0_0_16px_rgba(0,212,255,0.08)] transition-all group">
                        <p className="text-sm font-medium text-[#CBD5E1] group-hover:text-[#F1F5F9] transition-colors line-clamp-2 leading-snug">{c.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="amber" className="text-[10px]">{c.cohort}</Badge>
                          <span
                            className="text-[10px] text-[#64748B]"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            wk_{c.weekNumber}
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

        {/* Right: announcements + activity */}
        <div className="space-y-5">
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(167,139,250,0.08)] flex items-center justify-center">
                  <Megaphone size={13} className="text-[#A78BFA]" />
                </div>
                <h2 className="text-sm font-semibold text-[#F1F5F9]">Announcements</h2>
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
                  <Megaphone size={22} className="mx-auto mb-2 text-[#475569]" />
                  <p className="text-sm text-[#94A3B8]">No announcements</p>
                </div>
              ) : (
                data.announcements.map(a => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-[#0D1426] border border-[#1E3A5F] hover:border-[#2D5680] hover:bg-[#111827] transition-colors">
                    <p className="text-sm font-medium text-[#F1F5F9] leading-snug">{a.title}</p>
                    <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">{a.body}</p>
                    <p
                      className="text-[10px] text-[#64748B] mt-2"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {formatDate(a.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent activity */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(0,212,255,0.08)] flex items-center justify-center">
                  <Clock size={13} className="text-[#00D4FF]" />
                </div>
                <h2 className="text-sm font-semibold text-[#F1F5F9]">Recent Activity</h2>
              </div>
            </div>
            <div className="px-5 py-4">
              {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-8" />)}</div>
              ) : !data?.mySubmissions?.length ? (
                <p className="text-sm text-[#64748B] text-center py-6">No activity yet — your submissions will show up here</p>
              ) : (
                <ul className="space-y-3">
                  {data.mySubmissions.slice(0, 5).map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs">
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        s.status === 'REVIEWED' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
                      )} />
                      <span className="text-[#94A3B8]">
                        {s.status === 'REVIEWED'
                          ? <>Assignment graded {s.score !== null && <span className="text-[#4ADE80] font-medium">— {s.score} pts</span>}</>
                          : 'Submission awaiting review'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
