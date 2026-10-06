'use client'

import React, { useState } from 'react'
import { useAuth } from '@/features/auth/store'
import { useGetUserOrders } from '../api/get-orders'
import { useUpdateOrder } from '../api/update-order'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { getImage, getUserRouteType } from '@/lib/utils'
import { format } from 'date-fns'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { Loader2, Package, MessageSquare, ArrowRight } from 'lucide-react'
import { env } from '@/config/env'
import { Pagination } from '@/components/common/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { OrderStatusBadge } from './order-status-badge'

export const UserOrderList = ({ filters = {} }: { filters?: Record<string, any> }) => {
  const { user } = useAuth()
  const userId = user?.id
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data: orders, isLoading, error } = useGetUserOrders(userId as number, page, filters)
  const updateOrder = useUpdateOrder()

  const [orderIdToCancel, setOrderIdToCancel] = useState<string | null>(null)

  const handleCancel = (orderId: string) => {
    setOrderIdToCancel(orderId)
  }

  const confirmCancel = () => {
    if (orderIdToCancel) {
      updateOrder.mutate({ orderId: orderIdToCancel, data: { order_status: 'CANCELLED' } })
      setOrderIdToCancel(null)
    }
  }

  const hasFilters = Object.keys(filters).length > 0

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground animate-pulse">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-destructive/5 rounded-2xl border border-destructive/20 text-destructive text-sm font-medium p-6 max-w-md mx-auto">
        Failed to load your orders. Please try refreshing the page.
      </div>
    )
  }

  if (!orders || orders.results.length === 0) {
    return (
      <Card className="text-center py-16 border border-border/60 bg-muted/10 rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <div className="h-14 w-14 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
            <Package className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">
              {hasFilters ? 'No matching orders' : 'No orders yet'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {hasFilters
                ? 'Try adjusting or clearing your filters to find your orders.'
                : 'When you purchase an artwork, your order history will appear here.'}
            </p>
          </div>
          <div className="pt-2">
            {hasFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-xs font-medium"
              >
                Clear all filters
              </Button>
            ) : (
              <Link to={paths.artworks.getHref()}>
                <Button size="sm" className="font-medium gap-1.5 text-xs">
                  Browse Artworks <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.results.map((order) => {
        const status = order.order_status || order.status || 'PENDING'
        const paymentStatus = order.payment_status || 'PENDING'
        const firstItem = order.items?.[0]
        const artwork = firstItem?.artwork

        const isPendingPayment =
          status === 'PENDING' && (paymentStatus === 'PENDING' || paymentStatus === 'FAILED')

        return (
          <Card
            key={order.id}
            className="overflow-hidden border border-border/60 shadow-xs hover:border-border transition-colors group"
          >
            {/* Top Bar: Order Meta & Status */}
            <div className="bg-muted/20 px-5 py-3 border-b border-border/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to={paths.order.detail.getHref(order.id)}
                  className="font-mono text-xs font-medium text-foreground hover:text-primary transition-colors"
                >
                  ORDER #{order.id.slice(0, 8).toUpperCase()}
                </Link>
                <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <OrderStatusBadge status={status} type="order" />
                <OrderStatusBadge status={paymentStatus} type="payment" />
              </div>
            </div>

            {/* Main Content Area */}
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
                {artwork ? (
                  <div className="flex gap-4 items-start sm:items-center min-w-0 flex-1">
                    <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border bg-muted/20 shadow-2xs">
                      <AppImage
                        src={getImage(artwork.image)}
                        alt={artwork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <Link
                        to={paths.order.detail.getHref(order.id)}
                        className="hover:text-primary transition-colors block max-w-full"
                      >
                        <h4 className="font-semibold text-sm sm:text-base text-foreground leading-normal sm:leading-relaxed line-clamp-1 sm:line-clamp-2">
                          {artwork.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">
                        by{' '}
                        {artwork.artist_profile
                          ? `${artwork.artist_profile.first_name} ${artwork.artist_profile.last_name}`
                          : artwork.artist_name || 'Featured Artist'}
                      </p>
                      <div className="flex items-center gap-3 text-xs pt-0.5 flex-wrap">
                        <span className="text-muted-foreground">Qty: {firstItem.quantity}</span>
                        {order.items && order.items.length > 1 && (
                          <Badge variant="secondary" className="text-[10px] font-normal py-0 px-1.5">
                            +{order.items.length - 1} more item(s)
                          </Badge>
                        )}
                        {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && artwork?.current_owner_display && (
                          <Link
                            to={paths.chats.getHref({
                              userId: artwork.current_owner_display.id,
                              userType: getUserRouteType(artwork.current_owner_display.user_type),
                            })}
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>Contact Seller</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground italic">
                    <Package className="h-4 w-4" />
                    Artwork information unavailable
                  </div>
                )}

                {/* Right Side: Total Price & Actions */}
                <div className="flex flex-col sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <div className="flex items-baseline justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <span className="text-xs text-muted-foreground sm:hidden">Total Amount</span>
                    <span className="text-base sm:text-lg font-semibold text-primary sm:text-right">
                      <Price
                        price={order.total_price}
                        currency={{
                          code: order.currency || 'MMK',
                          name: order.currency || 'MMK',
                          symbol: '',
                          numeric_code: '',
                        }}
                      />
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {isPendingPayment && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancel(order.id)}
                        disabled={updateOrder.isPending}
                        className="h-8 text-xs font-normal text-muted-foreground hover:text-destructive px-2"
                      >
                        Cancel
                      </Button>
                    )}

                    <Link to={paths.order.detail.getHref(order.id)} className={isPendingPayment ? '' : 'w-full sm:w-auto'}>
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium w-full sm:w-auto px-3">
                        Details
                      </Button>
                    </Link>

                    {isPendingPayment && (
                      <Link to={paths.order.payment.getHref(order.id)}>
                        <Button size="sm" className="h-8 text-xs font-semibold shadow-xs px-3.5">
                          Pay Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {orders && orders.count > 0 && (
        <div className="pt-2">
          <Pagination
            total={orders.count}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            showLimitSelector={false}
          />
        </div>
      )}

      {/* Cancellation Dialog */}
      <AlertDialog open={!!orderIdToCancel} onOpenChange={(open) => !open && setOrderIdToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">Cancel Order</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-medium">Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium"
            >
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
