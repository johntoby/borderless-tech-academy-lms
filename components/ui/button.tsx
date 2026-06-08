'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base = [
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
      'transition-all duration-200 select-none cursor-pointer',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      'active:scale-[0.97]',
    ].join(' ')

    const variants = {
      primary: [
        'bg-[#00D4FF] hover:bg-[#33DDFF] text-[#06121F] font-semibold',
        'shadow-[0_0_0_1px_rgba(0,212,255,0.35),0_0_16px_rgba(0,212,255,0.15)]',
        'hover:shadow-[0_0_0_1px_rgba(0,212,255,0.55),0_0_28px_rgba(0,212,255,0.40)]',
      ].join(' '),
      secondary: [
        'bg-[#1E293B] hover:bg-[#27374D] text-[#F1F5F9]',
        'border border-[#1E3A5F] hover:border-[#2D5680]',
      ].join(' '),
      danger: [
        'bg-[rgba(239,68,68,0.10)] hover:bg-[rgba(239,68,68,0.18)] text-[#F87171]',
        'border border-[rgba(239,68,68,0.30)] hover:border-[rgba(239,68,68,0.50)]',
        'hover:shadow-[0_0_16px_rgba(239,68,68,0.20)]',
      ].join(' '),
      ghost: 'hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F1F5F9]',
      outline: [
        'border border-[#1E3A5F] hover:border-[rgba(14,165,233,0.55)]',
        'text-[#94A3B8] hover:text-[#00D4FF]',
        'hover:bg-[rgba(14,165,233,0.06)] hover:shadow-[0_0_16px_rgba(0,212,255,0.10)]',
      ].join(' '),
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-4 py-2 text-sm h-9',
      lg: 'px-5 py-2.5 text-sm h-10',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
