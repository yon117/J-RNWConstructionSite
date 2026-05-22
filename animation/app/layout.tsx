import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "J&R Interactive House",
  description: "Interactive exterior and interior construction service preview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
