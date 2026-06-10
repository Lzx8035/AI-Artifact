import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artifact 对话示例",
  description: "使用 HeroUI、iframe 预览和可调整分栏构建的静态对话示例。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
