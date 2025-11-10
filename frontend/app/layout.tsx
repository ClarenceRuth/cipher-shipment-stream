import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driver Performance Evaluation System",
  description: "Privacy-preserving driver performance evaluation using FHE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
