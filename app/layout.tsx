import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {ClerkProvider} from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VillaAcapella",
  description: "VillaAcapella facilitating online bookings and enhancing the overall guest experience",
  icons:{
    icon: '/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg"/>
      </head>
      <body className={inter.className}>
        {/* <Navbar/> */}
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
