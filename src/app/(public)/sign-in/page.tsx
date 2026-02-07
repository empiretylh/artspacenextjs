import { env } from "@/config/env";
import LoginPage from "@/features/auth/page/login-page";
import type { Metadata } from "next";
import { Suspense } from "react";

const title = "Sign In";
const description =
  "Sign in to Myanmar Art Space to access your account, discover new artists, and explore curated collections.";
const url = `${env.APP_URL}/sign-in`;
const ogImage = `${env.APP_URL}/og-images/opengraph-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),

  title,
  description,

  alternates: {
    canonical: url,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  keywords: [
    "Myanmar Art Space",
    "sign in",
    "login",
    "member access",
    "Myanmar art",
    "artists",
    "art community",
  ],

  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName: "Myanmar Art Space",
    images: [
      {
        url: ogImage,
        width: 1920,
        height: 1080,
        alt: "Sign In - Myanmar Art Space",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

const LoginRoute = () => {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
};

export default LoginRoute;
