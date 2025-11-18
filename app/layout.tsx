import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        {children}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-0 right-0 h-[60vh] bg-gradient-to-b from-transparent via-gray-300/40 to-gray-400/60"
            style={{
              bottom: '20%',
              transform: 'perspective(1200px) rotateX(75deg)',
              transformOrigin: 'center bottom',
              backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
              backgroundSize: '80px 80px',
              boxShadow: 'inset 0 -100px 100px -50px rgba(0,0,0,0.2)'
            }}
          />
          {/* Floor shadow gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"
            style={{ transform: 'translateY(50%)' }}
          />
        </div>
      </body>
    </html>
  );
}

function NavbarSkeleton() {
  return (
    <nav className="border-b bg-white">
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
