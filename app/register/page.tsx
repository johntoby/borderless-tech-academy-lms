'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, Users, ArrowRight, Terminal } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TerminalTypewriter } from '@/components/ui/terminal-typewriter'
import toast from 'react-hot-toast'

const TERMINAL_LINES = [
  'git clone borderless-tech-academy',
  'Cloning into your future…',
  './setup.sh --role=engineer --region=africa',
  '✔ Account ready. Your laptop is your visa.',
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cohort: '' })
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, cohort: form.cohort }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Registration failed') }
      else { toast.success('Account created! Please sign in.'); router.push('/login') }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">

      {/* ── Left panel: terminal hero ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-12 bg-[#0D1426] border-r border-[#1E3A5F]">
        <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)' }}
        />

        <div className="absolute top-8 left-8 w-5 h-5 border-t-2 border-l-2 border-[#00D4FF]/25" />
        <div className="absolute top-8 right-8 w-5 h-5 border-t-2 border-r-2 border-[#00D4FF]/25" />
        <div className="absolute bottom-8 left-8 w-5 h-5 border-b-2 border-l-2 border-[#00D4FF]/25" />
        <div className="absolute bottom-8 right-8 w-5 h-5 border-b-2 border-r-2 border-[#00D4FF]/25" />

        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.png" alt="BTA Logo" width={36} height={36} className="rounded-xl shrink-0 ring-1 ring-[#1E3A5F]" />
          <span
            className="text-[10px] font-semibold text-[#94A3B8] tracking-[0.25em] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Borderless Tech Academy
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <p
              className="text-[9px] text-[#F59E0B] tracking-[0.3em] uppercase mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              Join Cohort 4 — Enrolling Now
            </p>
            <h2
              className="cursor-blink text-5xl font-extrabold leading-[1.05] tracking-tight text-[#F1F5F9]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Build skills.<br />
              <span className="text-gradient">Ship code.</span>
            </h2>
          </div>

          <div className="w-12 h-px bg-[#1E3A5F]" />

          <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[24rem]">
            From zero to deploy-ready: Linux fundamentals, containers, cloud infrastructure and CI/CD pipelines — taught by engineers who&apos;ve shipped to production.
          </p>

          <div className="rounded-xl border border-[#1E3A5F] bg-[#070B16] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#1E3A5F] bg-[#0D1426]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]/70" />
              <span className="ml-2 text-[10px] text-[#64748B]" style={{ fontFamily: 'var(--font-mono)' }}>bta — onboarding</span>
            </div>
            <div className="px-4 py-4 text-xs text-[#94A3B8] min-h-[92px]">
              <TerminalTypewriter lines={TERMINAL_LINES} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Students enrolled', value: '200+' },
              { label: 'Active courses',    value: '12+' },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-lg p-3.5 bg-[#111827] border border-[#1E3A5F] hover:border-[rgba(0,212,255,0.30)] transition-colors duration-200"
              >
                <p className="text-xl font-bold text-[#00D4FF] tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</p>
                <p className="text-[10px] text-[#64748B] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Terminal size={12} className="text-[#64748B]" />
          <span
            className="text-[9px] text-[#64748B] tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Your laptop is your visa.
          </span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0A0F1E] overflow-y-auto">
        <div className="w-full max-w-sm animate-fade-in py-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Image src="/logo.png" alt="BTA Logo" width={32} height={32} className="rounded-lg shrink-0 ring-1 ring-[#1E3A5F]" />
            <div>
              <p className="text-xs font-bold text-[#F1F5F9] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Borderless Tech Academy</p>
              <p className="text-[9px] text-[#00D4FF] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>DevOps Training</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#F1F5F9]">Create your account</h1>
            <p className="text-sm text-[#94A3B8] mt-1.5">Join Borderless Tech Academy today</p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-[rgba(0,212,255,0.4)] via-[rgba(0,212,255,0.10)] to-transparent mb-8" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              placeholder="John Doe"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              icon={<User size={14} />}
              required
            />
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              icon={<Mail size={14} />}
              required
            />
            <Input
              id="cohort"
              label="Cohort"
              placeholder="e.g. Cohort 3"
              value={form.cohort}
              onChange={e => update('cohort', e.target.value)}
              icon={<Users size={14} />}
              hint="Optional — ask your instructor for your cohort name"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Min. 6 chars"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                icon={<Lock size={14} />}
                required
              />
              <Input
                id="confirmPassword"
                label="Confirm"
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                icon={<Lock size={14} />}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
              Create Account <ArrowRight size={15} />
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00D4FF] hover:text-[#33DDFF] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
