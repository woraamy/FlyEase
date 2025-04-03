import type { Metadata } from "next";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/components/Providers'; // react query
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'

const plusJakartaSans = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add weights as needed
  variable: "--font-plus-jakarta-sans", // Custom CSS variable for Tailwind
});

export const metadata: Metadata = {
  title: "Flight Booking | FlyEase",
  description: "Book your flights with ease and convenience",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.className}>
      <body className={`bg-gray-50 min-h-screen flex flex-col`}>
        <ClerkProvider>
          <Providers>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}