'use server'

import axios from 'axios';
import { env } from '@/config/env';

export type PaymentIntentResponse = {
  txn_id: string;
  expires_in_seconds: number;
  payment_url: string;
};

export const createPaymentIntent = async ({
  amount,
  description,
}: {
  amount: number;
  description: string;
}): Promise<PaymentIntentResponse> => {
  const url = `${env.PAYMENT_API_URL}/api/h5/create-transaction/`;
  const token = env.PAYMENT_API_TOKEN;

  if (!token) {
    throw new Error('Payment API token is missing in environment variables');
  }

  const response = await axios.post(
    url,
    {
      amount,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
