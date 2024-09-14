import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "阿sssssp",
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body>22222 {children}</body>
      </html>
    );
  }