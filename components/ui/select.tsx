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
          <label htmlFor={id} className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[0.12em]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full pl-3 pr-8 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A]',
              'appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[rgba(29,78,216,0.18)] focus:border-[rgba(29,78,216,0.40)]',
              error
                ? 'border-[rgba(239,68,68,0.50)]'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1]',
              className
            )}
            {...props}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[#EF4444]">⚠ {error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
