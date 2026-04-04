'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, ChevronLeft } from 'lucide-react'
import { useGetOrder } from '../api/get-order'
import { createPaymentIntent } from '../api/payment'
import { useUpdateOrder } from '../api/update-order'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { getImage } from '@/lib/utils'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { toast } from 'sonner'

interface PaymentPageProps {
  orderId: string
}

export const PaymentPage = ({ orderId }: PaymentPageProps) => {
  const { data: order, isLoading: isOrderLoading, error: orderError } = useGetOrder({ orderId })
  const updateOrder = useUpdateOrder()
  const [isProcessing, setIsProcessing] = useState(false)

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

      // 3. Redirect to Payment URL
      window.location.href = paymentIntent.payment_url
    } catch (error: any) {
      console.error('Payment initialization failed:', error)
      toast.error(error.message || 'Payment initialization failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isOrderLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (orderError || !order) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error loading order</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
        <Link to={paths.order.getHref()}>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>
    )
  }

  if (order.payment_status === 'COMPLETED') {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6 font-bold text-3xl italic">
          ✓
        </div>
        <h2 className="text-2xl font-bold mb-4">Payment Completed</h2>
        <p className="text-muted-foreground mb-8">This order has already been paid for.</p>
        <Link to={paths.order.detail.getHref(order.id)}>
          <Button>View Order Details</Button>
        </Link>
      </div>
    )
  }

  const firstItem = order.items?.[0]
  const artwork = firstItem?.artwork

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to={paths.order.getHref()} className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Orders
        </Link>
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <Badge variant="outline" className="bg-background">
              {order.payment_status || 'PENDING'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" /> Order Summary
            </h3>
            
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              {artwork && (
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden border bg-background">
                    <AppImage
                      src={getImage(artwork.image)}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{artwork.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {artwork.artist_profile ? `${artwork.artist_profile.first_name} ${artwork.artist_profile.last_name}` : artwork.artist_name}
                    </p>
                    <p className="text-sm mt-1">Quantity: {firstItem.quantity}</p>
                  </div>
                  <div className="text-right">
                    <Price
                      price={firstItem.price_at_purchase}
                      currency={{
                        code: order.currency || 'MMK',
                        name: order.currency || 'MMK',
                        symbol: '',
                        numeric_code: ''
                      }}
                    />
                  </div>
                </div>
              )}
              
              {order.items && order.items.length > 1 && (
                <p className="text-sm text-primary font-medium text-center">
                  + {order.items.length - 1} more items in this order
                </p>
              )}

              <hr className="border-border/50" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Price</span>
                  <span>
                    <Price
                      price={order.price || '0'}
                      currency={{
                        code: order.currency || 'MMK',
                        name: order.currency || 'MMK',
                        symbol: '',
                        numeric_code: ''
                      }}
                    />
                  </span>
                </div>
                {parseFloat(order.tax || '0') > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>
                      <Price
                        price={order.tax || '0'}
                        currency={{
                          code: order.currency || 'MMK',
                          name: order.currency || 'MMK',
                          symbol: '',
                          numeric_code: ''
                        }}
                      />
                    </span>
                  </div>
                )}
                {parseFloat(order.deli_fee || '0') > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>
                      <Price
                        price={order.deli_fee || '0'}
                        currency={{
                          code: order.currency || 'MMK',
                          name: order.currency || 'MMK',
                          symbol: '',
                          numeric_code: ''
                        }}
                      />
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    <Price
                      price={order.total_price}
                      currency={{
                        code: order.currency || 'MMK',
                        name: order.currency || 'MMK',
                        symbol: '',
                        numeric_code: ''
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info Card */}
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Shipping To</h4>
            <p className="font-medium">{order.name}</p>
            <p className="text-sm whitespace-pre-wrap">{order.shipping_address}</p>
            <p className="text-sm">{order.phone_number}</p>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-6 border-t bg-muted/10">
          <Button 
            className="w-full h-12 text-lg font-bold" 
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Initializing Payment...
              </>
            ) : (
              'Proceed to Secure Payment'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to our secure payment partner to complete your transaction.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
