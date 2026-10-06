'use client'

import React, { useMemo } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { getImage } from '@/lib/utils'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { ecommerceAnalytics, itemFromArtwork } from '@/lib/analytics'
import { useSource } from '@/lib/analytics-source'
import { ArrowLeft, Loader2, ShieldCheck, Sparkles, Truck } from 'lucide-react'

interface ArtworkOrderFormProps {
  artwork: Artwork
}

export const ArtworkOrderForm: React.FC<ArtworkOrderFormProps> = ({ artwork }) => {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const { data: deliveryCharges, isLoading: isLoadingCharges } = useGetDeliveryCharges()
  const createOrderMutation = useCreateArtworkOrder()
  const { source } = useSource()

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
        data.city, // Using city as shipping tier/proxy
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb / Back Link */}
      <div>
        <Link
          to={paths.artworks.detail.getHref(artwork.id)}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-2 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Artwork Details
        </Link>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
          Checkout & Shipping
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your delivery details below to reserve and order this artwork.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 0912345678" {...field} />
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
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select delivery city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deliveryCharges?.map((charge) => (
                                <SelectItem key={charge.id} value={charge.city}>
                                  <div className="flex items-center justify-between w-full gap-4">
                                    <span>{charge.city}</span>
                                    <span className="text-xs text-muted-foreground">
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

                  <FormField
                    control={form.control}
                    name="shipping_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Street Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed address (house number, street name, ward)"
                            className="min-h-[90px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Delivery Instructions{' '}
                          <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Special requests or landmark notes for courier"
                            className="min-h-[70px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
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
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary & Trust Card */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <Card className="border border-border/60 shadow-xs overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
              <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {/* Artwork Preview Card */}
              <div className="flex gap-4 items-start sm:items-center">
                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border bg-muted/20 shadow-2xs">
                  <AppImage
                    src={getImage(artwork.image)}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h4 className="font-semibold text-sm leading-normal sm:leading-relaxed text-foreground line-clamp-1 sm:line-clamp-2">
                    {artwork.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">by {artistDisplayName}</p>
                  <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                    {artwork.category_name && (
                      <span className="text-[10px] font-medium text-primary/80 bg-primary/5 border border-primary/10 px-1.5 py-0.2 rounded-sm">
                        {artwork.category_name}
                      </span>
                    )}
                    {artwork.dimensions && (
                      <span className="text-[10px] text-muted-foreground">{artwork.dimensions}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Artwork Price</span>
                  <span className="font-medium">
                    <Price price={artwork.price} currency={artwork.currency} />
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span className="font-medium">
                    {selectedDelivery ? (
                      <Price price={selectedDelivery.charges} currency={artwork.currency} />
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Calculated at city selection</span>
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
            </CardContent>
          </Card>

          {/* Art Trust & Protection Card */}
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
  )
}
