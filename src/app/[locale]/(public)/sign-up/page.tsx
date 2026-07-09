import { env } from "@/config/env";
import RegisterPage from "@/features/auth/page/register-page";
import type { Metadata } from "next";

const title = "Sign Up";
const description =
  "Create a new account to join Myanmar Art Space and explore exclusive features, artists, and collections.";
const url = `${env.APP_URL}/sign-up`;
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
    "sign up",
    "register",
    "create account",
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
        alt: "Sign Up - Myanmar Art Space",
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

export default function RegisterRoute() {
  return <RegisterPage />;
}
