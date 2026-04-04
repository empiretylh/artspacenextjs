'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetOrder } from '../api/get-orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Price from '@/components/common/price';
import AppImage from '@/components/common/app-image';
import { getImage } from '@/lib/utils';
import { format } from 'date-fns';
import Link from '@/components/common/link';
import { paths } from '@/config/paths';
import { Loader2, ArrowLeft, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderDetail = () => {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading, error } = useGetOrder(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-4">
        <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <Package className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1">
            <h2 className="text-2xl font-bold">Order not found</h2>
            <p className="text-muted-foreground">We couldn't find the order you were looking for.</p>
        </div>
        <Link to={paths.order.getHref()}>
          <Button variant="outline">Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const orderStatus = order.order_status || order.status || 'PENDING';
  const paymentStatus = order.payment_status || 'PENDING';

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-0 py-8 lg:py-12 space-y-8">
      {/* Top Navigation */}
      <Link to={paths.order.getHref()} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-2 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to My Orders
      </Link>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider">
               #{order.id.slice(0, 8)}
             </Badge>
             <Badge 
               className={
                 orderStatus === 'COMPLETED' ? 'bg-green-500 hover:bg-green-600' :
                 orderStatus === 'PENDING' ? 'bg-yellow-500 hover:bg-yellow-600' :
                 orderStatus === 'FAILED' ? 'bg-red-500 hover:bg-red-600' :
                 'bg-blue-500 hover:bg-blue-600'
               }
             >
               {orderStatus}
             </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Placed on {format(new Date(order.created_at), 'PPPP')}
          </p>
        </div>

        <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Amount</p>
            <div className="text-3xl font-black text-primary">
                <Price
                    price={order.total_price}
                    currency={{
                    code: order.currency || 'MMK',
                    name: order.currency || 'MMK',
                    symbol: '',
                    numeric_code: ''
                    }}
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden bg-muted/20">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Artworks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start group">
                    <div className="relative h-32 w-32 shrink-0 rounded-xl overflow-hidden border shadow-sm group-hover:shadow-md transition-shadow">
                      <AppImage
                        src={getImage(item.artwork.image)}
                        alt={item.artwork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 space-y-3 py-2 text-center sm:text-left">
                      <div className="space-y-1">
                        <Link to={paths.artworks.detail.getHref(item.artwork.id)} className="group-hover:text-primary transition-colors">
                          <h4 className="text-xl font-bold leading-none">{item.artwork.title}</h4>
                        </Link>
                        <p className="text-muted-foreground">
                          by {item.artwork.artist_profile ? `${item.artwork.artist_profile.first_name} ${item.artwork.artist_profile.last_name}` : item.artwork.artist_name}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground uppercase">Quantity</span>
                            <span className="font-bold">{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground uppercase">Price</span>
                            <span className="font-bold text-primary">
                                <Price
                                    price={item.price_at_purchase || item.artwork.price}
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
                      <Link to={paths.artworks.detail.getHref(item.artwork.id)}>
                        <Button variant="link" className="p-0 h-auto font-bold text-primary">View Artwork</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Info */}
        <div className="space-y-8">
           <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery & Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer</p>
                  {typeof order.buyer === 'object' ? (
                    <>
                      <p className="font-semibold">{order.buyer.first_name} {order.buyer.last_name}</p>
                      <p className="text-sm text-muted-foreground">{order.buyer.email}</p>
                    </>
                  ) : (
                    <p className="font-semibold">Customer ID: #{order.buyer}</p>
                  )}
                </div>
                <div className="space-y-1 pt-2 border-t border-border">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shipping Address</p>
                  <p className="text-sm leading-relaxed">{order.shipping_address}</p>
                </div>
                {order.phone_number && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact</p>
                    <p className="text-sm">{order.phone_number}</p>
                  </div>
                )}
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                 <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={paymentStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                      {paymentStatus}
                    </Badge>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Payment Date</span>
                    <span className="text-sm text-muted-foreground">
                      {order.paid_at ? format(new Date(order.paid_at), 'PPP') : 'N/A'}
                    </span>
                 </div>
                 {orderStatus === 'PENDING' && (paymentStatus === 'PENDING') && (
                    <Link to={paths.order.payment.getHref(order.id)} className="block pt-2">
                      <Button className="w-full font-bold shadow-lg shadow-primary/20">
                        Complete Payment
                      </Button>
                    </Link>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
