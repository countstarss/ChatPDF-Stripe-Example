import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "./globals.css";
import QueryProviders from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatPDF",
  description: "通过上传PDF文件作为上下文,提问chatgpt,并且获得有关内容的回答-Ask chatgpt questions and get answers about the content by uploading a PDF file as context",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProviders>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
          
        </html>
      </QueryProviders>
    </ClerkProvider>
  );
}
