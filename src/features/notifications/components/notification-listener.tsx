"use client";

import { useNotificationStream } from "../hooks/use-notification-stream";
import { useNotificationDevice } from "../hooks/use-notification-device";

export const NotificationListener = () => {
   useNotificationStream();
   useNotificationDevice();

   return null;
};
