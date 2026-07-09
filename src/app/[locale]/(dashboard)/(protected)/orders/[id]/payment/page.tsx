import React from 'react'
import { PaymentPage } from '@/features/orders/pages/payment-page'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <PaymentPage orderId={id} />
  )
}

export default page
