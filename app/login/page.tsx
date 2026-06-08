'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Terminal } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TerminalTypewriter } from '@/components/ui/terminal-typewriter'
import toast from 'react-hot-toast'

const TERMINAL_LINES = [
  'whoami',
  'borderless_engineer — status: building the future',
  'echo $VISA',
  '"Your laptop is your visa."',
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
      } else {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        router.push(session?.user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">

      {/* ── Left panel: terminal hero ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-12 bg-[#0D1426] border-r border-[#1E3A5F]">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

        {/* Glow orbs */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
        />

        {/* Corner marks */}
        <div className="absolute top-8 left-8 w-5 h-5 border-t-2 border-l-2 border-[#00D4FF]/25" />
        <div className="absolute top-8 right-8 w-5 h-5 border-t-2 border-r-2 border-[#00D4FF]/25" />
        <div className="absolute bottom-8 left-8 w-5 h-5 border-b-2 border-l-2 border-[#00D4FF]/25" />
        <div className="absolute bottom-8 right-8 w-5 h-5 border-b-2 border-r-2 border-[#00D4FF]/25" />

        {/* Top logo mark */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.png" alt="BTA Logo" width={36} height={36} className="rounded-xl shrink-0 ring-1 ring-[#1E3A5F]" />
          <span
            className="text-[10px] font-semibold text-[#94A3B8] tracking-[0.25em] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Borderless Tech Academy
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div>
            <p
              className="text-[9px] text-[#F59E0B] tracking-[0.3em] uppercase mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              DevOps Training School — Lagos, NG
            </p>
            <h2
              className="cursor-blink text-5xl font-extrabold leading-[1.05] tracking-tight text-[#F1F5F9]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Your laptop<br />
              is <span className="text-gradient">your visa.</span>
            </h2>
          </div>

          <div className="w-12 h-px bg-[#1E3A5F]" />

          <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[24rem]">
            Master Linux, Docker, Kubernetes, CI/CD, and cloud infrastructure. Real-world DevOps training built for Africa&apos;s next generation of engineers.
          </p>

          {/* Terminal window */}
          <div className="rounded-xl border border-[#1E3A5F] bg-[#070B16] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#1E3A5F] bg-[#0D1426]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]/70" />
              <span className="ml-2 text-[10px] text-[#64748B]" style={{ fontFamily: 'var(--font-mono)' }}>bta — zsh</span>
            </div>
            <div className="px-4 py-4 text-xs text-[#94A3B8] min-h-[92px]">
              <TerminalTypewriter lines={TERMINAL_LINES} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Students enrolled', value: '200+' },
              { label: 'Active courses',    value: '12+' },
              { label: 'Cohorts run',       value: '4' },
              { label: 'Completion rate',   value: '94%' },
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

        {/* Bottom tagline */}
        <div className="relative z-10 flex items-center gap-2">
          <Terminal size={12} className="text-[#64748B]" />
          <span
            className="text-[9px] text-[#64748B] tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            DevOps · Linux · Docker · AWS · Kubernetes · CI/CD
          </span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0A0F1E]">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/logo.png" alt="BTA Logo" width={32} height={32} className="rounded-lg shrink-0 ring-1 ring-[#1E3A5F]" />
            <div>
              <p className="text-xs font-bold text-[#F1F5F9] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Borderless Tech Academy</p>
              <p className="text-[9px] text-[#00D4FF] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>DevOps Training</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#F1F5F9]">Welcome back</h1>
            <p className="text-sm text-[#94A3B8] mt-1.5">Sign in to your learning dashboard</p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-[rgba(0,212,255,0.4)] via-[rgba(0,212,255,0.10)] to-transparent mb-8" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.12em]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full pr-10 pl-3 py-2.5 text-sm bg-[#0D1426] border border-[#1E3A5F] hover:border-[#2D5680] rounded-lg text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.22)] focus:border-[rgba(0,212,255,0.55)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-3" size="lg" loading={loading}>
              Sign In <ArrowRight size={15} />
            </Button>
          </form>

          <div className="mt-7 pt-6 border-t border-[#1E293B]">
            <p className="text-center text-sm text-[#94A3B8]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#00D4FF] hover:text-[#33DDFF] font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <p
            className="mt-5 text-center text-[10px] text-[#475569] tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            demo: admin@borderlesstech.com · Admin@123
          </p>
        </div>
      </div>
    </div>
  )
}
