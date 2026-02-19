import { WelcomeHero } from "@/components/welcome/welcome-hero"
import { PageTransition } from "@/components/ui/page-transition"

export default function WelcomePage() {
  return (
    <PageTransition>
      <WelcomeHero />
    </PageTransition>
  )
}