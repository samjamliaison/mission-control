import type { Metadata } from "next"
import { Geist, Plus_Jakarta_Sans } from "next/font/google"
import { RootLayoutClient } from "@/components/layout/root-layout-client"
import "./globals.css"
import "../styles/print.css"

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
})

export const metadata: Metadata = {
  title: "Mission Control | Command Center",
  description: "Advanced task management dashboard for OpenClaw operations. Manage agents, track activities, organize tasks with an intuitive isometric interface.",
  keywords: "task management, agent control, dashboard, OpenClaw, mission control, productivity, automation",
  authors: [{ name: "OpenClaw Team" }],
  creator: "OpenClaw",
  publisher: "OpenClaw",
  robots: "index, follow",
  openGraph: {
    title: "Mission Control | Command Center",
    description: "Advanced task management dashboard for OpenClaw operations. Manage agents, track activities, organize tasks with an intuitive isometric interface.",
    type: "website",
    locale: "en_US",
    siteName: "Mission Control",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mission Control Dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mission Control | Command Center", 
    description: "Advanced task management dashboard for OpenClaw operations",
    images: ["/og-image.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon.png",
    },
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="application-name" content="Mission Control" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mission Control" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1a1a2e" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${geist.variable} ${plusJakarta.variable} antialiased`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}