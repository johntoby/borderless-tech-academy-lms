'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, FileText, Layers, ArrowRight, Terminal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Course {
  id: string; title: string; description: string; cohort: string
  weekNumber: number; createdAt: string; _count: { content: number; assignments: number }
}

const GRADIENTS = [
  'from-[#0EA5E9]/25 via-[#0EA5E9]/5 to-transparent',
  'from-[#F59E0B]/25 via-[#F59E0B]/5 to-transparent',
  'from-[#A78BFA]/25 via-[#A78BFA]/5 to-transparent',
  'from-[#22C55E]/25 via-[#22C55E]/5 to-transparent',
]

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(d => { setCourses(d); setLoading(false) })
  }, [])

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.cohort.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, Course[]>>((a, c) => {
    if (!a[c.cohort]) a[c.cohort] = []
    a[c.cohort].push(c)
    return a
  }, {})

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="cursor-blink text-xl font-bold text-[#F1F5F9] tracking-tight">My Courses</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">Browse your available course materials</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          type="text"
          placeholder="grep --course ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-[#0D1426] border border-[#1E3A5F] hover:border-[#2D5680] rounded-lg text-sm text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.22)] focus:border-[rgba(0,212,255,0.55)] transition-all"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-60 rounded-2xl" />)}
        </div>
      ) : !filtered.length ? (
        <Card className="text-center py-20">
          <BookOpen size={36} className="mx-auto mb-3 text-[#475569]" />
          <p className="text-[#CBD5E1] font-medium">{search ? 'No courses match your search' : 'No courses available yet'}</p>
        </Card>
      ) : (
        <div className="space-y-9">
          {Object.entries(grouped).map(([cohort, cohortCourses]) => (
            <div key={cohort}>
              <div className="flex items-center gap-2 mb-4">
                <Layers size={13} className="text-[#64748B]" />
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>{cohort}</span>
                <span className="text-xs text-[#64748B]">· {cohortCourses.length} course{cohortCourses.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cohortCourses.map((course, i) => (
                  <div
                    key={course.id}
                    className="group bg-[#111827] border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-[rgba(0,212,255,0.35)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,212,255,0.20)] transition-all duration-300 animate-fade-in flex flex-col"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Thumbnail */}
                    <div className={`relative h-28 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-between px-4 overflow-hidden`}>
                      <div className="absolute inset-0 grid-pattern opacity-40" />
                      <Terminal size={28} className="relative text-[#F1F5F9]/25" />
                      <span className="relative text-[10px] text-[#F1F5F9]/40 tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                        wk_{course.weekNumber}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm text-[#F1F5F9] group-hover:text-[#00D4FF] transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h3>
                        <Badge cohort={course.cohort} />
                      </div>
                      <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed mb-3 flex-1">{course.description}</p>

                      <div className="flex items-center gap-3 text-[11px] text-[#64748B] mb-4 flex-wrap">
                        <span className="flex items-center gap-1"><FileText size={10} /> {course._count.content} items</span>
                        <span>{course._count.assignments} assignments</span>
                      </div>

                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          Open Course <ArrowRight size={13} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Badge({ cohort }: { cohort: string }) {
  return (
    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(245,158,11,0.12)] text-[#FBBF24] border border-[rgba(245,158,11,0.32)] whitespace-nowrap">
      {cohort}
    </span>
  )
}
