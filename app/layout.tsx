import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bảo tàng Điện Biên Phủ Trên Không",
  description:
    "Khám phá 12 ngày đêm khói lửa Hà Nội tháng 12/1972 - Chiến thắng vang dội đánh bại cuộc tập kích chiến lược của Mỹ",
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
