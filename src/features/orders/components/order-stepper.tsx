import React from 'react'
import { cn } from '@/lib/utils'
import { Check, Clock, PackageCheck, Truck, X } from 'lucide-react'

interface OrderStepperProps {
  orderStatus: string
  paymentStatus?: string
  className?: string
}

export const OrderStepper: React.FC<OrderStepperProps> = ({
  orderStatus = 'PENDING',
  paymentStatus = 'PENDING',
  className,
}) => {
  const normOrderStatus = orderStatus.toUpperCase()
  const normPaymentStatus = paymentStatus.toUpperCase()

  const isCancelled = normOrderStatus === 'CANCELLED'
  const isFailed = normOrderStatus === 'FAILED' || normPaymentStatus === 'FAILED'

  if (isCancelled || isFailed) {
    return (
      <div className={cn('p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-center gap-3', className)}>
        <div className="h-9 w-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
          <X className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-destructive">
            {isCancelled ? 'Order Cancelled' : 'Order / Payment Failed'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isCancelled
              ? 'This order has been cancelled and will not be processed further.'
              : 'There was an issue processing your order or payment.'}
          </p>
        </div>
      </div>
    )
  }

  // Calculate active step: 1 = Placed, 2 = Paid, 3 = Shipped, 4 = Completed
  let currentStep = 1
  if (normPaymentStatus === 'COMPLETED') currentStep = 2
  if (normOrderStatus === 'SHIPPED') currentStep = 3
  if (normOrderStatus === 'COMPLETED') currentStep = 4

  const steps = [
    {
      id: 1,
      title: 'Order Placed',
      description: 'Request received',
      icon: Clock,
    },
    {
      id: 2,
      title: 'Payment',
      description: normPaymentStatus === 'COMPLETED' ? 'Confirmed' : 'Pending',
      icon: Check,
    },
    {
      id: 3,
      title: 'Delivery',
      description: normOrderStatus === 'SHIPPED' ? 'In transit' : 'Preparing',
      icon: Truck,
    },
    {
      id: 4,
      title: 'Delivered',
      description: normOrderStatus === 'COMPLETED' ? 'Completed' : 'Pending',
      icon: PackageCheck,
    },
  ]

  return (
    <div className={cn('w-full py-2', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const isPassed = currentStep > step.id
          const isCurrent = currentStep === step.id
          const Icon = step.icon

          return (
            <div key={step.id} className="flex flex-col items-center text-center relative group">
              {/* Connector line on desktop */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'hidden sm:block absolute top-4 left-[50%] right-[-50%] h-[2px] -z-0 transition-colors',
                    isPassed ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}

              {/* Step circle icon */}
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold z-10 transition-all border shadow-xs',
                  isPassed
                    ? 'bg-primary text-primary-foreground border-primary'
                    : isCurrent
                    ? 'bg-primary/10 text-primary border-primary ring-4 ring-primary/10'
                    : 'bg-muted text-muted-foreground border-border'
                )}
              >
                {isPassed ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-3.5 w-3.5" />}
              </div>

              {/* Step info */}
              <div className="mt-2 space-y-0.5">
                <p
                  className={cn(
                    'text-xs font-semibold transition-colors',
                    isCurrent || isPassed ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-muted-foreground hidden xs:block">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
