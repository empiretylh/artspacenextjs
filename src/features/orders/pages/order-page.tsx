'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useGetOrder } from '../api/get-orders'
import { useUpdateOrder } from '../api/update-order'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { getImage, getUserRouteType } from '@/lib/utils'
import { format } from 'date-fns'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import {
  Loader2,
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { env } from '@/config/env'
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
import { OrderStatusBadge } from '../components/order-status-badge'
import { OrderStepper } from '../components/order-stepper'

const OrderDetail = () => {
  const { id } = useParams() as { id: string }
  const { data: order, isLoading, error } = useGetOrder(id)
  const updateOrder = useUpdateOrder()

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const handleCancel = () => {
    setIsCancelDialogOpen(true)
  }

  const confirmCancel = () => {
    updateOrder.mutate({ orderId: id, data: { order_status: 'CANCELLED' } })
    setIsCancelDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="h-14 w-14 bg-destructive/10 rounded-full flex items-center justify-center">
          <Package className="h-7 w-7 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Order not found</h2>
          <p className="text-sm text-muted-foreground">We couldn't locate the order you requested.</p>
        </div>
        <Link to={paths.order.getHref()}>
          <Button variant="outline">Back to My Orders</Button>
        </Link>
      </div>
    )
  }

  const orderStatus = order.order_status || order.status || 'PENDING'
  const paymentStatus = order.payment_status || 'PENDING'

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Top Navigation */}
      <div>
        <Link
          to={paths.order.getHref()}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-2 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to My Orders
        </Link>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <OrderStatusBadge status={orderStatus} type="order" />
            <OrderStatusBadge status={paymentStatus} type="payment" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
            Order Details
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Placed on {format(new Date(order.created_at), 'PPPP')}
          </p>
        </div>

        <div className="text-left md:text-right bg-muted/20 md:bg-transparent p-3 md:p-0 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Amount</p>
          <div className="text-2xl font-semibold text-primary">
            <Price
              price={order.total_price}
              currency={{
                code: order.currency || 'MMK',
                name: order.currency || 'MMK',
                symbol: '',
                numeric_code: '',
              }}
            />
          </div>
        </div>
      </div>

      {/* Visual Order Progress Stepper */}
      <Card className="border border-border/60 shadow-2xs p-4 sm:p-6 bg-muted/10">
        <OrderStepper orderStatus={orderStatus} paymentStatus={paymentStatus} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - Artworks in Order */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/60 shadow-xs overflow-hidden">
            <div className="bg-muted/30 p-4 px-6 border-b border-border/50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Purchased Artworks ({order.items?.length || 0})
              </CardTitle>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start group hover:bg-muted/10 transition-colors"
                  >
                    <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden border bg-muted/20 shadow-2xs">
                      <AppImage
                        src={getImage(item.artwork.image)}
                        alt={item.artwork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-left w-full min-w-0">
                      <div className="space-y-1">
                        <Link
                          to={paths.artworks.detail.getHref(item.artwork.id)}
                          className="hover:text-primary transition-colors block max-w-full"
                        >
                          <h4 className="text-base font-semibold text-foreground leading-normal sm:leading-relaxed line-clamp-1 sm:line-clamp-2">
                            {item.artwork.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">
                          by{' '}
                          {item.artwork.artist_profile
                            ? `${item.artwork.artist_profile.first_name} ${item.artwork.artist_profile.last_name}`
                            : item.artwork.artist_name || 'Featured Artist'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <span>Qty:</span>
                          <span className="font-semibold text-foreground">{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-semibold text-primary">
                            <Price
                              price={item.price_at_purchase || item.artwork.price}
                              currency={{
                                code: order.currency || 'MMK',
                                name: order.currency || 'MMK',
                                symbol: '',
                                numeric_code: '',
                              }}
                            />
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1 flex-wrap">
                        <Link to={paths.artworks.detail.getHref(item.artwork.id)}>
                          <Button variant="link" className="p-0 h-auto text-xs font-semibold text-primary">
                            View Artwork Page
                          </Button>
                        </Link>
                        {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && item.artwork.current_owner_display && (
                          <Link
                            to={paths.chats.getHref({
                              userId: item.artwork.current_owner_display.id,
                              userType: getUserRouteType(item.artwork.current_owner_display.user_type),
                            })}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors h-7 px-2 rounded-md hover:bg-primary/10"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Contact Seller
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer, Shipping & Payment Summary */}
        <div className="space-y-6">
          {/* Shipping & Customer Card */}
          <Card className="border border-border/60 shadow-xs">
            <div className="bg-muted/30 p-4 px-6 border-b border-border/50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Delivery Information
              </CardTitle>
            </div>
            <CardContent className="pt-4 space-y-3.5 text-sm">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recipient</p>
                {typeof order.buyer === 'object' ? (
                  <>
                    <p className="font-semibold text-foreground">
                      {order.buyer.first_name} {order.buyer.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.buyer.email}</p>
                  </>
                ) : (
                  <p className="font-semibold text-foreground">{order.name || `User #${order.buyer}`}</p>
                )}
              </div>

              <div className="space-y-0.5 pt-2 border-t border-border/40">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Shipping Address
                </p>
                <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {order.shipping_address}
                </p>
              </div>

              {order.phone_number && (
                <div className="space-y-0.5 pt-2 border-t border-border/40">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</p>
                  <p className="text-xs font-medium text-foreground">{order.phone_number}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment & Actions Card */}
          <Card className="border border-border/60 shadow-xs">
            <div className="bg-muted/30 p-4 px-6 border-b border-border/50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Summary
              </CardTitle>
            </div>
            <CardContent className="pt-4 space-y-3.5 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-xs text-muted-foreground">Payment Status</span>
                <OrderStatusBadge status={paymentStatus} type="payment" />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Payment Date</span>
                <span className="font-medium text-foreground">
                  {order.paid_at ? format(new Date(order.paid_at), 'PP') : 'Unpaid'}
                </span>
              </div>

              {orderStatus === 'PENDING' &&
                (paymentStatus === 'PENDING' || paymentStatus === 'FAILED') && (
                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <Link to={paths.order.payment.getHref(order.id)} className="block">
                      <Button className="w-full font-semibold shadow-xs">Complete Payment</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateOrder.isPending}
                      className="w-full text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30"
                    >
                      Cancel Order
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancellation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">Cancel Order</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to cancel this order? This action cannot be undone and will release the
              reserved artwork.
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

export default OrderDetail
