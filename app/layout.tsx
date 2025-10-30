import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bảo tàng Chủ nghĩa Xã hội Khoa học",
  description:
    "Khám phá dân chủ xã hội chủ nghĩa và nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
