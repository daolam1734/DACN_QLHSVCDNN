import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DA QLHSVC",
  description: "Next.js project with TypeScript and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
