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
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
      'transition-all duration-200 select-none cursor-pointer',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      'active:scale-[0.97]',
    ].join(' ')

    const variants = {
      primary: [
        'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white',
        'shadow-sm shadow-[rgba(29,78,216,0.20)] hover:shadow-md hover:shadow-[rgba(29,78,216,0.30)]',
        'font-semibold',
      ].join(' '),
      secondary: [
        'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A]',
        'border border-[#E2E8F0] hover:border-[#CBD5E1]',
      ].join(' '),
      danger: [
        'bg-[rgba(239,68,68,0.08)] hover:bg-[rgba(239,68,68,0.14)] text-[#EF4444]',
        'border border-[rgba(239,68,68,0.20)] hover:border-[rgba(239,68,68,0.35)]',
      ].join(' '),
      ghost: 'hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]',
      outline: [
        'border border-[#E2E8F0] hover:border-[rgba(29,78,216,0.35)]',
        'text-[#64748B] hover:text-[#1D4ED8]',
        'hover:bg-[rgba(29,78,216,0.04)]',
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
