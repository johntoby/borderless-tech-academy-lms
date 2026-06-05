import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'purple'
  dot?: boolean
}

export function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#1D1D26] text-[#9090A8] border border-[#282835]',
    success: 'bg-[rgba(52,201,160,0.10)] text-[#34C9A0] border border-[rgba(52,201,160,0.20)]',
    warning: 'bg-[rgba(230,139,53,0.10)] text-[#E68B35] border border-[rgba(230,139,53,0.20)]',
    danger:  'bg-[rgba(236,84,84,0.10)]  text-[#EC5454] border border-[rgba(236,84,84,0.20)]',
    info:    'bg-[rgba(212,168,83,0.10)] text-[#D4A853] border border-[rgba(212,168,83,0.20)]',
    outline: 'border border-[#282835] text-[#65657A]',
    purple:  'bg-[rgba(155,114,234,0.10)] text-[#9B72EA] border border-[rgba(155,114,234,0.20)]',
  }

  const dots: Record<string, string> = {
    default: 'bg-[#9090A8]',
    success: 'bg-[#34C9A0]',
    warning: 'bg-[#E68B35]',
    danger:  'bg-[#EC5454]',
    info:    'bg-[#D4A853]',
    outline: 'bg-[#65657A]',
    purple:  'bg-[#9B72EA]',
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
