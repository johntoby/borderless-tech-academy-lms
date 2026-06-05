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
          <label htmlFor={id} className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[0.12em]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-white border rounded-xl text-[#0F172A] placeholder-[#94A3B8]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[rgba(29,78,216,0.18)] focus:border-[rgba(29,78,216,0.40)] focus:bg-white',
              error
                ? 'border-[rgba(239,68,68,0.50)] focus:ring-[rgba(239,68,68,0.18)] focus:border-[rgba(239,68,68,0.60)]'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1]',
              icon ? 'pl-9 pr-3 py-2.5' : 'px-3 py-2.5',
              'text-sm',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#EF4444] flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[#94A3B8]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
