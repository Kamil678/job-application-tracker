import { Hero } from "@/features/landing/components/hero";
import { SocialProof } from "@/features/landing/components/social-proof";
import { Features } from "@/features/landing/components/features";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { Stats } from "@/features/landing/components/stats";
import { Pricing } from "@/features/landing/components/pricing";
import { FAQ } from "@/features/landing/components/faq";
import { CTA } from "@/features/landing/components/cta";
import { Footer } from "@/features/landing/components/footer";

export default function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Stats />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
