'use client'

import { useEffect, useState } from 'react'
import { Users, Search, ShieldCheck, ShieldOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Student {
  id: string; name: string; email: string; cohort: string | null
  status: 'ACTIVE' | 'SUSPENDED'; createdAt: string; _count: { submissions: number }
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/students').then(r => r.json()).then(d => { setStudents(d); setLoading(false) })
  }, [])

  async function toggleStatus(s: Student) {
    const newStatus = s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    setUpdating(s.id)
    try {
      const res = await fetch(`/api/admin/students/${s.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setStudents(prev => prev.map(x => x.id === s.id ? { ...x, status: newStatus } : x))
        toast.success(`Student ${newStatus === 'ACTIVE' ? 'approved' : 'suspended'}`)
      } else toast.error('Failed to update')
    } finally { setUpdating(null) }
  }

  const filtered = students.filter(s =>
    [s.name, s.email, s.cohort ?? ''].some(v => v.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Students</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Manage all registered student accounts</p>
      </div>

      {/* Summary strip */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total',     value: students.length,                                       color: 'text-[#0F172A]' },
          { label: 'Active',    value: students.filter(s => s.status === 'ACTIVE').length,    color: 'text-[#10B981]' },
          { label: 'Suspended', value: students.filter(s => s.status === 'SUSPENDED').length, color: 'text-[#EF4444]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className={`text-lg font-bold tabular-nums ${s.color}`}>{s.value}</span>
            <span className="text-xs text-[#64748B]">{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0]">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search students…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[rgba(29,78,216,0.18)] focus:border-[rgba(29,78,216,0.40)] transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : !filtered.length ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border border-[#E2E8F0] rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={18} className="text-[#CBD5E1]" />
            </div>
            <p className="text-sm font-medium text-[#64748B]">{search ? 'No results found' : 'No students yet'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-left">
                  {['Student', 'Email', 'Cohort', 'Submissions', 'Joined', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[rgba(29,78,216,0.08)] border border-[rgba(29,78,216,0.14)] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#1D4ED8]">{s.name[0]}</span>
                        </div>
                        <span className="font-medium text-[#0F172A]">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#64748B] text-xs">{s.email}</td>
                    <td className="px-4 py-3">
                      {s.cohort ? <Badge variant="info">{s.cohort}</Badge> : <span className="text-[#CBD5E1]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[#475569] tabular-nums">{s._count.submissions}</td>
                    <td className="px-4 py-3 text-[#64748B] text-xs whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)' }}>{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                        {s.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant={s.status === 'ACTIVE' ? 'danger' : 'secondary'}
                        onClick={() => toggleStatus(s)}
                        loading={updating === s.id}
                      >
                        {s.status === 'ACTIVE'
                          ? <><ShieldOff size={13} /> Suspend</>
                          : <><ShieldCheck size={13} /> Approve</>
                        }
                      </Button>
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
