'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, FileText, Layers, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Course {
  id: string; title: string; description: string; cohort: string
  weekNumber: number; createdAt: string; _count: { content: number; assignments: number }
}

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
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">My Courses</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Browse your available course materials</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search courses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[rgba(29,78,216,0.18)] focus:border-[rgba(29,78,216,0.40)] transition-all"
        />
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-44 rounded-xl" />)}
        </div>
      ) : !filtered.length ? (
        <Card className="text-center py-20">
          <BookOpen size={36} className="mx-auto mb-3 text-[#CBD5E1]" />
          <p className="text-[#475569] font-medium">{search ? 'No courses match your search' : 'No courses available yet'}</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cohort, cohortCourses]) => (
            <div key={cohort}>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={13} className="text-[#94A3B8]" />
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">{cohort}</span>
                <span className="text-xs text-[#94A3B8]">· {cohortCourses.length} course{cohortCourses.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {cohortCourses.map((course, i) => (
                  <div
                    key={course.id}
                    className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-[rgba(29,78,216,0.25)] hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)] transition-all duration-200 group animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[rgba(29,78,216,0.08)] border border-[rgba(29,78,216,0.12)] flex items-center justify-center shrink-0">
                        <BookOpen size={16} className="text-[#1D4ED8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">{course.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-[#94A3B8] mb-4 flex-wrap">
                      <span>Week {course.weekNumber}</span>
                      <span className="flex items-center gap-1"><FileText size={10} /> {course._count.content} items</span>
                      <span>{course._count.assignments} assignments</span>
                    </div>

                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        Open Course <ArrowRight size={13} />
                      </Button>
                    </Link>
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
