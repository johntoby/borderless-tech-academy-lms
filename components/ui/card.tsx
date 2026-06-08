import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5',
        'shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_1px_2px_-1px_rgba(0,0,0,0.3)]',
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={cn('text-base font-semibold text-[#F1F5F9] tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  loading,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bg: string
  loading?: boolean
}) {
  return (
    <Card className="flex items-center gap-4 group hover:border-[rgba(14,165,233,0.35)] hover:shadow-[0_0_0_1px_rgba(14,165,233,0.15),0_8px_24px_-4px_rgba(0,212,255,0.12)] transition-all duration-300">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.04] group-hover:scale-105 transition-transform duration-300', bg)}>
        <Icon size={20} className={color} />
      </div>
      <div>
        {loading ? (
          <div className="skeleton h-7 w-10 mb-1" />
        ) : (
          <p className="text-2xl font-bold text-[#F1F5F9] tabular-nums">{value}</p>
        )}
        <p className="text-xs text-[#94A3B8] leading-tight">{label}</p>
      </div>
    </Card>
  )
}
