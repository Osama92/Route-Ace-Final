import LandingHero from "@/components/landing/LandingHero";
import LandingDistributionReality from "@/components/landing/LandingDistributionReality";
import LandingNigeriaMap from "@/components/landing/LandingNigeriaMap";
import LandingLogisticsOS from "@/components/landing/LandingLogisticsOS";
import LandingSalesDistribution from "@/components/landing/LandingSalesDistribution";
import LandingSynergyExport from "@/components/landing/LandingSynergyExport";
import LandingGrowthFunnel from "@/components/landing/LandingGrowthFunnel";
import LandingLiveIntelligence from "@/components/landing/LandingLiveIntelligence";
import LandingPricingSection from "@/components/landing/LandingPricingSection";
import LandingBottomCTA from "@/components/landing/LandingBottomCTA";

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <LandingHero />
    <LandingDistributionReality />
    <LandingNigeriaMap />
    <LandingLogisticsOS />
    <LandingSalesDistribution />
    <LandingSynergyExport />
    <LandingGrowthFunnel />
    <LandingLiveIntelligence />
    <LandingPricingSection />
    <LandingBottomCTA />
  </div>
);

export default LandingPage;
