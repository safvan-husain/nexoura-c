import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const metha = localFont({
  src: "../public/fonts/Metha-Regular.ttf",
  variable: "--font-metha",
});

const mavine = localFont({
  src: "../public/fonts/Mavine-bold.ttf",
  variable: "--font-mavine",
});

const black = localFont({
  src: "../public/fonts/Black Mustang.ttf",
  variable: "--font-mavine",
});

const cloisterBlack = localFont({
  src: "../public/fonts/CloisterBlack.ttf",
  variable: "--font-mavine",
});

export const metadata: Metadata = {
  title: "Nexoura",
  description: "Your product marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          background: 'linear-gradient(to bottom, #dddddbff 0%, #ebebebff 50%, #ffffff 60%, #ffffff 100%)'
        }}
        className={`${poppins.variable} ${metha.variable} ${mavine.variable} ${black.variable} antialiased min-h-screen font-[family-name:var(--font-poppins)]`}
      >
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

function NavbarSkeleton() {
  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-blue-600">Nexoura</div>
            <div className="flex gap-6">
              <div className="text-gray-700">Home</div>
              <div className="text-gray-700">Products</div>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </nav>
  );
}
