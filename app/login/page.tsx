'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Rocket } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

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
    <div className="min-h-screen bg-[#F8FAFC] flex">

      {/* ── Left panel: deep blue, aspirational ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(145deg, #1E3A8A 0%, #1D4ED8 45%, #2563EB 100%)',
        }}
      >
        {/* Mesh overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow orb */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)' }}
        />

        {/* Corner marks */}
        <div className="absolute top-8 left-8 w-5 h-5 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-8 right-8 w-5 h-5 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-8 left-8 w-5 h-5 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-8 right-8 w-5 h-5 border-b-2 border-r-2 border-white/20" />

        {/* Top logo mark */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.png" alt="BTA Logo" width={36} height={36} className="rounded-xl shrink-0" />
          <span
            className="text-[10px] font-semibold text-white/60 tracking-[0.25em] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Borderless Tech Academy
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div>
            <p
              className="text-[9px] text-[#D4A853] tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              DevOps Training School
            </p>
            <h2
              className="text-6xl font-extrabold leading-[0.92] tracking-tight text-white"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Learn.<br />
              <span style={{ color: '#D4A853' }}>Build.</span><br />
              Earn.
            </h2>
          </div>

          <div className="w-12 h-px bg-white/25" />

          <p className="text-sm text-white/60 leading-relaxed max-w-[22rem]">
            Master Linux, Docker, Kubernetes, CI/CD, and cloud infrastructure. Real-world DevOps training that gets you hired.
          </p>

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
                className="rounded-xl p-3.5"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <p className="text-xl font-bold text-[#D4A853] tabular-nums">{s.value}</p>
                <p className="text-[10px] text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 flex items-center gap-2">
          <Rocket size={12} className="text-white/30" />
          <span
            className="text-[9px] text-white/30 tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Your laptop is your visa.
          </span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/logo.png" alt="BTA Logo" width={32} height={32} className="rounded-lg shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0F172A] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-syne)' }}>Borderless Tech Academy</p>
              <p className="text-[9px] text-[#1D4ED8] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>DevOps Training</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back</h1>
            <p className="text-sm text-[#64748B] mt-1.5">Sign in to your learning dashboard</p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-[rgba(29,78,216,0.4)] via-[rgba(29,78,216,0.10)] to-transparent mb-8" />

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
                className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[0.12em]"
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
                  className="w-full pr-10 pl-3 py-2.5 text-sm bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[rgba(29,78,216,0.18)] focus:border-[rgba(29,78,216,0.40)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-3" size="lg" loading={loading}>
              Sign In <ArrowRight size={15} />
            </Button>
          </form>

          <div className="mt-7 pt-6 border-t border-[#F1F5F9]">
            <p className="text-center text-sm text-[#64748B]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#1D4ED8] hover:text-[#1E40AF] font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <p
            className="mt-5 text-center text-[10px] text-[#CBD5E1] tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            demo: admin@borderlesstech.com · Admin@123
          </p>
        </div>
      </div>
    </div>
  )
}
