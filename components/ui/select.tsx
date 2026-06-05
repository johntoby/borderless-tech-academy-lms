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
          <label htmlFor={id} className="text-[10px] font-semibold text-[#65657A] uppercase tracking-[0.12em]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full pl-3 pr-8 py-2.5 bg-[#0B0B0F] border rounded-xl text-sm text-[#DDDDE8]',
              'appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[rgba(212,168,83,0.28)] focus:border-[rgba(212,168,83,0.45)]',
              error
                ? 'border-[rgba(236,84,84,0.45)]'
                : 'border-[#1D1D26] hover:border-[#282835]',
              className
            )}
            {...props}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#111116]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45455A] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[#EC5454]">⚠ {error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
