import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'purple' | 'amber'
  dot?: boolean
}

export function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#1E293B] text-[#94A3B8] border border-[#1E3A5F]',
    success: 'bg-[rgba(34,197,94,0.10)]   text-[#4ADE80] border border-[rgba(34,197,94,0.25)]',
    warning: 'bg-[rgba(245,158,11,0.10)]  text-[#FBBF24] border border-[rgba(245,158,11,0.28)]',
    danger:  'bg-[rgba(239,68,68,0.10)]   text-[#F87171] border border-[rgba(239,68,68,0.28)]',
    info:    'bg-[rgba(59,130,246,0.10)]  text-[#60A5FA] border border-[rgba(59,130,246,0.28)]',
    outline: 'border border-[#1E3A5F] text-[#94A3B8]',
    purple:  'bg-[rgba(167,139,250,0.10)] text-[#C4B5FD] border border-[rgba(167,139,250,0.28)]',
    amber:   'bg-[rgba(245,158,11,0.12)]  text-[#FBBF24] border border-[rgba(245,158,11,0.32)]',
  }

  const dots: Record<string, string> = {
    default: 'bg-[#94A3B8]',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',
    danger:  'bg-[#EF4444]',
    info:    'bg-[#3B82F6]',
    outline: 'bg-[#94A3B8]',
    purple:  'bg-[#A78BFA]',
    amber:   'bg-[#F59E0B]',
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
