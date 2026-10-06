'use client'

import { UserOrderList } from '../components/user-order-list'
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ORDER_STATUS_OPTIONS = [
  { label: 'All Order Status', value: 'all' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Failed', value: 'FAILED' },
]

const PAYMENT_STATUS_OPTIONS = [
  { label: 'All Payment Status', value: 'all' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Failed', value: 'FAILED' },
]

const OrdersPage = () => {
  const [orderStatus, setOrderStatus] = useState<string>('all')
  const [paymentStatus, setPaymentStatus] = useState<string>('all')

  const filters = useMemo(() => {
    const f: Record<string, any> = {}
    if (orderStatus !== 'all') {
      f.order_status = orderStatus
    }
    if (paymentStatus !== 'all') {
      f.payment_status = paymentStatus
    }
    return f
  }, [orderStatus, paymentStatus])

  const isFiltered = orderStatus !== 'all' || paymentStatus !== 'all'

  const resetFilters = () => {
    setOrderStatus('all')
    setPaymentStatus('all')
  }

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
            Your Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your purchased artworks and order status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select value={orderStatus} onValueChange={setOrderStatus}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div>
        <UserOrderList filters={filters} />
      </div>
    </div>
  )
}

export default OrdersPage
