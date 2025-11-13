import { type Metadata } from "next";
import { ReactQueryProvider } from "./client/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMK Fajar Sentosa",
  description: "Sistem Informasi Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Toaster />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
