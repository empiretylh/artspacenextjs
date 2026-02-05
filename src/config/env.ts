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
      IMAGE_HOSTNAME: z.string().optional().default('artspaceapi-stagging.illuminati.com.mm'),
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
      IMAGE_HOSTNAME: process.env.IMAGE_HOSTNAME,
   };

   const parsedEnv = EnvSchema.safeParse(envVars);

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
