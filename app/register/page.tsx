'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

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
    <div className="min-h-screen bg-[#07070A] flex items-center justify-center p-6">

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(212,168,83,0.05) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md relative z-10 animate-fade-in">

        {/* Header */}
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="BTA Logo" width={52} height={52} className="rounded-2xl mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-[#DDDDE8]">Create your account</h1>
          <p className="text-sm text-[#45455A] mt-1.5">Join Borderless Tech Academy today</p>
        </div>

        {/* Card */}
        <div className="bg-[#111116] border border-[#1D1D26] rounded-2xl p-7 shadow-2xl shadow-black/50 relative overflow-hidden">
          {/* Gold top line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[rgba(212,168,83,0.4)] to-transparent" />

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
        </div>

        <p className="mt-5 text-center text-sm text-[#45455A]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#D4A853] hover:text-[#E8C070] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
