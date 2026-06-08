'use client'

import { useEffect, useState } from 'react'
import { Megaphone, Rss } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'

interface Announcement {
  id: string; title: string; body: string; createdAt: string; author: { name: string }
}

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/announcements').then(r => r.json()).then(d => { setAnnouncements(d); setLoading(false) })
  }, [])

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="cursor-blink text-xl font-bold text-[#F1F5F9] tracking-tight">Announcements</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">Updates and news from your instructors</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>
      ) : !announcements.length ? (
        <Card className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-[#1E3A5F] flex items-center justify-center mx-auto mb-4">
            <Rss size={24} className="text-[#64748B]" />
          </div>
          <p className="text-[#CBD5E1] font-medium">No announcements yet</p>
          <p className="text-[#94A3B8] text-sm mt-1">Check back later for updates from your instructors</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div
              key={a.id}
              className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 hover:border-[rgba(167,139,250,0.30)] hover:shadow-[0_0_20px_rgba(167,139,250,0.08)] transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(167,139,250,0.10)] border border-[rgba(167,139,250,0.22)] flex items-center justify-center shrink-0 mt-0.5">
                  <Megaphone size={15} className="text-[#A78BFA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 className="font-semibold text-[#F1F5F9] text-sm">{a.title}</h3>
                    <Badge variant="info" className="text-[10px]">Posted by {a.author.name}</Badge>
                  </div>
                  <p className="text-sm text-[#94A3B8] whitespace-pre-wrap leading-relaxed">{a.body}</p>
                  <p className="text-[11px] text-[#64748B] mt-3" style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatDateTime(a.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
