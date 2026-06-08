'use client'

import { useEffect, useState } from 'react'
import { Users, BookOpen, ClipboardList, UserCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Stats {
  totalStudents: number
  totalCourses: number
  pendingSubmissions: number
  recentStudents: Array<{ id: string; name: string; email: string; cohort: string | null; createdAt: string }>
}

const statCards = [
  {
    key: 'totalStudents',
    label: 'Total Students',
    icon: Users,
    iconColor: 'text-[#00D4FF]',
    iconBg: 'bg-[rgba(0,212,255,0.10)]',
    accent: '#00D4FF',
  },
  {
    key: 'totalCourses',
    label: 'Total Courses',
    icon: BookOpen,
    iconColor: 'text-[#4ADE80]',
    iconBg: 'bg-[rgba(34,197,94,0.10)]',
    accent: '#22C55E',
  },
  {
    key: 'pendingSubmissions',
    label: 'Pending Reviews',
    icon: ClipboardList,
    iconColor: 'text-[#FBBF24]',
    iconBg: 'bg-[rgba(245,158,11,0.10)]',
    accent: '#F59E0B',
  },
  {
    key: 'recentStudents',
    label: 'New This Week',
    icon: UserCheck,
    iconColor: 'text-[#A78BFA]',
    iconBg: 'bg-[rgba(167,139,250,0.10)]',
    accent: '#A78BFA',
    isLength: true,
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function getValue(key: string, isLength?: boolean) {
    if (!stats) return 0
    const v = stats[key as keyof Stats]
    if (isLength && Array.isArray(v)) return v.length
    return typeof v === 'number' ? v : 0
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="cursor-blink text-xl font-bold text-[#F1F5F9] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">Overview of your academy</p>
        </div>
        <div
          className="flex items-center gap-2 text-[10px] text-[#94A3B8] bg-[#111827] px-3 py-1.5 rounded-lg border border-[#1E3A5F]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
          live_data
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, iconColor, iconBg, accent, isLength }) => (
          <div
            key={key}
            className="bg-[#111827] border border-[#1E3A5F] hover:border-[#2D5680] rounded-2xl p-5 transition-all duration-200 relative overflow-hidden group"
          >
            {/* Accent top line on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center border border-white/[0.04] group-hover:scale-105 transition-transform duration-300', iconBg)}>
                <Icon size={16} className={iconColor} />
              </div>
            </div>
            {loading ? (
              <div className="skeleton h-8 w-14 mb-1.5" />
            ) : (
              <p className="text-3xl font-bold text-[#F1F5F9] tabular-nums leading-none mb-1.5">
                {getValue(key, isLength)}
              </p>
            )}
            <p className="text-xs text-[#94A3B8]">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent students */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Recently Registered</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Latest students to join</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : !stats?.recentStudents?.length ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border border-[#1E3A5F] rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={18} className="text-[#475569]" />
            </div>
            <p className="text-sm text-[#94A3B8]">No students registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  {['Student', 'Email', 'Cohort', 'Joined'].map(h => (
                    <th
                      key={h}
                      className="pb-3 px-2 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentStudents.map((s, i) => (
                  <tr
                    key={s.id}
                    className={cn(
                      'hover:bg-[#1E293B]/40 transition-colors group',
                      i !== stats.recentStudents.length - 1 && 'border-b border-[#1E3A5F]'
                    )}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[rgba(0,212,255,0.10)] border border-[rgba(0,212,255,0.22)] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#00D4FF]">{s.name[0]}</span>
                        </div>
                        <span className="font-medium text-[#F1F5F9]">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[#94A3B8] text-xs hidden sm:table-cell">{s.email}</td>
                    <td className="py-3 px-2">
                      {s.cohort
                        ? <Badge variant="info" dot>{s.cohort}</Badge>
                        : <span className="text-[#475569] text-xs">—</span>
                      }
                    </td>
                    <td className="py-3 px-2 text-[#64748B] text-xs hidden md:table-cell" style={{ fontFamily: 'var(--font-mono)' }}>
                      {formatDate(s.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
