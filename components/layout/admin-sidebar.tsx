'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  Megaphone, LogOut, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/admin/students',       label: 'Students',       icon: Users },
  { href: '/admin/courses',        label: 'Courses',        icon: BookOpen },
  { href: '/admin/assignments',    label: 'Assignments',    icon: ClipboardList },
  { href: '/admin/announcements',  label: 'Announcements',  icon: Megaphone },
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
          'transition-colors duration-200 shrink-0',
          active ? 'text-[#1D4ED8]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
        )}
      />
      {label}
    </Link>
  )
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

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
              Admin Panel
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
        {navItems.map(item => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname.startsWith(item.href)}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <div className="mx-5 h-px bg-[#E2E8F0]" />

      {/* Sign out */}
      <div className="px-3 py-4">
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

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-[#E2E8F0] h-screen sticky top-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-[#E2E8F0] rounded-lg shadow-sm"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} className="text-[#64748B]" /> : <Menu size={18} className="text-[#64748B]" />}
      </button>

      {/* Mobile drawer */}
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
