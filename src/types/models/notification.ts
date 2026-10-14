export type NotificationType =
   | "NEW_ARTWORK_FROM_FOLLOWED_ARTIST"
   | "NEW_FOLLOWER"
   | "NEW_EVENT"
   | "ORDER_PAYMENT_COMPLETED"
   | "ARTWORK_SOLD"
   | "ORDER_STATUS_CHANGED"
   | "ADMIN_BROADCAST"
   | "SYSTEM";

export interface AppNotification {
   id: number;
   type: NotificationType;
   title: string;
   message: string;
   image_url?: string;
   deep_link?: string;
   web_route?: string;
   is_read: boolean;
   created_at: string;
}

export type NotificationPlatform = "ANDROID" | "IOS" | "WEB";

export interface NotificationDevicePayload {
   token: string;
   platform: NotificationPlatform;
   app_version?: string;
}

export type NotificationEventType =
   | "RECEIVED"
   | "OPENED"
   | "DISMISSED"
   | "DEEPLINK_OPENED"
   | "SSE_RECEIVED";

export interface NotificationEventPayload {
   event_type: NotificationEventType;
   device_token?: string;
   metadata?: Record<string, any>;
}
