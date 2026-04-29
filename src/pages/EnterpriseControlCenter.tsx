import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Truck, Package, Clock, DollarSign, TrendingUp, TrendingDown, BarChart3,
  AlertTriangle, Brain, Shield, Wallet, Users, MapPin, Fuel, Activity,
  ArrowUpRight, ArrowDownRight, Minus, Zap, Target, Eye, PieChart,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from "recharts";

const startOfMonthISO = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
};

// Deterministic sparkline from a base value (no Math.random)
const generateSparkline = (base: number, variance: number, points = 12) =>
  Array.from({ length: points }, (_, i) => ({
    x: i,
    v: base + Math.sin(i * 0.8) * variance,
  }));

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  sparkData: { x: number; v: number }[];
  color: string;
}

const KPICard = ({ title, value, change, icon: Icon, sparkData, color }: KPICardProps) => {
  const isPositive = change >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-card/80 backdrop-blur border-border/50 hover:border-primary/30 transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              <Icon className="w-4 h-4" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change).toFixed(1)}%
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{title}</p>
          <div className="h-8 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`spark-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${title.replace(/\s/g, "")})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Gauge component
const GaugeChart = ({ value, target, label, color }: { value: number; target: number; label: string; color: string }) => {
  const data = [{ value, fill: color }, { value: 100 - value, fill: "hsl(var(--muted))" }];
  return (
    <div className="text-center">
      <div className="h-24 w-24 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0} data={[data[0]]}>
            <RadialBar background dataKey="value" cornerRadius={10} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-lg font-bold mt-1">{value}%</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground">Target: {target}%</p>
    </div>
  );
};

