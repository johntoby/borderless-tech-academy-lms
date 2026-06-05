import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'purple'
  dot?: boolean
}

export function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
    success: 'bg-[rgba(16,185,129,0.08)] text-[#059669] border border-[rgba(16,185,129,0.18)]',
    warning: 'bg-[rgba(245,158,11,0.08)] text-[#D97706] border border-[rgba(245,158,11,0.18)]',
    danger:  'bg-[rgba(239,68,68,0.08)]  text-[#DC2626] border border-[rgba(239,68,68,0.18)]',
    info:    'bg-[rgba(29,78,216,0.07)]  text-[#1D4ED8] border border-[rgba(29,78,216,0.16)]',
    outline: 'border border-[#E2E8F0] text-[#64748B]',
    purple:  'bg-[rgba(139,92,246,0.08)] text-[#7C3AED] border border-[rgba(139,92,246,0.18)]',
  }

  const dots: Record<string, string> = {
    default: 'bg-[#94A3B8]',
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    danger:  'bg-[#EF4444]',
    info:    'bg-[#1D4ED8]',
    outline: 'bg-[#94A3B8]',
    purple:  'bg-[#8B5CF6]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        'whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />
      )}
      {children}
    </span>
  )
}
