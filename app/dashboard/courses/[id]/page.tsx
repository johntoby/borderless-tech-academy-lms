'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Video, Link as LinkIcon, ExternalLink, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Content {
  id: string; title: string; type: 'NOTE' | 'VIDEO' | 'RESOURCE'; url: string; description: string | null; order: number
}

interface Course {
  id: string; title: string; description: string; cohort: string; weekNumber: number; content: Content[]
}

const TYPE_CONFIG = {
  NOTE:     { icon: FileText,  color: 'text-[#1D4ED8]',  bg: 'bg-[rgba(29,78,216,0.08)]',   border: 'border-[rgba(29,78,216,0.14)]',   label: 'Note',     badge: 'info' as const },
  VIDEO:    { icon: Video,     color: 'text-[#D97706]',  bg: 'bg-[rgba(245,158,11,0.08)]',  border: 'border-[rgba(245,158,11,0.14)]',  label: 'Video',    badge: 'warning' as const },
  RESOURCE: { icon: LinkIcon,  color: 'text-[#059669]',  bg: 'bg-[rgba(16,185,129,0.08)]',  border: 'border-[rgba(16,185,129,0.14)]',  label: 'Resource', badge: 'success' as const },
}

function ContentItem({ item, index }: { item: Content; index: number }) {
  const cfg = TYPE_CONFIG[item.type]
  const Icon = cfg.icon
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl border',
        'bg-[#F8FAFC] hover:bg-white',
        'border-[#E2E8F0] hover:border-[rgba(29,78,216,0.18)]',
        'hover:shadow-sm transition-all duration-200 group animate-fade-in'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border', cfg.bg, cfg.border)}>
        <Icon size={15} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors truncate">{item.title}</p>
        {item.description && <p className="text-xs text-[#94A3B8] truncate mt-0.5">{item.description}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={cfg.badge} className="hidden sm:flex text-[10px]">{cfg.label}</Badge>
        <ExternalLink size={13} className="text-[#CBD5E1] group-hover:text-[#1D4ED8] transition-colors" />
      </div>
    </a>
  )
}

function Section({ title, items }: { title: string; items: Content[] }) {
  if (!items.length) return null
  return (
    <div>
      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-2">{title}</p>
      <div className="space-y-2">
        {items.map((item, i) => <ContentItem key={item.id} item={item} index={i} />)}
      </div>
    </div>
  )
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/courses/${id}`).then(r => r.json()).then(d => { setCourse(d); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="skeleton h-7 w-48 rounded-lg" />
        <div className="skeleton h-28 rounded-2xl" />
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      </div>
    )
  }

  if (!course) return <div className="text-[#64748B] text-sm">Course not found</div>

  const notes     = course.content.filter(c => c.type === 'NOTE')
  const videos    = course.content.filter(c => c.type === 'VIDEO')
  const resources = course.content.filter(c => c.type === 'RESOURCE')

  return (
    <div className="space-y-5 animate-fade-in">
      <Link href="/dashboard/courses">
        <Button variant="ghost" size="sm"><ArrowLeft size={14} /> Courses</Button>
      </Link>

      {/* Header card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[rgba(29,78,216,0.06)] to-transparent border border-[rgba(29,78,216,0.12)] rounded-2xl p-5">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[rgba(29,78,216,0.04)] to-transparent" />
        <div className="flex items-start gap-4 relative">
          <div className="w-11 h-11 rounded-xl bg-[rgba(29,78,216,0.10)] border border-[rgba(29,78,216,0.16)] flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-[#1D4ED8]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0F172A] leading-snug">{course.title}</h1>
            <p className="text-sm text-[#64748B] mt-1">{course.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="info">{course.cohort}</Badge>
              <span className="text-xs text-[#94A3B8]">Week {course.weekNumber}</span>
              <span className="text-xs text-[#CBD5E1]">·</span>
              <span className="text-xs text-[#94A3B8]">{course.content.length} resource{course.content.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {!course.content.length ? (
        <Card className="text-center py-14">
          <FileText size={36} className="mx-auto mb-3 text-[#CBD5E1]" />
          <p className="text-[#64748B] text-sm">No content available yet</p>
          <p className="text-[#94A3B8] text-xs mt-1">Check back later — the instructor will add materials here</p>
        </Card>
      ) : (
        <Card className="space-y-6">
          <Section title="Lecture Notes" items={notes} />
          {notes.length > 0 && videos.length > 0 && <div className="border-t border-[#E2E8F0]" />}
          <Section title="Video Lectures" items={videos} />
          {(notes.length > 0 || videos.length > 0) && resources.length > 0 && <div className="border-t border-[#E2E8F0]" />}
          <Section title="Resources" items={resources} />
        </Card>
      )}
    </div>
  )
}
