'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, BookOpen, ClipboardList, Megaphone,
  LogOut, Menu, X,
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
        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
        'transition-all duration-200 group',
        active
          ? 'bg-[rgba(29,78,216,0.08)] text-[#1D4ED8]'
          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-[#1D4ED8] rounded-full" />
      )}
      <Icon
        size={16}
        className={cn(
          'transition-colors shrink-0',
          active ? 'text-[#1D4ED8]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
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
          <Image src="/logo.png" alt="BTA Logo" width={32} height={32} className="rounded-lg shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-[#0F172A] tracking-[0.08em] uppercase leading-tight" style={{ fontFamily: 'var(--font-syne)' }}>
              Borderless Tech
            </p>
            <p className="text-[9px] text-[#1D4ED8] font-medium tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              Academy
            </p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-[#E2E8F0]" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p
          className="px-3 mb-3 text-[9px] font-medium text-[#CBD5E1] uppercase tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Navigation
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

      <div className="mx-5 h-px bg-[#E2E8F0]" />

      {/* User + sign out */}
      <div className="px-3 py-4 space-y-1">
        {session?.user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-2">
            <div className="w-7 h-7 rounded-full bg-[rgba(29,78,216,0.10)] border border-[rgba(29,78,216,0.18)] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-[#1D4ED8]">
                {session.user.name?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#0F172A] truncate leading-tight">{session.user.name}</p>
              <p className="text-[10px] text-[#94A3B8] truncate">{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-[rgba(239,68,68,0.06)] hover:text-[#EF4444] transition-all duration-200 group"
        >
          <LogOut size={15} className="group-hover:text-[#EF4444] transition-colors shrink-0" />
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
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-[#E2E8F0] h-screen sticky top-0 shadow-sm">
        <SidebarContent />
      </aside>

      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-[#E2E8F0] rounded-lg shadow-sm"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} className="text-[#64748B]" /> : <Menu size={18} className="text-[#64748B]" />}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex animate-fade-scale">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-60 bg-white border-r border-[#E2E8F0] h-full shadow-xl">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
