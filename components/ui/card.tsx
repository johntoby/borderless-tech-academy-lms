import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#111116] border border-[#1D1D26] rounded-2xl p-5',
        'shadow-sm shadow-black/40',
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
    <h3 className={cn('text-base font-semibold text-[#DDDDE8] tracking-tight', className)} {...props}>
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
    <Card className="flex items-center gap-4 hover:border-[#282835] transition-all duration-200">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', bg)}>
        <Icon size={20} className={color} />
      </div>
      <div>
        {loading ? (
          <div className="skeleton h-7 w-10 mb-1" />
        ) : (
          <p className="text-2xl font-bold text-[#DDDDE8] tabular-nums">{value}</p>
        )}
        <p className="text-xs text-[#65657A] leading-tight">{label}</p>
      </div>
    </Card>
  )
}
