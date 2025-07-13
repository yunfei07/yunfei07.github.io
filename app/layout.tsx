import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/app/styles/btn.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
// import { ThemeProvider } from "@/lib/theme/theme-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://yunfei07.github.io"),
  title: {
    template: "%s | Fei",
    default: "Fei - Full Stack Software Engineer & AI Creator",
  },
  description: "Fei is a full stack software engineer and AI creator.",
  twitter: {
    title: {
      template: "%s | Fei",
      default: "Fei - Full Stack Software Engineer & AI Creator",
    },
    description: "Fei is a full stack software engineer and AI creator.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 800,
        height: 600,
      },
    ],
  },
  openGraph: {
    title: {
      template: "%s | Fei",
      default: "Fei - Full Stack Software Engineer & AI Creator",
    },
    description: "Fei is a full stack software engineer and AI creator.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 800,
        height: 600,
        alt: "Fei",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} dark:dark overflow-x-hidden bg-app-bg text-high-contrast-text`}
      >
        <Toaster
          toastOptions={{
            duration: 4000,
            className: "select-none",
          }}
        />
        {/* <Analytics /> */}
        <PlausibleProvider
          domain="yunfei07.github.io"
          trackOutboundLinks={true}
          taggedEvents={true}
        >
          <>{children}</>
        </PlausibleProvider>
      </body>
    </html>
  );
}
