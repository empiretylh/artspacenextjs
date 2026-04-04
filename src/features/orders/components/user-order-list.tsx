'use client'

import React from 'react'
import { useAuth } from '@/features/auth/store'
import { useGetUserOrders } from '../api/get-orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { getImage } from '@/lib/utils'
import { format } from 'date-fns'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { Loader2, Package } from 'lucide-react'

export const UserOrderList = () => {
  const { user } = useAuth()
  const userId = user?.id
  const { data: orders, isLoading, error } = useGetUserOrders(userId as number)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        Failed to load orders. Please try again later.
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="text-center py-20 border-dashed">
        <CardContent className="flex flex-col items-center gap-4">
          <Package className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No orders yet</h3>
            <p className="text-muted-foreground">When you buy an artwork, it will show up here.</p>
          </div>
          <Link to={paths.artworks.getHref()}>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-colors">
              Browse Artworks
            </Badge>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {orders.map((order) => {
        // Use either order_status or status
        const status = order.order_status || order.status || 'PENDING'
        const firstItem = order.items?.[0]
        const artwork = firstItem?.artwork

        return (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-mono">ORDER #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm">Placed on {format(new Date(order.created_at), 'PPP')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold">Total Price</p>
                    <p className="text-lg font-bold text-primary">
                      <Price
                        price={order.total_price}
                        currency={{
                          code: order.currency || 'MMK',
                          name: order.currency || 'MMK',
                          symbol: '',
                          numeric_code: ''
                        }}
                      />
                    </p>
                  </div>
                  <Badge
                    className={
                      status === 'COMPLETED' ? 'bg-green-500 hover:bg-green-600' :
                        status === 'PENDING' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          status === 'FAILED' ? 'bg-red-500 hover:bg-red-600' :
                            'bg-blue-500 hover:bg-blue-600'
                    }
                  >
                    {status}
                  </Badge>
                  {status === 'PENDING' && (order.payment_status === 'PENDING' || !order.payment_status) && (
                    <Link to={paths.order.payment.getHref(order.id)}>
                      <Button size="sm" className="font-bold">
                        Pay Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {artwork ? (
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 rounded-md overflow-hidden border">
                    <AppImage
                      src={getImage(artwork.image)}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1 py-1">
                    <Link to={paths.artworks.detail.getHref(artwork.id)}>
                      <h4 className="font-bold hover:underline">{artwork.title}</h4>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      by {artwork.artist_profile ? `${artwork.artist_profile.first_name} ${artwork.artist_profile.last_name}` : artwork.artist_name}
                    </p>
                    <p className="text-sm">Quantity: {firstItem.quantity}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic">Artwork details unavailable</p>
              )}
              {order.items && order.items.length > 1 && (
                <p className="mt-4 text-sm text-primary font-semibold">
                  + {order.items.length - 1} more items in this order
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
