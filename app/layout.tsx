import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bảo tàng Tư tưởng Hồ Chí Minh",
  description:
    "Khám phá quá trình hình thành và phát triển tư tưởng Hồ Chí Minh, từ hành trình tìm đường cứu nước, hình thành cách mạng Việt Nam, đến giá trị đối với dân tộc và nhân loại.",
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
