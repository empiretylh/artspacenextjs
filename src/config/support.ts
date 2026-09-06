import { env } from './env';
import { UserRouteType } from '@/features/service/artspace/get-users';

export interface OrderInquiryContext {
  orderId?: string | number;
  orderCode?: string;
  artworkTitle?: string;
  artworkId?: string | number;
  artworkImage?: string;
  price?: string | number;
  currency?: string;
  status?: string;
}

export const SUPPORT_ACCOUNT = {
  userId: env.NEXT_PUBLIC_SUPPORT_USER_ID || '3',
  userType: (env.NEXT_PUBLIC_SUPPORT_USER_TYPE || 'collectors') as UserRouteType,
};

/**
 * Generates a polite, standardized initial inquiry message for an order.
 */
export const generateOrderInquiryMessage = (context: OrderInquiryContext): string => {
  const parts: string[] = [];
  const orderRef = context.orderCode ? `#${context.orderCode}` : context.orderId ? `Order #${context.orderId}` : 'my order';

  if (context.artworkTitle) {
    parts.push(`Hello! I would like to inquire about my ${orderRef} for "${context.artworkTitle}".`);
  } else {
    parts.push(`Hello! I would like to inquire about my ${orderRef}.`);
  }

  return parts.join(' ');
};
