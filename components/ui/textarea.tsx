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
          <label htmlFor={id} className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[0.12em]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8]',
            'transition-all duration-200 resize-y min-h-[80px]',
            'focus:outline-none focus:ring-2 focus:ring-[rgba(29,78,216,0.18)] focus:border-[rgba(29,78,216,0.40)]',
            error
              ? 'border-[rgba(239,68,68,0.50)] focus:ring-[rgba(239,68,68,0.18)]'
              : 'border-[#E2E8F0] hover:border-[#CBD5E1]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444]">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[#94A3B8]">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
