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
          <label htmlFor={id} className="text-[10px] font-semibold text-[#65657A] uppercase tracking-[0.12em]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45455A] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-[#0B0B0F] border rounded-xl text-[#DDDDE8] placeholder-[#30304A]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[rgba(212,168,83,0.28)] focus:border-[rgba(212,168,83,0.45)] focus:bg-[#0F0F14]',
              error
                ? 'border-[rgba(236,84,84,0.45)] focus:ring-[rgba(236,84,84,0.28)] focus:border-[rgba(236,84,84,0.55)]'
                : 'border-[#1D1D26] hover:border-[#282835]',
              icon ? 'pl-9 pr-3 py-2.5' : 'px-3 py-2.5',
              'text-sm',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#EC5454] flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[#45455A]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
