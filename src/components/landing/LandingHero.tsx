import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Truck, LogIn, ArrowRight, Mail, Lock, Eye, EyeOff, Loader2,
  Globe, CheckCircle, Crown, Store, Target, Activity, MapPin,
  Package, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const useAnimatedCounter = (target: number, duration = 2500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const LandingHero = () => {
  const navigate = useNavigate();
  const { signIn, userRole } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const routes = useAnimatedCounter(4238);
  const orders = useAnimatedCounter(182442);

  const getRoleDestination = (role: string | null): string => {
    switch (role) {
      case "super_admin": return "/super-admin";
      case "org_admin": return "/org-admin";
      case "ops_manager": return "/ops-manager";
      case "finance_manager": return "/finance-manager";
      case "driver": return "/driver-dashboard";
      case "customer": return "/customer-portal";
      case "core_founder": case "core_builder": case "core_product":
      case "core_engineer": case "internal_team": return "/core/dashboard";
      default: return "/dashboard";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error("Enter email and password"); return; }
    setIsLoggingIn(true);
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) throw error;
      toast.success("Welcome back!");
      navigate(getRoleDestination(userRole));
    } catch (err: any) { toast.error(err.message || "Login failed"); }
    finally { setIsLoggingIn(false); }
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* NAV */}
      <header className="border-b border-border/30 bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-infra-blue-light flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="font-heading font-bold text-xl tracking-tight">RouteAce</h1>
              <p className="text-[10px] text-muted-foreground leading-tight tracking-wide uppercase">Distribution Intelligence Infrastructure</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Platform", target: "pillars" },
              { label: "Logistics OS", target: "logistics-os" },
              { label: "Industry OS", target: "industry-os" },
              { label: "ExportTech", target: "exporttech" },
              { label: "Pricing", target: "pricing" },
            ].map(n => (
              <Button key={n.label} variant="ghost" size="sm" onClick={() => scrollTo(n.target)} className="text-xs">{n.label}</Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => navigate("/global")} className="text-xs gap-1"><Globe className="w-3 h-3" /> Global</Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowLogin(!showLogin)} className="gap-2">
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
            <Button size="sm" className="bg-infra-orange hover:bg-infra-orange/90 text-primary-foreground font-semibold" onClick={() => navigate("/signup/company")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* LOGIN PANEL */}
      <AnimatePresence>
        {showLogin && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-b border-border/50 bg-muted/30 overflow-hidden">
            <form onSubmit={handleLogin} className="max-w-md mx-auto px-6 py-6 space-y-4">
              <h3 className="text-lg font-semibold text-center">Welcome Back</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@company.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="pl-10" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Sign In
              </Button>
              <div className="flex justify-between text-xs text-muted-foreground">
                <button type="button" onClick={() => navigate("/auth")} className="hover:text-foreground">Forgot password?</button>
                <button type="button" onClick={() => navigate("/core/login")} className="hover:text-foreground">Core Team Login →</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1200 700">
            <motion.path d="M200,400 Q400,200 600,350 T1000,300" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} />
            <motion.path d="M100,500 Q350,300 500,450 T900,200" stroke="hsl(var(--info))" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, delay: 1, repeat: Infinity, repeatDelay: 2 }} />
            <motion.path d="M300,600 Q500,350 700,500 T1100,250" stroke="hsl(var(--infra-orange))" strokeWidth="1" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }} />
            {[
              { cx: 250, cy: 380 }, { cx: 480, cy: 300 }, { cx: 650, cy: 400 },
              { cx: 820, cy: 280 }, { cx: 380, cy: 500 }, { cx: 950, cy: 350 },
            ].map((n, i) => (
              <motion.circle key={i} cx={n.cx} cy={n.cy} r="4" fill="hsl(var(--primary))"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, repeatDelay: 3 }} />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
              🇳🇬 Built in Nigeria · Scaled for Africa
            </Badge>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-[1.05] tracking-tight">
              <span className="text-foreground">Nigeria Moves on</span>
              <span className="gradient-text block mt-1">Distribution.</span>
              <span className="text-foreground block mt-1">RouteAce Runs It.</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-4">
              The intelligence infrastructure powering logistics, distribution, and export trade across Africa.
            </p>
            <p className="text-sm text-muted-foreground mb-10 tracking-wide">
              Logistics operators run fleets. Industry operators run markets. <span className="text-primary font-medium">RouteAce powers both.</span>
            </p>
          </motion.div>

          {/* Live metrics ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-14"
          >
            {[
              { icon: Activity, label: "Active Routes", value: routes.toLocaleString(), color: "text-primary" },
              { icon: Package, label: "Retail Orders Today", value: orders.toLocaleString(), color: "text-infra-orange" },
              { icon: TrendingUp, label: "Distribution Value", value: "$9.6M", color: "text-success" },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/60 flex items-center justify-center">
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="text-left">
                  <p className={`text-lg md:text-xl font-bold font-heading ${m.color}`}>{m.value}</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* TWO PILLAR CTAs */}
          <div id="pillars" className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
              <button
                onClick={() => navigate("/signup/company")}
                className="w-full text-left glass-card p-8 border-2 border-primary/20 hover:border-primary/50 transition-all group relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Truck className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2">I Run a Logistics Business</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Fleet operations, dispatch automation, route AI, SLA tracking, payroll, white-label reselling.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["AI Route Confidence Scoring", "Per-Drop & Subscription Billing", "White-Label Licensing", "PortoDash ExportTech"].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Crown className="w-4 h-4" /> Start as Logistics Operator <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <button
                onClick={() => scrollTo("industry-os")}
                className="w-full text-left glass-card p-8 border-2 border-infra-purple/20 hover:border-infra-purple/50 transition-all group relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-infra-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-infra-purple/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Store className="w-7 h-7 text-infra-purple" />
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2">I Run Sales & Distribution</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    FMCG, Pharma, Agri, Liquor, Building Materials — industry-native AI with regulatory enforcement.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["AI-Guided Journey Planning", "Regulatory Rules Engine", "Credit Intelligence", "Industry-Native KPIs"].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-infra-purple shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-infra-purple font-semibold text-sm">
                    <Target className="w-4 h-4" /> Explore Industry OS <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingHero;
