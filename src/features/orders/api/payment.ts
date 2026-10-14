'use server'

import axios, { isAxiosError } from 'axios';
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

  try {
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

    console.log('Payment API Response:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Payment Gateway API Error Details:', {
        url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      const detail =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response?.data : null) ||
        JSON.stringify(error.response?.data) ||
        error.message;

      throw new Error(`Payment Gateway Error (${error.response?.status}): ${detail}`);
    }

    throw error;
  }
};

