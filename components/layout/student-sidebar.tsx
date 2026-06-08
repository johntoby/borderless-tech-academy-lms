'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, BookOpen, ClipboardList, Megaphone,
  LogOut, Menu, X, Terminal,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',                label: 'Dashboard',      icon: LayoutDashboard, exact: true },
  { href: '/dashboard/courses',        label: 'My Courses',     icon: BookOpen },
  { href: '/dashboard/assignments',    label: 'Assignments',    icon: ClipboardList },
  { href: '/dashboard/announcements',  label: 'Announcements',  icon: Megaphone },
]

function NavLink({ href, label, icon: Icon, active, onClick }: {
  href: string; label: string; icon: React.ElementType; active: boolean; onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
        'transition-all duration-200 group',
        active
          ? 'bg-[rgba(0,212,255,0.08)] text-[#00D4FF]'
          : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]/60'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#00D4FF] rounded-full shadow-[0_0_8px_rgba(0,212,255,0.7)]" />
      )}
      <Icon
        size={16}
        className={cn(
          'transition-colors shrink-0',
          active ? 'text-[#00D4FF]' : 'text-[#64748B] group-hover:text-[#94A3B8]'
        )}
      />
      {label}
    </Link>
  )
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="BTA Logo" width={32} height={32} className="rounded-lg shrink-0 ring-1 ring-[#1E3A5F]" />
          <div>
            <p className="text-[11px] font-bold text-[#F1F5F9] tracking-[0.08em] uppercase leading-tight" style={{ fontFamily: 'var(--font-mono)' }}>
              Borderless Tech
            </p>
            <p className="text-[9px] text-[#00D4FF] font-medium tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              Academy
            </p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-[#1E3A5F]" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p
          className="px-3 mb-3 text-[9px] font-medium text-[#64748B] uppercase tracking-[0.2em] flex items-center gap-1.5"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <Terminal size={10} className="text-[#00D4FF]/60" /> ~/navigation
        </p>
        {navItems.map(item => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <NavLink
              key={item.href}
              {...item}
              active={active}
              onClick={onNavClick}
            />
          )
        })}
      </nav>

      <div className="mx-5 h-px bg-[#1E3A5F]" />

      {/* User + sign out */}
      <div className="px-3 py-4 space-y-1">
        {session?.user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#0D1426] border border-[#1E3A5F] mb-2">
            <div className="w-7 h-7 rounded-full bg-[rgba(0,212,255,0.10)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-[#00D4FF]">
                {session.user.name?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#F1F5F9] truncate leading-tight">{session.user.name}</p>
              <p className="text-[10px] text-[#64748B] truncate">{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:bg-[rgba(239,68,68,0.08)] hover:text-[#F87171] transition-all duration-200 group"
        >
          <LogOut size={15} className="group-hover:text-[#F87171] transition-colors shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export function StudentSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#0D1426] border-r border-[#1E3A5F] h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#111827] border border-[#1E3A5F] rounded-lg shadow-lg"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} className="text-[#94A3B8]" /> : <Menu size={18} className="text-[#94A3B8]" />}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex animate-fade-scale">
          <div className="absolute inset-0 bg-[#020611]/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-60 bg-[#0D1426] border-r border-[#1E3A5F] h-full shadow-2xl">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
