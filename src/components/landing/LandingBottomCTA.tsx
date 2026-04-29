import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck, Crown, Store, ArrowRight, Globe, Quote,
  Scale, Coins, Shield, BarChart3, MapPin, Ship,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.5 } }),
};

const LandingBottomCTA = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* KPI ENGINE */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-heading mb-3">Financial & KPI Engine</h2>
            <p className="text-xs text-muted-foreground">Auto-calculated · Current + 30-day trend + predictive forecast</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Operating Ratio", value: "—", trend: "Auto-calculated" },
              { label: "Profit Margin", value: "—", trend: "Auto-calculated" },
              { label: "Asset Turnover", value: "—", trend: "Auto-calculated" },
              { label: "DSO", value: "—", trend: "Auto-calculated" },
              { label: "On-Time Delivery", value: "—", trend: "Auto-calculated" },
              { label: "Perfect Order", value: "—", trend: "Auto-calculated" },
            ].map(kpi => (
              <div key={kpi.label} className="glass-card p-4 text-center hover:border-primary/30 transition-colors">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className="text-lg font-bold">{kpi.value}</p>
                <p className="text-[10px] text-primary font-medium">{kpi.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILT FOR NIGERIA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">🇳🇬 Nigeria First</Badge>
              <h2 className="text-3xl font-bold font-heading mb-4">
                Built for Nigerian <span className="gradient-text">Distribution Reality</span>
              </h2>
              <ul className="space-y-3">
                {[
                  "Nigerian traffic congestion modeling",
                  "Informal retail network intelligence",
                  "Distributor-driven market optimization",
                  "Complex corridor logistics (Lagos-Kano, East-West)",
                  "Geopolitical zone SLA frameworks",
                  "PAYE, NHF, Pension automation",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { city: "Lagos", desc: "Distribution density hub", score: "78" },
                  { city: "Abuja", desc: "Government & enterprise", score: "74" },
                  { city: "Kano", desc: "Northern corridor gateway", score: "66" },
                  { city: "Port Harcourt", desc: "Oil & gas logistics", score: "70" },
                ].map(c => (
                  <div key={c.city} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <p className="font-semibold text-sm">{c.city}</p>
                    <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                    <p className="text-lg font-bold text-primary mt-1">{c.score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold font-heading text-center mb-10">Trusted by Nigerian Operators</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { quote: "RouteAce cut our delivery planning time by 60%. The per-drop billing is perfect for our bike fleet.", name: "Chinedu O.", role: "E-commerce Fleet Owner", city: "Lagos" },
              { quote: "We now track SLA breaches in real time and auto-penalize on invoices. Game changer for haulage.", name: "Amaka N.", role: "Haulage Operator", city: "Abuja" },
              { quote: "The white-label feature lets us resell to 8 smaller operators. Recurring revenue from day one.", name: "Ibrahim M.", role: "Regional Distributor", city: "Port Harcourt" },
            ].map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="glass-card p-5 h-full">
                  <Quote className="w-6 h-6 text-primary/20 mb-3" />
                  <p className="text-xs text-foreground/80 mb-4 italic leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.role} · {t.city}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AFRICA SCALE */}
      <section className="py-12 px-6 border-y border-border/30">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { label: "Multi-Currency", icon: Coins },
            { label: "Multi-Tax Engine", icon: Scale },
            { label: "Cross-Border Corridors", icon: Globe },
            { label: "Regional Benchmarking", icon: BarChart3 },
            { label: "Regulatory Enforcement", icon: Shield },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <item.icon className="w-4 h-4 text-primary" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL VISION CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">The End State</p>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-3">
            RouteAce Is Not Logistics Software.
          </h2>
          <p className="text-2xl md:text-3xl font-bold gradient-text mb-8">
            It Is Africa's Distribution Intelligence Infrastructure.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            It protects margin. Predicts risk. Enforces compliance. Optimizes execution.
            Monetizes distribution infrastructure. Opens export access to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 bg-infra-orange hover:bg-infra-orange/90 text-primary-foreground text-base font-semibold" onClick={() => navigate("/signup/company")}>
              <Crown className="w-5 h-5 mr-2" /> Start as Logistics Operator
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-infra-purple/30 text-infra-purple hover:bg-infra-purple/10" onClick={() => navigate("/industry/fmcg/auth")}>
              <Store className="w-5 h-5 mr-2" /> Enter Industry OS
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-infra-orange/30 text-infra-orange hover:bg-infra-orange/10" onClick={() => navigate("/portodash")}>
              <Ship className="w-5 h-5 mr-2" /> Open ExportTech
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 py-10 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 mb-3">
                <Truck className="w-5 h-5 text-primary" />
                <span className="font-heading font-bold">RouteAce</span>
              </button>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Africa's Distribution Intelligence Infrastructure. Built in Nigeria, scaled for the continent.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Platform</h4>
              <div className="space-y-2">
                {["Logistics OS", "Industry OS", "ExportTech", "Trade Graph"].map(l => (
                  <p key={l} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Resources</h4>
              <div className="space-y-2">
                {["Documentation", "API Reference", "Case Studies", "Blog"].map(l => (
                  <p key={l} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Company</h4>
              <div className="space-y-2">
                {["About", "Careers", "Contact", "Press"].map(l => (
                  <p key={l} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 RouteAce. Africa's Distribution Intelligence Infrastructure.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <button onClick={() => navigate("/global")} className="hover:text-foreground transition-colors">🌍 Global</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingBottomCTA;
