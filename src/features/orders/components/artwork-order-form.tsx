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
import {
  useGetCustomerDetailsList,
  useCreateCustomerDetails,
  useUpdateCustomerDetails,
} from '../api/customer-checkout-details'
import { SavedDetailsSelector } from './saved-details-selector'
import { Checkbox } from '@/components/ui/checkbox'
import type { Artwork, CustomerCheckoutDetails } from '@/types'
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
  const { data: savedDetails = [], isLoading: isLoadingSavedDetails } = useGetCustomerDetailsList()
  const createOrderMutation = useCreateArtworkOrder()
  const createCustomerDetailsMutation = useCreateCustomerDetails()
  const updateCustomerDetailsMutation = useUpdateCustomerDetails()
  const { source } = useSource()
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null)
  const [hasAutoSelected, setHasAutoSelected] = useState(false)
  const [saveForFuture, setSaveForFuture] = useState(false)
  const [savePresetLabel, setSavePresetLabel] = useState<string>('Home')
  const [saveCustomLabel, setSaveCustomLabel] = useState('')
  const [saveIsDefault, setSaveIsDefault] = useState(false)
  const [updateSavedAddress, setUpdateSavedAddress] = useState(false)

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

  // Auto-populate default or first saved address on initial load
  React.useEffect(() => {
    if (!hasAutoSelected && savedDetails.length > 0) {
      const defaultEntry = savedDetails.find((d) => d.is_default) || savedDetails[0]
      if (defaultEntry) {
        setSelectedDetailId(defaultEntry.id)
        const exactCity =
          deliveryCharges?.find(
            (c) => c.city.trim().toLowerCase() === defaultEntry.city.trim().toLowerCase()
          )?.city || defaultEntry.city

        form.reset({
          artwork_id: artwork.id,
          name: defaultEntry.name,
          phone_number: defaultEntry.phone_number,
          shipping_address: defaultEntry.shipping_address,
          city: exactCity,
          description: defaultEntry.description || '',
        })
        form.setValue('city', exactCity, { shouldValidate: true })
      }
      setHasAutoSelected(true)
    }
  }, [savedDetails, hasAutoSelected, form, artwork.id, deliveryCharges])

  // Sync city selection if delivery charges load after the initial auto-selection
  React.useEffect(() => {
    if (selectedDetailId !== null && deliveryCharges && deliveryCharges.length > 0) {
      const activeDetail = savedDetails.find((d) => d.id === selectedDetailId)
      if (activeDetail) {
        const currentCity = form.getValues('city')
        const matched = deliveryCharges.find(
          (c) => c.city.trim().toLowerCase() === activeDetail.city.trim().toLowerCase()
        )
        const targetCity = matched ? matched.city : activeDetail.city
        if (!currentCity || currentCity !== targetCity) {
          form.setValue('city', targetCity, { shouldValidate: true })
        }
      }
    }
  }, [deliveryCharges, selectedDetailId, savedDetails, form])

  const selectedSavedDetail = useMemo(() => {
    return savedDetails.find((d) => d.id === selectedDetailId) || null
  }, [savedDetails, selectedDetailId])

  const handleSelectDetail = (detail: CustomerCheckoutDetails | null) => {
    if (detail) {
      setSelectedDetailId(detail.id)
      const exactCity =
        deliveryCharges?.find(
          (c) => c.city.trim().toLowerCase() === detail.city.trim().toLowerCase()
        )?.city || detail.city

      form.setValue('name', detail.name, { shouldValidate: true })
      form.setValue('phone_number', detail.phone_number, { shouldValidate: true })
      form.setValue('shipping_address', detail.shipping_address, { shouldValidate: true })
      form.setValue('city', exactCity, { shouldValidate: true })
      form.setValue('description', detail.description || '', { shouldValidate: true })
      setUpdateSavedAddress(false)
    } else {
      setSelectedDetailId(null)
      form.reset({
        artwork_id: artwork.id,
        name: '',
        phone_number: '',
        shipping_address: '',
        city: '',
        description: '',
      })
      setSaveForFuture(false)
    }
  }

  // Detect whether values deviate from the selected saved address
  const currentValues = form.watch()
  const hasModifiedSavedAddress = useMemo(() => {
    if (!selectedSavedDetail) return false
    return (
      currentValues.name !== selectedSavedDetail.name ||
      currentValues.phone_number !== selectedSavedDetail.phone_number ||
      currentValues.shipping_address !== selectedSavedDetail.shipping_address ||
      currentValues.city !== selectedSavedDetail.city ||
      (currentValues.description || '') !== (selectedSavedDetail.description || '')
    )
  }, [selectedSavedDetail, currentValues])

  const selectedCityName = form.watch('city')
  const selectedDelivery = useMemo(() => {
    return deliveryCharges?.find((d) => d.city === selectedCityName)
  }, [deliveryCharges, selectedCityName])

  const totalPrice = useMemo(() => {
    const artworkPrice = Number(artwork.price) || 0
    const deliveryFee = Number(selectedDelivery?.charges) || 0
    return artworkPrice + deliveryFee
  }, [artwork.price, selectedDelivery])

  const isSubmitting =
    createOrderMutation.isPending ||
    createCustomerDetailsMutation.isPending ||
    updateCustomerDetailsMutation.isPending

  const onSubmit = async (data: CreateArtworkOrderInput) => {
    try {
      // 1. If user entered a new address and opted to save it for future checkouts
      if (selectedDetailId === null && saveForFuture) {
        const finalLabel =
          savePresetLabel === 'Other'
            ? saveCustomLabel.trim() || 'Other'
            : savePresetLabel
        try {
          await createCustomerDetailsMutation.mutateAsync({
            label: finalLabel,
            name: data.name,
            phone_number: data.phone_number,
            shipping_address: data.shipping_address,
            city: data.city,
            description: data.description || '',
            is_default: saveIsDefault,
          })
        } catch (saveErr) {
          console.error('Failed to save customer details:', saveErr)
          // Non-blocking: allow order to proceed
        }
      }

      // 2. If user edited a saved address and opted to update the saved entry
      if (selectedDetailId !== null && updateSavedAddress) {
        try {
          await updateCustomerDetailsMutation.mutateAsync({
            id: selectedDetailId,
            data: {
              name: data.name,
              phone_number: data.phone_number,
              shipping_address: data.shipping_address,
              city: data.city,
              description: data.description || '',
            },
          })
        } catch (updateErr) {
          console.error('Failed to update saved customer details:', updateErr)
        }
      }

      // 3. Place order snapshot
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

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back()
                } else {
                  router.push(paths.artworks.detail.getHref(artwork.id))
                }
              }}
              className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5 truncate group cursor-pointer bg-transparent border-0 p-0"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="truncate">Back to artwork</span>
            </button>
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

            {/* Saved Addresses Section */}
            <SavedDetailsSelector
              savedDetails={savedDetails}
              selectedId={selectedDetailId}
              onSelect={handleSelectDetail}
              isLoading={isLoadingSavedDetails}
            />

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
                          key={`${field.value || 'empty'}-${deliveryCharges?.length || 0}`}
                          onValueChange={field.onChange}
                          value={field.value || ''}
                          disabled={isLoadingCharges}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-11">
                              <SelectValue placeholder="Select delivery city">
                                {field.value || undefined}
                              </SelectValue>
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

                {/* Save as New Address Controls (Custom Mode) */}
                {selectedDetailId === null && (
                  <div className="space-y-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="save-for-future"
                        checked={saveForFuture}
                        onCheckedChange={(checked) => setSaveForFuture(!!checked)}
                        className="mt-0.5"
                      />
                      <label htmlFor="save-for-future" className="text-xs space-y-0.5 cursor-pointer">
                        <span className="font-medium text-foreground block">
                          Save this address for future checkouts
                        </span>
                        <span className="text-muted-foreground block">
                          Reusable delivery details securely linked to your account.
                        </span>
                      </label>
                    </div>

                    {saveForFuture && (
                      <div className="pt-2 pl-7 space-y-3 border-t border-border/40">
                        <div className="space-y-1.5">
                          <span className="text-sm font-medium text-foreground">Address Label</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(['Home', 'Work', 'Other'] as const).map((label) => (
                              <button
                                key={label}
                                type="button"
                                onClick={() => setSavePresetLabel(label)}
                                className={cn(
                                  'px-2.5 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer',
                                  savePresetLabel === label
                                    ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                                    : 'bg-background hover:bg-muted text-muted-foreground border-border/60'
                                )}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          {savePresetLabel === 'Other' && (
                            <Input
                              placeholder="e.g. Studio, Vacation Home"
                              value={saveCustomLabel}
                              onChange={(e) => setSaveCustomLabel(e.target.value)}
                              className="h-9 text-xs mt-1.5"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                          <Checkbox
                            id="save-default-toggle"
                            checked={saveIsDefault}
                            onCheckedChange={(checked) => setSaveIsDefault(!!checked)}
                          />
                          <label
                            htmlFor="save-default-toggle"
                            className="text-xs font-medium text-muted-foreground cursor-pointer"
                          >
                            Set as default address
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Update Selected Address Controls (Modified Mode) */}
                {selectedDetailId !== null && hasModifiedSavedAddress && (
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
                    <Checkbox
                      id="update-saved-address"
                      checked={updateSavedAddress}
                      onCheckedChange={(checked) => setUpdateSavedAddress(!!checked)}
                      className="mt-0.5"
                    />
                    <label htmlFor="update-saved-address" className="text-xs space-y-0.5 cursor-pointer">
                      <span className="font-medium text-foreground block">
                        Update saved {selectedSavedDetail?.label || 'address'} with these changes
                      </span>
                      <span className="text-muted-foreground block">
                        Keep these updated details in your saved address book for next time.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-11 text-base font-semibold shadow-xs"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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
