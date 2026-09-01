'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, ChevronLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react'
import { useGetOrder } from '../api/get-order'
import { createPaymentIntent } from '../api/payment'
import { useUpdateOrder } from '../api/update-order'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { getImage } from '@/lib/utils'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ecommerceAnalytics, itemFromArtwork } from '@/lib/analytics'
import { useAuth } from '@/features/auth/store'
import { useSource } from '@/lib/analytics-source'
import { OrderStatusBadge } from '../components/order-status-badge'

interface PaymentPageProps {
  orderId: string
}

export const PaymentPage = ({ orderId }: PaymentPageProps) => {
  const { user } = useAuth()
  const { source } = useSource()
  const router = useRouter()
  const { data: order, isLoading: isOrderLoading, error: orderError } = useGetOrder({ orderId })
  const updateOrder = useUpdateOrder()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (order) {
      const isPaymentProcessing = order.payment_status === 'PROCESSING' || order.payment_status === 'COMPLETED'
      const isOrderProcessing = order.order_status === 'COMPLETED' || order.status === 'COMPLETED'

      if (isPaymentProcessing || isOrderProcessing) {
        router.replace(paths.order.detail.getHref(order.id))
      }
    }
  }, [order, router])

  const handlePayment = async () => {
    if (!order) return

    try {
      setIsProcessing(true)

      const userId = typeof order.buyer === 'object' ? order.buyer.email : order.buyer

      // 1. Create Payment Intent
      const paymentIntent = await createPaymentIntent({
        amount: parseFloat(String(order.total_price)),
        description: `Payment for Order #${order.id.slice(0, 8).toUpperCase()} - Buyer: ${userId}`,
      })

      // 2. Patch Order Status
      await updateOrder.mutateAsync({
        orderId: order.id,
        data: {
          payment_status: 'PROCESSING',
          stripe_session_id: paymentIntent.txn_id,
        },
      })

      // Tracking: Add Payment Info
      ecommerceAnalytics.addPaymentInfo(
        order.currency || 'MMK',
        parseFloat(String(order.total_price)),
        order.items?.map((item) => itemFromArtwork(item.artwork as any)) || [],
        'Online Payment',
        source
      )

      // 3. Redirect to Payment Gateway
      window.location.replace(paymentIntent.payment_url)
    } catch (error: any) {
      console.error('Payment initialization failed:', error)
      toast.error(error.message || 'Payment initialization failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isOrderLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading order details...</p>
      </div>
    )
  }

  if (orderError || !order) {
    return (
      <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Error loading order</h2>
        <p className="text-sm text-muted-foreground">We couldn't retrieve the requested order information.</p>
        <Link to={paths.order.getHref()} className="inline-block">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>
    )
  }

  const isCompleted = order.payment_status === 'COMPLETED' || order.order_status === 'COMPLETED' || order.status === 'COMPLETED'
  const isProcessingStatus = order.payment_status === 'PROCESSING'

  if (isCompleted || isProcessingStatus) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          {isCompleted ? 'Payment already completed. Redirecting...' : 'Payment is processing. Redirecting...'}
        </p>
      </div>
    )
  }

  const firstItem = order.items?.[0]
  const artwork = firstItem?.artwork

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to={paths.order.getHref()}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-[11px]">
            ✓
          </span>
          <span>1. Shipping Details</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px]">
            2
          </span>
          <span>2. Secure Payment</span>
        </div>
      </div>

      <Card className="shadow-xs border border-border/70 overflow-hidden">
        <div className="bg-muted/30 p-6 border-b border-border/50">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold font-display tracking-tight">Complete Your Payment</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <OrderStatusBadge status={order.payment_status || 'PENDING'} type="payment" />
          </div>
        </div>

        <CardContent className="pt-6 space-y-6">
          {/* Order Summary Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center text-foreground">
              <CreditCard className="mr-2 h-4 w-4 text-primary" /> Purchase Summary
            </h3>

            <div className="bg-muted/20 border border-border/50 p-4 rounded-xl space-y-4">
              {artwork && (
                <div className="flex gap-4 items-start sm:items-center">
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border bg-background">
                    <AppImage
                      src={getImage(artwork.image)}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-semibold text-sm leading-normal sm:leading-relaxed text-foreground line-clamp-1 sm:line-clamp-2">
                      {artwork.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      by {artwork.artist_profile ? `${artwork.artist_profile.first_name} ${artwork.artist_profile.last_name}` : artwork.artist_name}
                    </p>
                    <p className="text-xs text-muted-foreground">Quantity: {firstItem.quantity}</p>
                  </div>
                  <div className="text-right font-medium text-sm">
                    <Price
                      price={firstItem.price_at_purchase}
                      currency={{
                        code: order.currency || 'MMK',
                        name: order.currency || 'MMK',
                        symbol: '',
                        numeric_code: '',
                      }}
                    />
                  </div>
                </div>
              )}

              {order.items && order.items.length > 1 && (
                <p className="text-xs text-primary font-medium text-center">
                  + {order.items.length - 1} more item(s) in this order
                </p>
              )}

              <div className="border-t border-border/50 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Artwork Subtotal</span>
                  <span>
                    <Price
                      price={order.price || '0'}
                      currency={{
                        code: order.currency || 'MMK',
                        name: order.currency || 'MMK',
                        symbol: '',
                        numeric_code: '',
                      }}
                    />
                  </span>
                </div>

                {parseFloat(order.deli_fee || '0') > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Delivery Charge</span>
                    <span>
                      <Price
                        price={order.deli_fee || '0'}
                        currency={{
                          code: order.currency || 'MMK',
                          name: order.currency || 'MMK',
                          symbol: '',
                          numeric_code: '',
                        }}
                      />
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-border/50 text-base font-semibold">
                  <span>Total Amount</span>
                  <span className="text-primary font-semibold">
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
              </div>
            </div>
          </div>

          {/* Shipping Address Preview */}
          <div className="border border-border/50 rounded-xl p-4 space-y-1 bg-muted/10">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Shipping Destination
            </h4>
            <p className="text-sm font-semibold text-foreground">{order.name}</p>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{order.shipping_address}</p>
            {order.phone_number && <p className="text-xs text-muted-foreground">Phone: {order.phone_number}</p>}
          </div>

          {/* Supported Gateways Banner */}
          <div className="p-3.5 rounded-xl border border-primary/10 bg-primary/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-foreground">Encrypted Gateway Checkout</p>
                <p className="text-muted-foreground text-[11px]">KBZPay, CBPay, WavePay, AYA Pay & Cards</p>
              </div>
            </div>
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-4 border-t border-border/50 bg-muted/10">
          <Button
            className="w-full h-11 text-base font-semibold shadow-xs"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting to Gateway...
              </>
            ) : (
              'Proceed to Secure Payment'
            )}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            You will be seamlessly transferred to our certified payment provider to authorize your payment.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
