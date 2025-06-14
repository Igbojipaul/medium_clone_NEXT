import "./globals.css";
import ClientProviders from "../components/ClientProviders";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: {
    default: "GRAY",
    template: "%s | GRAY",
  },
  description: "GRAY – A home for curious minds to publish and explore authentic stories",
  keywords: ["GRAY", "blog", "articles", "community", "intuition"],
  authors: [{ name: "Gray", url: "https://gray.com" }],
  openGraph: {
    title: "GRAY",
    description: "GRAY – A home for curious minds to publish and explore authentic stories",
    url: "https://your-domain.com",
    siteName: "GRAY",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "GRAY – A home for curious minds to publish and explore authentic stories",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRAY",
    description: "GRAY – A home for curious minds to publish and explore authentic stories",
    images: ["/imaes/image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  // You can also add robots, alternates, etc., as needed.
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