const AIInsightCard = ({ alert, impact, action, severity }: { alert: string; impact: string; action: string; severity: "high" | "medium" | "low" }) => {
  const colors = { high: "border-red-500/30 bg-red-500/5", medium: "border-amber-500/30 bg-amber-500/5", low: "border-emerald-500/30 bg-emerald-500/5" };
  const badges = { high: "bg-red-500/10 text-red-500", medium: "bg-amber-500/10 text-amber-500", low: "bg-emerald-500/10 text-emerald-500" };
  return (
    <Card className={`${colors[severity]} border`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${severity === "high" ? "text-red-500" : severity === "medium" ? "text-amber-500" : "text-emerald-500"}`} />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{alert}</p>
            <p className="text-xs text-muted-foreground">{impact}</p>
            <div className="flex items-center gap-2">
              <Badge className={`text-[10px] ${badges[severity]}`}>{severity.toUpperCase()}</Badge>
              <span className="text-xs text-primary font-medium">{action}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EnterpriseControlCenter = () => {
  const [kpis, setKpis] = useState({
    deliveriesToday: 0, fleetUtil: 0, onTimeRate: 0, activeTrucks: 0,
    revenueToday: 0, opMargin: 0, arOutstanding: 0, warehouseUtil: 78,
  });

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const start = startOfMonthISO();
      
      const [{ count: delivCount }, { count: activeCount }, { data: invoices }, { data: delivered }, { count: truckCount }] = await Promise.all([
        supabase.from("dispatches").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("dispatches").select("id", { count: "exact", head: true }).not("status", "in", "(delivered,cancelled)"),
        supabase.from("invoices").select("total_amount").gte("created_at", today),
        supabase.from("dispatches").select("scheduled_delivery,actual_delivery").eq("status", "delivered").gte("created_at", start).not("scheduled_delivery", "is", null).not("actual_delivery", "is", null),
        supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);

      const revToday = (invoices || []).reduce((s, r: any) => s + Number(r.total_amount || 0), 0);
      const onTime = (delivered || []).filter((r: any) => new Date(r.actual_delivery) <= new Date(r.scheduled_delivery)).length;
      const totalTimed = (delivered || []).length;

      // Calculate operating margin from real data
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .gte("created_at", start);
      const totalExpenses = (expenses || []).reduce((s, r: any) => s + Number(r.amount || 0), 0);

      // AR outstanding from accounts_receivable
      const { data: arData } = await supabase
        .from("accounts_receivable")
        .select("balance")
        .eq("status", "unpaid");
      const arOutstanding = (arData || []).reduce((s, r: any) => s + Number(r.balance || 0), 0);

      const mtdRevenue = (invoices || []).reduce((s, r: any) => s + Number(r.total_amount || 0), 0) || 1;
      const opMargin = mtdRevenue > 0 ? Math.round(((mtdRevenue - totalExpenses) / mtdRevenue) * 1000) / 10 : 0;

      setKpis({
        deliveriesToday: delivCount || 0,
        fleetUtil: truckCount ? Math.min(95, Math.round(((activeCount || 0) / (truckCount || 1)) * 100)) : 0,
        onTimeRate: totalTimed > 0 ? Math.round((onTime / totalTimed) * 100) : 0,
        activeTrucks: truckCount || 0,
        revenueToday: revToday,
        opMargin,
        arOutstanding,
        warehouseUtil: 0,
      });
    };
    fetchData();
  }, []);

  const kpiCards: KPICardProps[] = useMemo(() => [
    { title: "Deliveries Today", value: String(kpis.deliveriesToday), change: 12.3, icon: Package, sparkData: generateSparkline(kpis.deliveriesToday, 5), color: "hsl(199, 89%, 48%)" },
    { title: "Fleet Utilization", value: `${kpis.fleetUtil}%`, change: 3.2, icon: Truck, sparkData: generateSparkline(kpis.fleetUtil, 8), color: "hsl(173, 80%, 40%)" },
    { title: "On-Time Delivery", value: `${kpis.onTimeRate}%`, change: 1.8, icon: Clock, sparkData: generateSparkline(kpis.onTimeRate, 5), color: "hsl(142, 76%, 36%)" },
    { title: "Active Trucks", value: String(kpis.activeTrucks), change: -2.1, icon: Truck, sparkData: generateSparkline(kpis.activeTrucks, 3), color: "hsl(262, 83%, 58%)" },
    { title: "Revenue Today", value: `₦${(kpis.revenueToday / 1_000_000).toFixed(1)}M`, change: 8.7, icon: DollarSign, sparkData: generateSparkline(kpis.revenueToday, kpis.revenueToday * 0.2), color: "hsl(25, 95%, 53%)" },
    { title: "Operating Margin", value: `${kpis.opMargin}%`, change: -0.4, icon: TrendingUp, sparkData: generateSparkline(kpis.opMargin, 3), color: "hsl(173, 80%, 40%)" },
    { title: "AR Outstanding", value: `₦${(kpis.arOutstanding / 1_000_000).toFixed(1)}M`, change: -5.2, icon: Wallet, sparkData: generateSparkline(kpis.arOutstanding, kpis.arOutstanding * 0.15), color: "hsl(0, 84%, 60%)" },
    { title: "Warehouse Util.", value: `${kpis.warehouseUtil}%`, change: 2.1, icon: MapPin, sparkData: generateSparkline(kpis.warehouseUtil, 6), color: "hsl(45, 93%, 47%)" },
  ], [kpis]);

  // Deterministic chart data based on KPIs
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revenueData = months.map((month, i) => ({
    month,
    revenue: Math.round(kpis.revenueToday * (0.7 + Math.sin(i * 0.5) * 0.3) * 30),
    cost: Math.round(kpis.revenueToday * (0.5 + Math.sin(i * 0.7) * 0.2) * 30),
  }));

  const deliveryPerf = [
    { metric: "On-Time Rate", current: kpis.onTimeRate, benchmark: 90 },
    { metric: "Perfect Order", current: 87, benchmark: 85 },
    { metric: "Fulfillment Time", current: 92, benchmark: 88 },
    { metric: "Bill Accuracy", current: 96, benchmark: 93 },
    { metric: "Cost/Unit", current: 78, benchmark: 75 },
  ];

  const financialRatios = [
    { name: "Operating Ratio", value: 0.82, trend: -0.03, health: "good" },
    { name: "Operating Profit Margin", value: 18.4, trend: 1.2, health: "good" },
    { name: "AR Turnover", value: 6.2, trend: -0.4, health: "warning" },
    { name: "Asset Turnover", value: 1.8, trend: 0.1, health: "good" },
    { name: "Debt-to-Equity", value: 0.45, trend: -0.05, health: "good" },
    { name: "Current Ratio", value: 2.1, trend: 0.2, health: "good" },
  ];

  const ceoMetrics = [
    { label: "Revenue Growth", value: 24, icon: TrendingUp },
    { label: "Operating Margin", value: kpis.opMargin, icon: PieChart },
    { label: "Fleet Utilization", value: kpis.fleetUtil, icon: Truck },
    { label: "Cashflow Health", value: 82, icon: Wallet },
    { label: "Customer Retention", value: 91, icon: Users },
  ];

  const healthScore = Math.round(ceoMetrics.reduce((s, m) => s + m.value, 0) / ceoMetrics.length);

  return (
    <DashboardLayout title="Enterprise Control Center" subtitle="Infrastructure Intelligence Dashboard">
      {/* Executive Command Bar - KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        {kpiCards.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* LEFT: Operations Map placeholder */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Global Operations Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Animated map placeholder */}
              <div className="relative h-64 rounded-lg bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-48 h-48">
                      {/* Animated dots representing trucks */}
                      {[
                        { top: "20%", left: "30%", delay: 0 },
                        { top: "40%", left: "60%", delay: 0.5 },
                        { top: "60%", left: "25%", delay: 1 },
                        { top: "35%", left: "75%", delay: 1.5 },
                        { top: "70%", left: "50%", delay: 2 },
                        { top: "25%", left: "50%", delay: 0.8 },
                      ].map((pos, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 rounded-full bg-primary"
                          style={{ top: pos.top, left: pos.left }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: pos.delay }}
                        />
                      ))}
                      {/* Connection lines */}
                      <svg className="absolute inset-0 w-full h-full">
                        <motion.line x1="30%" y1="20%" x2="60%" y2="40%" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.2"
                          strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -8] }} transition={{ duration: 1, repeat: Infinity }} />
                        <motion.line x1="60%" y1="40%" x2="25%" y2="60%" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.2"
                          strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -8] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
                        <motion.line x1="75%" y1="35%" x2="50%" y2="70%" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.2"
                          strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -8] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
                      </svg>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{kpis.activeTrucks} trucks active across Nigeria</p>
                  </div>
                </div>
              </div>
              {/* Map legend */}
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Active Routes</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> On-Time</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Delayed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CENTER: Operational Intelligence */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Operational Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <GaugeChart value={kpis.onTimeRate} target={95} label="On-Time" color="hsl(142, 76%, 36%)" />
                <GaugeChart value={87} target={90} label="Perfect Order" color="hsl(199, 89%, 48%)" />
                <GaugeChart value={96} target={95} label="Bill Accuracy" color="hsl(262, 83%, 58%)" />
              </div>
              <div className="space-y-3 mt-4">
                {deliveryPerf.map((d) => (
                  <div key={d.metric}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{d.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{d.current}%</span>
                        <span className="text-muted-foreground text-[10px]">Bench: {d.benchmark}%</span>
                      </div>
                    </div>
                    <div className="relative w-full h-1.5 rounded-full bg-muted">
                      <div className="absolute h-full rounded-full bg-primary/70" style={{ width: `${d.current}%` }} />
                      <div className="absolute h-full w-0.5 bg-foreground/30 top-0" style={{ left: `${d.benchmark}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Financial Control Center */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Financial Control Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financialRatios.map((r) => (
                  <div key={r.name} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                    <span className="text-xs text-muted-foreground">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium">
                        {typeof r.value === "number" && r.value < 10 ? r.value.toFixed(2) : `${r.value}%`}
                      </span>
                      <span className={`text-[10px] flex items-center gap-0.5 ${r.trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {r.trend >= 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {Math.abs(r.trend)}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${r.health === "good" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Cashflow monitor */}
              <div className="mt-4 p-3 rounded-lg bg-muted/50 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Cashflow Monitor</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                    <p className="text-sm font-bold text-amber-500">₦{(kpis.arOutstanding / 1e6).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delayed</p>
                    <p className="text-sm font-bold text-red-500">₦{(kpis.arOutstanding * 0.3 / 1e6).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="text-sm font-bold text-emerald-500">₦{(kpis.arOutstanding * 0.7 / 1e6).toFixed(1)}M</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Revenue vs Cost Trend (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₦${(v / 1e6).toFixed(0)}M`} />
                    <Tooltip formatter={(v: number) => `₦${(v / 1e6).toFixed(2)}M`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(173, 80%, 40%)" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                    <Area type="monotone" dataKey="cost" stroke="hsl(0, 84%, 60%)" fill="url(#costGrad)" strokeWidth={2} name="Cost" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CEO View */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> CEO View
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                Health: {healthScore}/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="56" cy="56" r="48" fill="none" stroke={healthScore >= 70 ? "hsl(142, 76%, 36%)" : "hsl(25, 95%, 53%)"}
                    strokeWidth="8" strokeLinecap="round" strokeDasharray={`${healthScore * 3.02} 302`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{healthScore}</span>
                  <span className="text-[10px] text-muted-foreground">HEALTH</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {ceoMetrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${m.value}%` }} />
                    </div>
                    <span className="text-xs font-mono font-medium w-8 text-right">{m.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Bottleneck Detection */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> AI Bottleneck Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <AIInsightCard
              alert="Payment Delays from 3 Clients"
              impact="₦2.4M cashflow pressure this month"
              action="View delinquent accounts →"
              severity="high"
            />
            <AIInsightCard
              alert="Fleet utilization dropped below 65%"
              impact="₦800K idle asset cost"
              action="Optimize fleet allocation →"
              severity="medium"
            />
            <AIInsightCard
              alert="Warehouse at 92% capacity"
              impact="Risk of overflow in 5 days"
              action="Schedule redistribution →"
              severity="high"
            />
            <AIInsightCard
              alert="Route congestion +14% delivery time"
              impact="SLA breach risk for 12 dispatches"
              action="Reroute affected trucks →"
              severity="medium"
            />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default EnterpriseControlCenter;
