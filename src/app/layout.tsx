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
  description: "Advanced task management dashboard for OpenClaw operations",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${plusJakarta.variable} antialiased`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}