'use client'

import React, { useState, useMemo } from 'react'
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
import { Loader2 } from 'lucide-react'
import { paths } from '@/config/paths'

interface ArtworkOrderFormProps {
  artwork: Artwork
}

export const ArtworkOrderForm: React.FC<ArtworkOrderFormProps> = ({ artwork }) => {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const { data: deliveryCharges, isLoading: isLoadingCharges } = useGetDeliveryCharges()
  const createOrderMutation = useCreateArtworkOrder()

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
      addNotification({
        type: 'success',
        title: 'Order Created',
        message: 'Your order has been successfully placed.',
      })
      router.push(paths.order.payment.getHref(order.id))
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Order Placement Failed',
        message: error.response?.data?.detail || 'Something went wrong while placing your order.',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Complete Your Order</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
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
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingCharges}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {deliveryCharges?.map((charge) => (
                              <SelectItem key={charge.id} value={charge.city}>
                                {charge.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your detailed shipping address"
                            className="min-h-[100px]"
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
                        <FormLabel>Additional Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special instructions for delivery"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-medium">{artwork.title}</span>
                <span>
                  <Price price={artwork.price} currency={artwork.currency} />
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>
                  {selectedDelivery ? (
                    <Price price={selectedDelivery.charges} currency={artwork.currency} />
                  ) : (
                    'Select city'
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>
                  <Price price={totalPrice} currency={artwork.currency} />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
