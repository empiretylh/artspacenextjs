'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useGetOrder } from '../api/get-order'
import { createPaymentIntent } from '../api/payment'
import { useUpdateOrder } from '../api/update-order'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { cn, getImage } from '@/lib/utils'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ecommerceAnalytics, itemFromArtwork } from '@/lib/analytics'
import { useSource } from '@/lib/analytics-source'
import { OrderStatusBadge } from '../components/order-status-badge'
import { ThemeSwitcher } from '@/components/theme-switcher'

interface PaymentPageProps {
  orderId: string
}

export const PaymentPage = ({ orderId }: PaymentPageProps) => {
  const { source } = useSource()
  const router = useRouter()
  const { data: order, isLoading: isOrderLoading, error: orderError } = useGetOrder({ orderId })
  const updateOrder = useUpdateOrder()
  const [isProcessing, setIsProcessing] = useState(false)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

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
          mgpay_txn_id: paymentIntent.txn_id,
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
      <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading order details...</p>
      </div>
    )
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Error loading order</h2>
        <p className="text-sm text-muted-foreground">We couldn&apos;t retrieve the requested order information.</p>
        <Link to={paths.order.getHref()} className="inline-block">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>
    )
  }

  const isCompleted = order.payment_status === 'COMPLETED' || order.order_status === 'COMPLETED' || order.status === 'COMPLETED'
  const isProcessingStatus = order.payment_status === 'PROCESSING'

  if (isCompleted || isProcessingStatus) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          {isCompleted ? 'Payment already completed. Redirecting...' : 'Payment is processing. Redirecting...'}
        </p>
      </div>
    )
  }

  const firstItem = order.items?.[0]
  const artwork = firstItem?.artwork
  const artistDisplayName = artwork?.artist_profile
    ? `${artwork.artist_profile.first_name} ${artwork.artist_profile.last_name}`
    : artwork?.artist_name || 'Featured Artist'

  const currencyObj = {
    code: order.currency || 'MMK',
    name: order.currency || 'MMK',
    symbol: '',
    numeric_code: '',
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* 1. Clean Minimal Checkout Header */}
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/95 backdrop-blur-md shrink-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Back Link */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <AppImage
                src="/assets/logo.png"
                alt="Art Space Logo"
                width={28}
                height={28}
                className="size-7 object-contain"
                withoutContainer
                loading="eager"
              />
              <span className="font-display font-semibold text-sm sm:text-base tracking-tight uppercase text-foreground">
                Art Space
              </span>
            </Link>

            <div className="h-4 w-px bg-border/60 shrink-0 hidden sm:block" />

            <Link
              to={paths.order.getHref()}
              className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5 truncate group cursor-pointer bg-transparent border-0 p-0"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="truncate">Back to orders</span>
            </Link>
          </div>

          {/* Right: Simple Secure Badge & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/60 text-xs font-medium">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>Secure Checkout</span>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* 2. Mobile Expandable Summary Bar (Hidden on desktop) */}
      <div className="lg:hidden border-b border-border/60 bg-muted/30 shrink-0">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen((prev) => !prev)}
          className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between text-left text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-primary font-medium">
            <ShoppingBag className="h-4 w-4" />
            <span>{mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                mobileSummaryOpen && 'rotate-180'
              )}
            />
          </div>
          <div className="font-semibold text-foreground">
            <Price price={order.total_price} currency={currencyObj} />
          </div>
        </button>

        {mobileSummaryOpen && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-border/40 space-y-4">
            {artwork && (
              <div className="flex gap-3.5 items-start p-3 rounded-xl bg-background border border-border/60 shadow-2xs">
                <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted/20">
                  <AppImage
                    src={getImage(artwork.image)}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-semibold text-sm leading-normal text-foreground line-clamp-1">
                    {artwork.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">by {artistDisplayName}</p>
                  <p className="text-xs text-muted-foreground">Qty: {firstItem?.quantity || 1}</p>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Artwork Price</span>
                <span className="font-medium text-foreground">
                  <Price price={order.price || '0'} currency={currencyObj} />
                </span>
              </div>
              {parseFloat(order.deli_fee || '0') > 0 && (
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-foreground">
                    <Price price={order.deli_fee || '0'} currency={currencyObj} />
                  </span>
                </div>
              )}
              <div className="border-t border-border/60 pt-2 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">Total Amount</span>
                <span className="font-semibold text-primary">
                  <Price price={order.total_price} currency={currencyObj} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Balanced Split-Screen Stage */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Column (7 cols): Payment Confirmation & Gateways */}
        <div className="lg:col-span-7 px-4 sm:px-8 lg:px-10 xl:px-12 py-8 sm:py-10 flex justify-center lg:justify-end">
          <div className="w-full max-w-[560px] space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/50 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-semibold">
                  ✓
                </span>
                <span>1. Delivery Details</span>
              </div>
              <div className="h-px w-8 bg-border/70" />
              <div className="flex items-center gap-1.5 text-primary font-semibold">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                  2
                </span>
                <span>2. Secure Payment</span>
              </div>
            </div>

            {/* Title & Badge */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
                  Complete Payment
                </h1>
                <OrderStatusBadge status={order.payment_status || 'PENDING'} type="payment" />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Delivery Destination Confirmation Card */}
            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <MapPin className="size-3.5 text-primary" />
                <span>Delivery Destination</span>
              </div>
              <div className="space-y-0.5 pt-0.5">
                <p className="text-sm font-semibold text-foreground">{order.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {order.shipping_address}
                </p>
                {order.phone_number && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Phone: {order.phone_number}
                  </p>
                )}
                {order.description && (
                  <p className="text-[11px] text-muted-foreground/80 italic pt-1 border-t border-border/40 mt-1.5">
                    Note: {order.description}
                  </p>
                )}
              </div>
            </div>


            {/* Payment CTA Action */}
            <div className="space-y-3 pt-2">
              <Button
                size="lg"
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
                You will be seamlessly transferred to our certified payment gateway to authorize your purchase.
              </p>
            </div>

            {/* Mobile Trust Badges */}
            <div className="lg:hidden pt-4 border-t border-border/60">
              <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>Original artwork guaranteed authentic</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span>Secure, protective packaging & insured handling</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>Direct support to the verified artist & gallery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Subtle Tinted Summary Rail (Desktop) */}
        <div className="lg:col-span-5 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border/60 px-4 sm:px-8 lg:px-10 py-8 sm:py-10 flex flex-col">
          <div className="w-full max-w-[420px] mx-auto lg:mx-0 space-y-6 lg:sticky lg:top-24">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Order Summary</h2>

            {/* Artwork Preview Card */}
            {artwork && (
              <div className="flex gap-4 items-start sm:items-center p-3.5 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
                <div className="relative size-20 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted/20 shadow-2xs">
                  <AppImage
                    src={getImage(artwork.image)}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h3 className="font-semibold text-sm leading-normal sm:leading-relaxed text-foreground line-clamp-1 sm:line-clamp-2">
                    {artwork.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">by {artistDisplayName}</p>
                  <p className="text-[11px] text-muted-foreground">Qty: {firstItem?.quantity || 1}</p>
                </div>
              </div>
            )}

            {order.items && order.items.length > 1 && (
              <p className="text-xs text-primary font-medium">
                + {order.items.length - 1} more item(s) in this order
              </p>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-border/50 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Artwork Price</span>
                <span className="font-medium text-foreground">
                  <Price price={order.price || '0'} currency={currencyObj} />
                </span>
              </div>

              {parseFloat(order.deli_fee || '0') > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span className="font-medium text-foreground">
                    <Price price={order.deli_fee || '0'} currency={currencyObj} />
                  </span>
                </div>
              )}

              <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                <span className="font-semibold text-base">Total Amount</span>
                <span className="text-lg font-semibold text-primary">
                  <Price price={order.total_price} currency={currencyObj} />
                </span>
              </div>
            </div>

            {/* Art Trust & Protection Card */}
            <div className="p-4 rounded-xl border border-border/50 bg-background/60 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Original artwork guaranteed authentic</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <span>Secure, protective packaging & insured handling</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>Direct support to the verified artist & gallery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
