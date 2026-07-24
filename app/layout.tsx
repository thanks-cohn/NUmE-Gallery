import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NUME — Visual Index",
  description: "NUME is a living index of image, form and atmosphere.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
