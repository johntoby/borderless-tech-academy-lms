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
    iconColor: 'text-[#D4A853]',
    iconBg: 'bg-[rgba(212,168,83,0.10)]',
    accent: '#D4A853',
  },
  {
    key: 'totalCourses',
    label: 'Total Courses',
    icon: BookOpen,
    iconColor: 'text-[#34C9A0]',
    iconBg: 'bg-[rgba(52,201,160,0.10)]',
    accent: '#34C9A0',
  },
  {
    key: 'pendingSubmissions',
    label: 'Pending Reviews',
    icon: ClipboardList,
    iconColor: 'text-[#E68B35]',
    iconBg: 'bg-[rgba(230,139,53,0.10)]',
    accent: '#E68B35',
  },
  {
    key: 'recentStudents',
    label: 'New This Week',
    icon: UserCheck,
    iconColor: 'text-[#9B72EA]',
    iconBg: 'bg-[rgba(155,114,234,0.10)]',
    accent: '#9B72EA',
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
          <p
            className="text-[9px] text-[#45455A] tracking-[0.25em] uppercase mb-1.5"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            // Admin
          </p>
          <h1 className="text-xl font-bold text-[#DDDDE8] tracking-tight">Dashboard</h1>
        </div>
        <div
          className="flex items-center gap-2 text-[10px] text-[#45455A] bg-[#111116] px-3 py-1.5 rounded-lg border border-[#1D1D26]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C9A0] animate-pulse shrink-0" />
          Live data
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, iconColor, iconBg, accent, isLength }) => (
          <div
            key={key}
            className="bg-[#111116] border border-[#1D1D26] hover:border-[#282835] rounded-2xl p-5 transition-all duration-200 relative overflow-hidden group"
          >
            {/* Accent top line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
                <Icon size={16} className={iconColor} />
              </div>
            </div>
            {loading ? (
              <div className="skeleton h-8 w-14 mb-1.5" />
            ) : (
              <p className="text-3xl font-bold text-[#DDDDE8] tabular-nums leading-none mb-1.5">
                {getValue(key, isLength)}
              </p>
            )}
            <p className="text-xs text-[#45455A]">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent students */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p
              className="text-[9px] text-[#45455A] tracking-[0.2em] uppercase mb-1"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              // Recent
            </p>
            <h2 className="text-sm font-semibold text-[#DDDDE8]">Recently Registered</h2>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : !stats?.recentStudents?.length ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border border-[#1D1D26] rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={18} className="text-[#32324A]" />
            </div>
            <p className="text-sm text-[#45455A]">No students registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  {['Student', 'Email', 'Cohort', 'Joined'].map(h => (
                    <th
                      key={h}
                      className="pb-3 px-2 text-[10px] font-semibold text-[#45455A] uppercase tracking-wider"
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
                      'hover:bg-[#17171D] transition-colors group',
                      i !== stats.recentStudents.length - 1 && 'border-b border-[#1D1D26]'
                    )}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[rgba(212,168,83,0.10)] border border-[rgba(212,168,83,0.15)] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#D4A853]">{s.name[0]}</span>
                        </div>
                        <span className="font-medium text-[#DDDDE8] group-hover:text-white transition-colors">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[#45455A] text-xs hidden sm:table-cell">{s.email}</td>
                    <td className="py-3 px-2">
                      {s.cohort
                        ? <Badge variant="info" dot>{s.cohort}</Badge>
                        : <span className="text-[#32324A] text-xs">—</span>
                      }
                    </td>
                    <td className="py-3 px-2 text-[#45455A] text-xs hidden md:table-cell" style={{ fontFamily: 'var(--font-mono)' }}>
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
