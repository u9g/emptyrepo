
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minecraft Mixin Leaderboard",
  description: "A leaderboard of Minecraft repositories referenced by Mixins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
