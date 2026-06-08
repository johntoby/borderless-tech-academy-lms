import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)' }}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-[#0D1426] border rounded-lg text-[#F1F5F9] placeholder-[#64748B]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.22)] focus:border-[rgba(0,212,255,0.55)] focus:bg-[#0A0F1E]',
              error
                ? 'border-[rgba(239,68,68,0.50)] focus:ring-[rgba(239,68,68,0.18)] focus:border-[rgba(239,68,68,0.60)]'
                : 'border-[#1E3A5F] hover:border-[#2D5680]',
              icon ? 'pl-9 pr-3 py-2.5' : 'px-3 py-2.5',
              'text-sm',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#F87171] flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
