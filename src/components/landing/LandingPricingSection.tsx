import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Bike, Truck, Layers, Store, Building2, Pill, Lock, ArrowRight, Calculator } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import PricingSimulator from "./PricingSimulator";

const LOGISTICS_PLANS = [
  {
    name: "Starter",
    price: "Free",
    sub: "Single operator access",
    icon: Truck,
    features: [
      "Single user access",
      "Create & manage dispatches",
      "Raise invoices",
      "Capture expenses",
      "Send emails to customers",
      "Real-time tracking",
    ],
    highlighted: false,
    rateLimits: "30 req/min · 5,000 req/day",
  },
  {
    name: "Bikes / Vans",
    price: "₦50/drop",
    sub: "Pay per delivery",
    icon: Bike,
    features: [
      "Everything in Starter",
      "Dispatch & tracking",
      "Driver management",
      "Basic analytics",
      "Full fleet management",
      "SLA engine & breach costing",
    ],
    highlighted: false,
  },
  {
    name: "Heavy Truck / Haulage",
    price: "₦5,000/vehicle/mo",
    sub: "VAT exclusive · per active vehicle",
    icon: Truck,
    features: [
      "Everything in Starter",
      "Unlimited dispatches per vehicle",
      "Full fleet management",
      "SLA engine & breach costing",
      "Resell up to 10 licenses",
    ],
    highlighted: true,
  },
  {
    name: "Mixed Fleet",
    price: "₦5,000/vehicle + ₦50/drop",
    sub: "Hybrid · best of both",
    icon: Layers,
    features: [
      "Everything in Haulage & Bikes",
      "Per-vehicle base + per-drop",
      "All vehicle types",
      "Full platform access",
    ],
    highlighted: false,
  },
];

const INDUSTRY_PLANS = [
  {
    name: "Free",
    price: "₦0",
    sub: "Up to 2 users",
    icon: Store,
    features: [
      "Lead management (basic)",
      "Accounts & contacts",
      "Manual order entry",
      "Basic reporting",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₦15,000/user/mo",
    sub: "Full Sales OS",
    icon: Building2,
    features: [
      "Lead scoring & routing",
      "Pipeline & quotes",
      "WhatsApp & email sync",
      "200 AI credits/user/mo",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "₦35,000/user/mo",
    sub: "Advanced operations",
    icon: Building2,
    features: [
      "Advanced forecasting & AI",
      "Partner / distributor PRM",
      "Commission engine",
      "1,000 AI credits/user/mo",
    ],
    highlighted: false,
  },
  {
    name: "Custom",
    price: "Custom",
    sub: "Unlimited scale",
    icon: Pill,
    features: [
      "White-label deployment",
      "Dedicated infrastructure",
      "Custom AI models",
      "Data isolation",
    ],
    highlighted: false,
  },
];

type ActiveTab = "logistics" | "industry";

const LandingPricingSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<ActiveTab>("logistics");

  const renderLogisticsColumn = () => (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Truck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg leading-tight">Logistics Operator OS</h3>
          <p className="text-xs text-muted-foreground">Built for fleet operators, dispatch teams, and logistics companies.</p>
        </div>
      </div>
      <div className="grid gap-3 mt-5">
        {LOGISTICS_PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className={`${p.highlighted ? "border-primary/40 shadow-md ring-1 ring-primary/10" : "border-border/40"} bg-card/80 transition-shadow hover:shadow-lg`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <p.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">{p.name}</span>
                  {p.highlighted && (
                    <Badge className="bg-primary/10 text-primary text-[10px] ml-auto border-0">Popular</Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold tracking-tight">{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.sub}</span>
                </div>
                {"rateLimits" in p && (p as any).rateLimits && (
                  <p className="text-[10px] text-muted-foreground/70 mb-2 font-mono">{(p as any).rateLimits}</p>
                )}
                <ul className="space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button
        className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        onClick={() => navigate("/signup/company")}
      >
        Start Logistics OS <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderIndustryColumn = () => (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-infra-purple/10 flex items-center justify-center">
          <Store className="w-5 h-5 text-infra-purple" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg leading-tight">Industry Distribution OS</h3>
          <p className="text-xs text-muted-foreground">Built for sales teams, distributors, and manufacturers.</p>
        </div>
      </div>
      <div className="grid gap-3 mt-5">
        {INDUSTRY_PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className={`${p.highlighted ? "border-infra-purple/40 shadow-md ring-1 ring-infra-purple/10" : "border-border/40"} bg-card/80 transition-shadow hover:shadow-lg`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <p.icon className="w-4 h-4 text-infra-purple" />
                  <span className="font-semibold text-sm">{p.name}</span>
                  {p.highlighted && (
                    <Badge className="bg-infra-purple/10 text-infra-purple text-[10px] ml-auto border-0">Recommended</Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold tracking-tight">{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.sub}</span>
                </div>
                <ul className="space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-infra-purple shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-full mt-5 border-infra-purple/30 text-infra-purple hover:bg-infra-purple/10 gap-2"
        onClick={() => navigate("/industry/fmcg/auth")}
      >
        Start Industry OS <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Transparent, Usage-Based Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Two independent platforms. Two pricing models. Built for scale.
          </p>
        </motion.div>

        {/* Mobile tab selector */}
        {isMobile && (
          <div className="flex gap-2 mb-8 p-1 rounded-lg bg-muted/60">
            <button
              onClick={() => setActiveTab("logistics")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "logistics"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Truck className="w-4 h-4" /> Logistics OS
            </button>
            <button
              onClick={() => setActiveTab("industry")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "industry"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Store className="w-4 h-4" /> Industry OS
            </button>
          </div>
        )}

        {/* Desktop: side-by-side with divider | Mobile: tabbed */}
        {isMobile ? (
          <div>
            {activeTab === "logistics" ? renderLogisticsColumn() : renderIndustryColumn()}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="pr-8 border-r border-border/30">
              {renderLogisticsColumn()}
            </div>
            <div className="pl-8">
              {renderIndustryColumn()}
            </div>
          </div>
        )}

        {/* Interactive Pricing Simulator */}
        <motion.div
          className="mt-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-2">
              <Calculator className="w-4 h-4" /> Pricing Simulator
            </div>
            <h3 className="text-xl font-bold font-heading">See what you'll actually pay</h3>
            <p className="text-xs text-muted-foreground mt-1">Adjust the sliders to match your scale</p>
          </div>
          <PricingSimulator />
        </motion.div>

        {/* Positioning strip */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
            Not just software — Infrastructure
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-primary" /> Logistics operations</span>
            <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-infra-purple" /> Sales & distribution</span>
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Trade execution</span>
          </div>
        </motion.div>

        {/* Security / isolation message */}
        <motion.div
          className="mt-8 text-center glass-card p-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Each environment operates independently with{" "}
            <span className="text-foreground font-medium">full data isolation</span>.
            Logistics operators cannot access Industry OS and vice versa.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingPricingSection;
