import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { StorefrontSessionProvider } from "@/components/providers/StorefrontSessionProvider";
import { StorefrontWishlistProvider } from "@/components/providers/StorefrontWishlistProvider";
import { StorefrontCartProvider } from "@/components/providers/StorefrontCartProvider";
import { ErrorToastHandler } from "@/components/ErrorToastHandler";
import { getStorefrontSession } from "@/lib/storefront-session";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const metha = localFont({
  src: "./fonts/Metha-Regular.ttf",
  variable: "--font-metha",
});

const mavine = localFont({
  src: "./fonts/Mavine-Bold.ttf",
  variable: "--font-mavine",
});

const black = localFont({
  src: "./fonts/Black Mustang.ttf",
  variable: "--font-black",
});

const cloisterBlack = localFont({
  src: "./fonts/CloisterBlack.ttf",
  variable: "--font-cloister",
});

export const metadata: Metadata = {
  title: "Nexoura",
  description: "Your product marketplace",
};

async function StorefrontSessionWrapper({ children }: { children: React.ReactNode }) {
  const session = await getStorefrontSession();

  return (
    <StorefrontSessionProvider initialSession={session}>
      <StorefrontWishlistProvider>
        <StorefrontCartProvider>
          {children}
        </StorefrontCartProvider>
      </StorefrontWishlistProvider>
    </StorefrontSessionProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${metha.variable} ${mavine.variable} ${black.variable} ${cloisterBlack.variable} antialiased min-h-screen overflow-x-hidden font-[family-name:var(--font-poppins)]`}
      >
        <ToastProvider>
          <ErrorToastHandler />
          <Suspense>
            <StorefrontSessionWrapper>
              {children}
            </StorefrontSessionWrapper>
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}

