import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingDown, EyeOff, CreditCard, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.5 } }),
};

const realityCards = [
  { icon: AlertTriangle, title: "Traffic Volatility", stat: "25%", statLabel: "efficiency lost daily", desc: "Delivery routes collapse daily. Lagos alone loses 25% delivery efficiency to unpredictable congestion.", color: "text-infra-orange", bg: "bg-infra-orange/10" },
  { icon: Package, title: "Retail Fragmentation", stat: "2M+", statLabel: "informal outlets", desc: "Millions of outlets with inconsistent ordering. No visibility after products leave the warehouse.", color: "text-info", bg: "bg-info/10" },
  { icon: TrendingDown, title: "Margin Leakage", stat: "10–15%", statLabel: "profit eroded", desc: "Poor route planning and blind promotions erode margins. Reactive route-to-market kills profitability.", color: "text-destructive", bg: "bg-destructive/10" },
  { icon: CreditCard, title: "Credit Default Risk", stat: "3×", statLabel: "higher default rate", desc: "Informal credit practices with zero scoring. Distributor and retailer defaults rise unmonitored.", color: "text-warning", bg: "bg-warning/10" },
  { icon: EyeOff, title: "Distributor Opacity", stat: "0%", statLabel: "post-warehouse visibility", desc: "Brands cannot see what happens after products leave. No execution intelligence, no accountability.", color: "text-muted-foreground", bg: "bg-muted/30" },
  { icon: Users, title: "Driver & Rep Fraud", stat: "₦8.2M", statLabel: "avg. annual loss", desc: "Ghost trips, fuel theft, falsified delivery confirmations — invisible without GPS-verified systems.", color: "text-infra-purple", bg: "bg-infra-purple/10" },
];

const LandingDistributionReality = () => (
  <section className="py-24 px-6 border-y border-border/30">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">The Nigerian Distribution Reality</Badge>
        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
          Nigeria's ₦40 Trillion Distribution Market<br />
          <span className="gradient-text">Runs on Guesswork.</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every logistics operator, distributor, and sales team faces the same structural challenges. 
          RouteAce replaces guesswork with intelligence.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {realityCards.map((card, i) => (
          <motion.div key={card.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Card className="h-full border-border/40 hover:border-border/70 transition-all bg-card/60 backdrop-blur-sm group">
              <CardContent className="pt-6">
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{card.title}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-2xl font-bold font-heading ${card.color}`}>{card.stat}</span>
                  <span className="text-[10px] text-muted-foreground">{card.statLabel}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-14 glass-card p-6 max-w-3xl mx-auto"
      >
        <p className="text-sm text-foreground font-medium mb-1">
          These are not software problems. They are <span className="text-primary">infrastructure problems.</span>
        </p>
        <p className="text-xs text-muted-foreground">
          RouteAce is the intelligence infrastructure that solves them at scale.
        </p>
      </motion.div>
    </div>
  </section>
);

export default LandingDistributionReality;
