'use client'

import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useNotifications } from '@/components/ui/notifications'
import { useRouter } from 'next/navigation'
import { useGetDeliveryCharges } from '../api/get-delivery-charges'
import {
  useCreateArtworkOrder,
  createArtworkOrderInputSchema,
  CreateArtworkOrderInput,
} from '../api/create-artwork-order'
import type { Artwork } from '@/types'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { cn, getImage } from '@/lib/utils'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { ecommerceAnalytics, itemFromArtwork } from '@/lib/analytics'
import { useSource } from '@/lib/analytics-source'
import { ThemeSwitcher } from '@/components/theme-switcher'
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'

interface ArtworkOrderFormProps {
  artwork: Artwork
}

export const ArtworkOrderForm: React.FC<ArtworkOrderFormProps> = ({ artwork }) => {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const { data: deliveryCharges, isLoading: isLoadingCharges } = useGetDeliveryCharges()
  const createOrderMutation = useCreateArtworkOrder()
  const { source } = useSource()
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  const form = useForm<CreateArtworkOrderInput>({
    resolver: zodResolver(createArtworkOrderInputSchema),
    defaultValues: {
      artwork_id: artwork.id,
      name: '',
      phone_number: '',
      shipping_address: '',
      description: '',
      city: '',
    },
  })

  const selectedCityName = form.watch('city')
  const selectedDelivery = useMemo(() => {
    return deliveryCharges?.find((d) => d.city === selectedCityName)
  }, [deliveryCharges, selectedCityName])

  const totalPrice = useMemo(() => {
    const artworkPrice = Number(artwork.price) || 0
    const deliveryFee = Number(selectedDelivery?.charges) || 0
    return artworkPrice + deliveryFee
  }, [artwork.price, selectedDelivery])

  const onSubmit = async (data: CreateArtworkOrderInput) => {
    try {
      const order = await createOrderMutation.mutateAsync(data)

      // Tracking: Add Shipping Info
      ecommerceAnalytics.addShippingInfo(
        artwork.currency?.code || 'MMK',
        totalPrice,
        [itemFromArtwork(artwork)],
        data.city,
        source
      )

      addNotification({
        type: 'success',
        title: 'Order Placed',
        message: 'Your order has been created. Proceed to payment to complete your purchase.',
      })
      router.replace(paths.order.payment.getHref(order.id))
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Order Placement Failed',
        message: error.response?.data?.detail || 'Something went wrong while placing your order.',
      })
    }
  }

  const artistDisplayName = artwork.artist_profile
    ? `${artwork.artist_profile.first_name} ${artwork.artist_profile.last_name}`
    : artwork.artist_name || 'Featured Artist'

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
              to={paths.artworks.detail.getHref(artwork.id)}
              className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5 truncate group"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="truncate">Back to artwork</span>
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
            <Price price={totalPrice} currency={artwork.currency} />
          </div>
        </button>

        {mobileSummaryOpen && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-border/40 space-y-4">
            {/* Artwork Preview */}
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
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  {artwork.category_name && (
                    <span className="text-[10px] font-medium text-primary/90 bg-primary/10 border border-primary/15 px-1.5 py-0.2 rounded">
                      {artwork.category_name}
                    </span>
                  )}
                  {artwork.dimensions && (
                    <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded border border-border/40">
                      {artwork.dimensions}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Artwork Price</span>
                <span className="font-medium text-foreground">
                  <Price price={artwork.price} currency={artwork.currency} />
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Delivery Charge</span>
                <span className="font-medium text-foreground">
                  {selectedDelivery ? (
                    <Price price={selectedDelivery.charges} currency={artwork.currency} />
                  ) : (
                    <span className="italic">Calculated at city selection</span>
                  )}
                </span>
              </div>
              <div className="border-t border-border/60 pt-2 flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">Total Amount</span>
                <span className="font-semibold text-primary">
                  <Price price={totalPrice} currency={artwork.currency} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Balanced Split-Screen Stage */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Column (7 cols): Delivery Form */}
        <div className="lg:col-span-7 px-4 sm:px-8 lg:px-10 xl:px-12 py-8 sm:py-10 flex justify-center lg:justify-end">
          <div className="w-full max-w-[560px] space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
                Checkout & Delivery
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your delivery details below to reserve and order this artwork.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 0912345678"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">City / Township</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingCharges}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-11">
                              <SelectValue placeholder="Select delivery city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {deliveryCharges?.map((charge) => (
                              <SelectItem key={charge.id} value={charge.city}>
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{charge.city}</span>
                                  <span className="text-xs text-muted-foreground font-mono">
                                    +{charge.charges} MMK
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Street Address */}
                <FormField
                  control={form.control}
                  name="shipping_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Street Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed address (house number, street name, ward)"
                          className="min-h-[96px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delivery Instructions */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          Delivery Instructions{' '}
                          <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Special requests or landmark notes for courier"
                          className="min-h-[76px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-11 text-base font-semibold shadow-xs"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </div>
              </form>
            </Form>

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
                <p className="text-xs text-muted-foreground truncate">
                  by {artistDisplayName}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  {artwork.category_name && (
                    <span className="text-[10px] font-medium text-primary/80 bg-primary/5 border border-primary/10 px-1.5 py-0.2 rounded-sm">
                      {artwork.category_name}
                    </span>
                  )}
                  {artwork.dimensions && (
                    <span className="text-[10px] text-muted-foreground">
                      {artwork.dimensions}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-border/50 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Artwork Price</span>
                <span className="font-medium text-foreground">
                  <Price price={artwork.price} currency={artwork.currency} />
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span className="font-medium text-foreground">
                  {selectedDelivery ? (
                    <Price price={selectedDelivery.charges} currency={artwork.currency} />
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Calculated at city selection
                    </span>
                  )}
                </span>
              </div>

              <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                <span className="font-semibold text-base">Total Amount</span>
                <span className="text-lg font-semibold text-primary">
                  <Price price={totalPrice} currency={artwork.currency} />
                </span>
              </div>
            </div>

            {/* Art Trust & Protection Card (Original 3 Points) */}
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
