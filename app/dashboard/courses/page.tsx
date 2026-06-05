'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, FileText, Layers, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

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
        <h1 className="text-xl font-bold text-white tracking-tight">My Courses</h1>
        <p className="text-sm text-slate-500 mt-0.5">Browse your available course materials</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search courses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/40 transition-all"
        />
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-44 rounded-xl" />)}
        </div>
      ) : !filtered.length ? (
        <Card className="text-center py-20">
          <BookOpen size={36} className="mx-auto mb-3 text-slate-700" />
          <p className="text-slate-400 font-medium">{search ? 'No courses match your search' : 'No courses available yet'}</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cohort, cohortCourses]) => (
            <div key={cohort}>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={13} className="text-slate-600" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{cohort}</span>
                <span className="text-xs text-slate-700">· {cohortCourses.length} course{cohortCourses.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {cohortCourses.map((course, i) => (
                  <div
                    key={course.id}
                    className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-4 hover:border-sky-500/30 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 group animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/15 flex items-center justify-center shrink-0">
                        <BookOpen size={16} className="text-sky-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{course.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-slate-600 mb-4 flex-wrap">
                      <span>Week {course.weekNumber}</span>
                      <span className="flex items-center gap-1"><FileText size={10} /> {course._count.content} items</span>
                      <span>{course._count.assignments} assignments</span>
                    </div>

                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button size="sm" variant="outline" className="w-full group-hover:border-sky-500/40 group-hover:text-sky-400">
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
