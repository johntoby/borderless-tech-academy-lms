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
        'bg-[#D4A853] hover:bg-[#E2BC6A] text-[#07070A]',
        'shadow-sm shadow-[rgba(212,168,83,0.22)] hover:shadow-md hover:shadow-[rgba(212,168,83,0.35)]',
        'font-semibold',
      ].join(' '),
      secondary: [
        'bg-[#17171D] hover:bg-[#1E1E26] text-[#DDDDE8]',
        'border border-[#282835] hover:border-[#353545]',
      ].join(' '),
      danger: [
        'bg-[rgba(236,84,84,0.15)] hover:bg-[rgba(236,84,84,0.22)] text-[#EC5454]',
        'border border-[rgba(236,84,84,0.25)] hover:border-[rgba(236,84,84,0.4)]',
      ].join(' '),
      ghost: 'hover:bg-[#17171D] text-[#65657A] hover:text-[#DDDDE8]',
      outline: [
        'border border-[#282835] hover:border-[rgba(212,168,83,0.35)]',
        'text-[#65657A] hover:text-[#D4A853]',
        'hover:bg-[rgba(212,168,83,0.04)]',
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
