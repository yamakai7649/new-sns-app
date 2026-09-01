import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "就活体験記",
  description: "就活体験記を投稿・閲覧できるサービス",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
    >
      <body>
        <Header />

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
