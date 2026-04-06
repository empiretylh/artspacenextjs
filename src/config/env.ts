import * as z from 'zod';
import 'dotenv/config';

const createEnv = () => {
   const EnvSchema = z.object({
      API_URL: z.string(),
      ENABLE_API_MOCKING: z
         .string()
         .refine((s) => s === 'true' || s === 'false')
         .transform((s) => s === 'true')
         .optional(),
      APP_URL: z.string("App URL is required"),
      APP_MOCK_API_PORT: z.string().optional().default('8080'),
      ENABLE_ANALYTICS: z.string().optional().default('false'),
      GA_ID: z.string().optional(),
      NODE_ENV: z.enum(['development', 'production']).optional().default('development'),
      IMAGE_HOSTNAME: z.string().optional().default('api.myanmarartspace.net'),
      TZ: z.string().optional().default('Asia/Yangon'),
      PAYMENT_API_URL: z.string().optional().default('https://pg.mmgbpay.com'),
      PAYMENT_API_TOKEN: z.string().optional(),
      // firebase
      FIREBASE_ENABLE: z.string().optional().default('false').transform((s) => s === 'true'),
      FIREBASE_API_KEY: z.string().optional(),
      FIREBASE_AUTH_DOMAIN: z.string().optional(),
      FIREBASE_PROJECT_ID: z.string().optional(),
      FIREBASE_STORAGE_BUCKET: z.string().optional(),
      FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
      FIREBASE_APP_ID: z.string().optional(),
      FIREBASE_MEASUREMENT_ID: z.string().optional(),
      // firebase admin
      FIREBASE_PRIVATE_KEY: z.string().optional().transform((v) => v?.replace(/\\n/g, '\n')),
      FIREBASE_CLIENT_EMAIL: z.string().optional(),
   }).superRefine((env, ctx) => {
      if (env.ENABLE_ANALYTICS && !env.GA_ID) {
         ctx.addIssue({
            path: ['GA_ID'],
            message: 'GA_ID is required when ENABLE_ANALYTICS is true',
            code: z.ZodIssueCode.custom,
         });
      }
   });;

   const envVars = {
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
      APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
      ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
      GA_ID: process.env.NEXT_PUBLIC_GA_ID,
      NODE_ENV: process.env.NODE_ENV,
      IMAGE_HOSTNAME: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME,
      TZ: process.env.NEXT_PUBLIC_TZ,
      PAYMENT_API_URL: process.env.NEXT_PUBLIC_PAYMENT_API_URL,
      PAYMENT_API_TOKEN: process.env.PAYMENT_API_TOKEN,
      // firebase
      FIREBASE_ENABLE: process.env.NEXT_PUBLIC_FIREBASE_ENABLE,
      FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      // firebase admin
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
   };

   const parsedEnv = EnvSchema.safeParse(envVars);

   console.log(parsedEnv)

   if (!parsedEnv.success) {
      throw new Error(
         `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
            .map(([k, v]) => `- ${k}: ${v}`)
            .join('\n')}
  `,
      );
   }

   return parsedEnv.data ?? {};
};

export const env = createEnv();
