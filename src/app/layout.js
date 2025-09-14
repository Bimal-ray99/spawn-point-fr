import "./globals.css";
import { Toaster } from "sonner";
import PWAUpdateToast from "@/components/pwa/pwa-update-toast";
import Header from "@/components/Header";
import PageTransition from "@/components/TransitionLayer";
import TransitionWrapper from "@/components/TransitionLayer";

export const metadata = {
  title: "Spawn Point",
  description: "Sessions, points, food & bookings.",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="bottom-right" richColors closeButton />
        <PWAUpdateToast />
        <TransitionWrapper />
        <Header />
        {children}
      </body>
    </html>
  );
}
