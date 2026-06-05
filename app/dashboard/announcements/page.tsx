'use client'

import { useEffect, useState } from 'react'
import { Megaphone, Rss } from 'lucide-react'
import { Card } from '@/components/ui/card'
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
        <h1 className="text-xl font-bold text-white tracking-tight">Announcements</h1>
        <p className="text-sm text-slate-500 mt-0.5">Updates and news from your instructors</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>
      ) : !announcements.length ? (
        <Card className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Rss size={24} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">No announcements yet</p>
          <p className="text-slate-600 text-sm mt-1">Check back later for updates from your instructors</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div
              key={a.id}
              className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-4 hover:border-slate-600 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Megaphone size={15} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm mb-1.5">{a.title}</h3>
                  <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">{a.body}</p>
                  <p className="text-xs text-slate-600 mt-3">
                    <span className="text-slate-500">{a.author.name}</span>
                    {' · '}
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
