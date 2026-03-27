import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Order, User } from '@/types';
import React from 'react';

type OrderView = Omit<Order, "buyer" | "items"> & {
  buyer: User;
  items: Array<{
    id: number;
    artworkId: string;
    quantity: number;
    price_at_purchase: number;
  }>;
};

const buyer: User = {
  id: 201,
  first_name: "Jane",
  last_name: "Smith",
  email: "j.smith@example.com",
  user_type: "BUYER",
  profile: {
    bio: "",
    about: "",
    profile_picture: null,
    cover_photo: null,
    website: "",
    features_photos: [],
    is_following: false,
    isBlocked: false,
  },
};

// Using ord_1001 from the previous mock data
const orderData: OrderView = {
  id: "ord_1001",
  buyerId: 201,
  buyer,
  total_price: 154.99,
  shipping_address: "101 Innovation Way, Tech City, 90210",
  stripe_session_id: "cs_test_a7b2c9",
  status: "COMPLETED",
  paid_at: new Date("2026-01-02T10:30:00Z"),
  created_at: new Date("2026-01-01T09:00:00Z"),
  updated_at: new Date("2026-01-02T14:20:00Z"),
  items: [
    { id: 1, artworkId: "51", quantity: 2, price_at_purchase: 77.49 }
  ]
};

const OrderDetail = () => {
  return (
    <Card>
      {/* Header */}
      <CardHeader>
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{orderData.id}</h1>
            <p className="text-muted-foreground">
              Placed on {orderData.created_at.toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${orderData.status === 'COMPLETED'
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            {orderData.status}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer & Shipping Info */}
          <section>
            <h2 className="text-lg font-semibold mb-3 border-l-4 border-primary pl-2">
              Customer Details
            </h2>
            <div className="space-y-1 text-foreground">
              <p>
                <strong>Name:</strong>{" "}
                {orderData.buyer.first_name} {orderData.buyer.last_name}
              </p>
              <p><strong>Email:</strong> {orderData.buyer.email}</p>
              <p className="mt-4 font-semibold">Shipping Address:</p>
              <p className="text-sm text-muted-foreground">
                {orderData.shipping_address}
              </p>
            </div>
          </section>

          {/* Payment Info */}
          <section>
            <h2 className="text-lg font-semibold mb-3 border-l-4 border-primary pl-2">
              Payment Information
            </h2>
            <div className="space-y-1 text-foreground">
              <p><strong>Status:</strong> {orderData.paid_at ? 'Paid' : 'Unpaid'}</p>
              {orderData.paid_at && (
                <p><strong>Paid On:</strong> {orderData.paid_at.toLocaleString()}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Stripe Session: {orderData.stripe_session_id || 'N/A'}
              </p>
            </div>
          </section>
        </div>

        {/* Order Items Table */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-y border-border">
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-4 px-4 text-primary font-medium">
                    #{item.artworkId}
                  </td>
                  <td className="py-4 px-4 text-center">{item.quantity}</td>
                  <td className="py-4 px-4 text-right">
                    ${item.price_at_purchase.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold">
                    ${(item.price_at_purchase * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-6 px-4 text-right font-bold text-lg">
                  Total Amount:
                </td>
                <td className="py-6 px-4 text-right font-bold text-xl text-primary">
                  ${orderData.total_price.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetail;
