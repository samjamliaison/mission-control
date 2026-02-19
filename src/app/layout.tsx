import type { Metadata } from "next"
import { Geist, Plus_Jakarta_Sans } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { PageTransitionProvider } from "@/components/ui/page-transition"
import "./globals.css"

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
        <div className="min-h-screen bg-[#09090b] flex">
          <Navigation />
          <main className="flex-1 min-h-screen">
            <PageTransitionProvider>
              <div className="p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </PageTransitionProvider>
          </main>
        </div>
      </body>
    </html>
  )
}