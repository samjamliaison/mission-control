import type { Metadata } from "next"
import { Instrument_Sans } from "next/font/google"
import "./globals.css"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
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
      <body className={`${instrumentSans.variable} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--command-background))] to-[hsl(220_13%_3%)]">
          {children}
        </div>
      </body>
    </html>
  )
}