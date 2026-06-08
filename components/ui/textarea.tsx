import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2.5 bg-[#0D1426] border rounded-lg text-sm text-[#F1F5F9] placeholder-[#64748B]',
            'transition-all duration-200 resize-y min-h-[80px]',
            'focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.22)] focus:border-[rgba(0,212,255,0.55)]',
            error
              ? 'border-[rgba(239,68,68,0.50)] focus:ring-[rgba(239,68,68,0.18)]'
              : 'border-[#1E3A5F] hover:border-[#2D5680]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#F87171]">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
