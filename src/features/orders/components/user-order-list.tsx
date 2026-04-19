'use client'

import React, { useState } from 'react'
import { useAuth } from '@/features/auth/store'
import { useGetUserOrders } from '../api/get-orders'
import { useUpdateOrder } from '../api/update-order'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Price from '@/components/common/price'
import AppImage from '@/components/common/app-image'
import { getImage, getUserRouteType } from '@/lib/utils'
import { format } from 'date-fns'
import Link from '@/components/common/link'
import { paths } from '@/config/paths'
import { Loader2, Package, MessageSquare } from 'lucide-react'
import { env } from '@/config/env'
import { cn } from '@/lib/utils'
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
} from "@/components/ui/alert-dialog"

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
      updateOrder.mutate({ orderId: orderIdToCancel, data: { order_status: "CANCELLED" } })
      setOrderIdToCancel(null)
    }
  }

  const hasFilters = Object.keys(filters).length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-destructive/10 rounded-2xl border border-destructive/20 text-destructive font-bold p-8">
        Failed to load orders. Please try again later.
      </div>
    )
  }

  if (!orders || orders.results.length === 0) {
    return (
      <Card className="text-center py-20 border-dashed bg-muted/20 border-2 rounded-3xl">
        <CardContent className="flex flex-col items-center gap-6">
          <Package className="h-16 w-16 text-muted-foreground/50" />
          <div className="space-y-2">
            <h3 className="font-black text-2xl uppercase tracking-tight text-primary font-display">
              {hasFilters ? "No matching orders" : "No orders yet"}
            </h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto font-sans">
              {hasFilters
                ? "Try adjusting your filters to find what you're looking for."
                : "When you buy an artwork, it will show up here."}
            </p>
          </div>
          <div className="flex gap-3">
            {hasFilters ? (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="font-bold uppercase tracking-widest text-xs border-2 font-sans"
              >
                Clear all filters
              </Button>
            ) : (
              <Link to={paths.artworks.getHref()}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-colors py-2 px-6 font-bold uppercase tracking-widest text-xs bg-background border-2 font-sans">
                  Browse Artworks
                </Badge>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {orders.results.map((order) => {
        // Use either order_status or status
        const status = order.order_status || order.status || 'PENDING'
        const firstItem = order.items?.[0]
        const artwork = firstItem?.artwork

        return (
          <Card key={order.id} className="overflow-hidden hover:shadow-md transition-all duration-300 group border-primary/10">
            <div className="bg-muted/30 p-6 pb-4 border-b border-border">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link to={paths.order.detail.getHref(order.id)} className="space-y-1 block hover:opacity-80 transition-opacity">
                  <p className="text-xs text-muted-foreground font-mono font-bold tracking-wider uppercase font-sans">ORDER #{order.id.slice(0, 8)}</p>
                  <p className="text-sm font-medium font-sans">Placed on {format(new Date(order.created_at), 'PPP')}</p>
                </Link>
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-0.5">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest font-sans">Total Price</p>
                    <p className="text-lg font-black text-primary font-display">
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
                    className={cn(
                      "font-sans font-bold",
                      status === 'COMPLETED' ? 'bg-green-500 hover:bg-green-600 shadow-sm' :
                        status === 'PENDING' ? 'bg-yellow-500 hover:bg-yellow-600 shadow-sm' :
                          status === 'FAILED' ? 'bg-red-500 hover:bg-red-600 shadow-sm' :
                            status === 'CANCELLED' ? 'bg-slate-500 hover:bg-slate-600 shadow-sm' :
                              'bg-blue-500 hover:bg-blue-600 shadow-sm'
                    )}
                  >
                    {status}
                  </Badge>
                  {status === 'PENDING' && (order.payment_status === 'PENDING' || order.payment_status === 'FAILED' || !order.payment_status) && (
                    <div className="flex gap-2">
                      <Link to={paths.order.payment.getHref(order.id)}>
                        <Button size="sm" className="font-bold shadow-lg shadow-primary/20 font-sans">
                          Pay Now
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(order.id)}
                        disabled={updateOrder.isPending}
                        className="font-bold font-sans border-2"
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Link to={paths.order.detail.getHref(order.id)} className="block">
              <CardContent className="hover:bg-muted/10 transition-colors">
                {artwork ? (
                  <div className="flex gap-6">
                    <div className="relative h-28 w-28 shrink-0 rounded-xl overflow-hidden border shadow-sm group-hover:shadow-md transition-all duration-500">
                      <AppImage
                        src={getImage(artwork.image)}
                        alt={artwork.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="space-y-2 py-1">
                      <div className="space-y-0.5">
                        <h4 className="text-xl font-bold group-hover:text-primary transition-colors font-display tracking-tight">{artwork.title}</h4>
                        <p className="text-sm text-muted-foreground font-sans">
                          by {artwork.artist_profile ? `${artwork.artist_profile.first_name} ${artwork.artist_profile.last_name}` : artwork.artist_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quantity</span>
                          <span className="text-sm font-black">{firstItem.quantity}</span>
                        </div>
                        {order.items && order.items.length > 1 && (
                          <Badge variant="secondary" className="text-[10px] font-bold uppercase font-sans">
                            + {order.items.length - 1} more items
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <Button variant="link" className="p-0 h-auto font-bold text-primary text-xs font-sans uppercase tracking-widest">View Details</Button>
                        {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && artwork?.current_owner_display && (
                          <Link 
                            to={paths.chats.getHref({ 
                              userId: artwork.current_owner_display.id, 
                              userType: getUserRouteType(artwork.current_owner_display.user_type) 
                            })}
                          >
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors h-auto py-1 px-2 rounded-lg hover:bg-primary/5 text-[10px] uppercase tracking-widest font-sans"
                            >
                              <MessageSquare className="h-3 w-3" />
                              Contact Seller
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-4 text-muted-foreground italic">
                    <Package className="h-5 w-5" />
                    Artwork details unavailable
                  </div>
                )}
              </CardContent>
            </Link>
          </Card>
        )
      })}
      {orders && orders.count > 0 && (
        <Pagination
          total={orders.count}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          showLimitSelector={false}
        />
      )}
      <AlertDialog open={!!orderIdToCancel} onOpenChange={(open) => !open && setOrderIdToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold font-sans">Cancel Order</AlertDialogTitle>
            <AlertDialogDescription className="font-medium font-sans">
              Are you sure you want to cancel this order? This action cannot be undone and will stop any further processing for this order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold border-2">Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
