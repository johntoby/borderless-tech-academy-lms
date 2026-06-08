import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)' }}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full pl-3 pr-8 py-2.5 bg-[#0D1426] border rounded-lg text-sm text-[#F1F5F9]',
              'appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.22)] focus:border-[rgba(0,212,255,0.55)]',
              error
                ? 'border-[rgba(239,68,68,0.50)]'
                : 'border-[#1E3A5F] hover:border-[#2D5680]',
              className
            )}
            {...props}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#0D1426] text-[#F1F5F9]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[#F87171]">⚠ {error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
