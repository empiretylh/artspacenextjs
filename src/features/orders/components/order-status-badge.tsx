import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Clock, CheckCircle2, Truck, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export type OrderStatusType = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | string
export type PaymentStatusType = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | string

interface OrderStatusBadgeProps {
  status: OrderStatusType
  type?: 'order' | 'payment'
  className?: string
  showIcon?: boolean
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  type = 'order',
  className,
  showIcon = true,
}) => {
  const normalized = (status || 'PENDING').toUpperCase()

  const getStatusConfig = () => {
    switch (normalized) {
      case 'COMPLETED':
        return {
          label: type === 'payment' ? 'Paid' : 'Completed',
          icon: CheckCircle2,
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15',
        }
      case 'SHIPPED':
        return {
          label: 'Shipped',
          icon: Truck,
          className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15',
        }
      case 'PROCESSING':
        return {
          label: 'Processing',
          icon: RefreshCw,
          className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/15',
        }
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: XCircle,
          className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
        }
      case 'FAILED':
        return {
          label: 'Failed',
          icon: AlertCircle,
          className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15',
        }
      case 'PENDING':
      default:
        return {
          label: type === 'payment' ? 'Payment Pending' : 'Pending',
          icon: Clock,
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15',
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors border rounded-full',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{config.label}</span>
    </Badge>
  )
}
