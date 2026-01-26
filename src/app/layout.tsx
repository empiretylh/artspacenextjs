import { ScrollToTop } from "@/components/common/scroll-to-top";
import { AuthInitializer } from "@/features/auth/auth-initializer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import AppProvider from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Myanmar Art Space",
  description: "Social Media and E-commerce Platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  // Get the user data you stored in the cookie during login
  const authSession = cookieStore.get("artspace_auth_session")?.value;
  const initialData = authSession ? JSON.parse(authSession) : { user: null, accessToken: null };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer data={initialData} />
        <AppProvider>
          <ScrollToTop />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
