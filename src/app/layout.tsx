import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Trip Planner",
  description: "A premium, AI-powered trip planning experience.",
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
