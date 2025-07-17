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
  
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  //   { media: "(prefers-color-scheme: dark)", color: "#000000" },
  // ],
  
  openGraph: {
    title: "GRAY",
    description: "GRAY – A home for curious minds to publish and explore authentic stories",
    url: "https://your-domain.com", // Replace with your actual domain
    siteName: "GRAY",
    images: [{
      // 2. Use absolute URLs for OG images
      url: "https://your-domain.com/images/image.png", 
      width: 1200,
      height: 630,
      alt: "GRAY – A home for curious minds to publish and explore authentic stories",
    }],
    locale: "en_NG",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "GRAY",
    description: "GRAY – A home for curious minds to publish and explore authentic stories",
    // 3. Fixed image path typo + absolute URL
    images: [{ 
      url: "https://your-domain.com/images/image.png" 
    }],
  },
  
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // manifest: "/site.webmanifest",
};

// 4. Separate viewport export (required in Next.js 14+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
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
