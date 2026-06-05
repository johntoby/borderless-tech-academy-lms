import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E2E8F0] rounded-2xl p-5',
        'shadow-[0_1px_3px_0_rgba(15,23,42,0.06),0_1px_2px_-1px_rgba(15,23,42,0.06)]',
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
    <h3 className={cn('text-base font-semibold text-[#0F172A] tracking-tight', className)} {...props}>
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
    <Card className="flex items-center gap-4 hover:border-[#CBD5E1] hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)] transition-all duration-200">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', bg)}>
        <Icon size={20} className={color} />
      </div>
      <div>
        {loading ? (
          <div className="skeleton h-7 w-10 mb-1" />
        ) : (
          <p className="text-2xl font-bold text-[#0F172A] tabular-nums">{value}</p>
        )}
        <p className="text-xs text-[#64748B] leading-tight">{label}</p>
      </div>
    </Card>
  )
}
