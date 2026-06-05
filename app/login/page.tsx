'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Terminal } from 'lucide-react'
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
    <div className="min-h-screen bg-[#07070A] flex">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#0B0B0F] border-r border-[#1D1D26] flex-col justify-between p-12">

        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,168,83,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,168,83,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Corner marks */}
        <div className="absolute top-8 left-8 w-5 h-5 border-t-2 border-l-2 border-[rgba(212,168,83,0.35)]" />
        <div className="absolute top-8 right-8 w-5 h-5 border-t-2 border-r-2 border-[rgba(212,168,83,0.35)]" />
        <div className="absolute bottom-8 left-8 w-5 h-5 border-b-2 border-l-2 border-[rgba(212,168,83,0.35)]" />
        <div className="absolute bottom-8 right-8 w-5 h-5 border-b-2 border-r-2 border-[rgba(212,168,83,0.35)]" />

        {/* Top logo mark */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.png" alt="BTA Logo" width={36} height={36} className="rounded-xl shrink-0" />
          <span
            className="text-[10px] font-semibold text-[#65657A] tracking-[0.25em] uppercase"
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
              // DevOps Training School
            </p>
            <h2
              className="text-6xl font-extrabold leading-[0.92] tracking-tight text-[#DDDDE8]"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Borderless<br />
              <span style={{ color: '#D4A853' }}>Tech</span><br />
              Academy
            </h2>
          </div>

          <div className="w-12 h-px bg-[#D4A853]" />

          <p className="text-sm text-[#45455A] leading-relaxed max-w-[22rem]">
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
                className="bg-[#111116] border border-[#1D1D26] rounded-xl p-3.5"
              >
                <p
                  className="text-xl font-bold text-[#D4A853] tabular-nums"
                >
                  {s.value}
                </p>
                <p className="text-[10px] text-[#45455A] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom terminal hint */}
        <div className="relative z-10 flex items-center gap-2">
          <Terminal size={12} className="text-[#32324A]" />
          <span
            className="text-[9px] text-[#32324A] tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ssh student@borderless.academy
          </span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/logo.png" alt="BTA Logo" width={32} height={32} className="rounded-lg shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#DDDDE8] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-syne)' }}>Borderless Tech Academy</p>
              <p className="text-[9px] text-[#D4A853] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>DevOps Training</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p
              className="text-[9px] text-[#45455A] tracking-[0.25em] uppercase mb-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              // Sign in
            </p>
            <h1 className="text-2xl font-bold text-[#DDDDE8]">Welcome back</h1>
            <p className="text-sm text-[#45455A] mt-1.5">Access your learning dashboard</p>
          </div>

          {/* Gold rule */}
          <div className="w-full h-px bg-gradient-to-r from-[rgba(212,168,83,0.5)] via-[rgba(212,168,83,0.15)] to-transparent mb-8" />

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
                className="text-[10px] font-semibold text-[#65657A] uppercase tracking-[0.12em]"
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
                  className="w-full pr-10 pl-3 py-2.5 text-sm bg-[#0B0B0F] border border-[#1D1D26] hover:border-[#282835] rounded-xl text-[#DDDDE8] placeholder-[#30304A] focus:outline-none focus:ring-2 focus:ring-[rgba(212,168,83,0.28)] focus:border-[rgba(212,168,83,0.45)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45455A] hover:text-[#9090A8] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-3" size="lg" loading={loading}>
              Sign In <ArrowRight size={15} />
            </Button>
          </form>

          <div className="mt-7 pt-6 border-t border-[#1D1D26]">
            <p className="text-center text-sm text-[#45455A]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#D4A853] hover:text-[#E8C070] font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <p
            className="mt-5 text-center text-[10px] text-[#25253A] tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            demo: admin@borderlesstech.com · Admin@123
          </p>
        </div>
      </div>
    </div>
  )
}
